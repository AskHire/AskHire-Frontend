// AuthContext.jsx

import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleTokenRefreshFailure = () => {
      console.log('Token refresh failed event received, logging out');
      setCurrentUser(null);

      const publicPathsRegex = [/^\/$/, /^\/login$/, /^\/signup$/, /^\/unauthorized$/, /^\/aboutus$/, /^\/jobs$/, /^\/job\/[^/]+$/];
      const currentPath = window.location.pathname;

      const isCurrentPathPublic = publicPathsRegex.some(pattern => pattern.test(currentPath));

      if (!isCurrentPathPublic) {
        navigate('/login', { state: { message: 'Your session has expired. Please log in again.' } });
      }
    };

    window.addEventListener('auth:tokenRefreshFailed', handleTokenRefreshFailure);
    
    return () => {
      window.removeEventListener('auth:tokenRefreshFailed', handleTokenRefreshFailure);
    };
  }, [navigate]);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('Initializing auth for path:', window.location.pathname);
      try {
        setLoading(true);
        
        let user = await authService.getCurrentUser(false);
        
        if (!user) {
          console.log('No user found with current token, trying to refresh...');
          try {
            await authService.forceTokenRefresh();
            user = await authService.getCurrentUser(false);
          } catch (refreshError) {
            console.log('Refresh attempt failed during initialization', refreshError);
          }
        }
        
        if (user) {
          console.log('User authenticated:', user);
          validateUserAccess(user.role);
        } else {
          console.log('User not authenticated after refresh attempts');
          setCurrentUser(null);
          
          const publicPathsRegex = [/^\/$/, /^\/login$/, /^\/signup$/, /^\/unauthorized$/, /^\/aboutus$/, /^\/jobs$/, /^\/job\/[^/]+$/];
          const currentPath = window.location.pathname;
          
          const isCurrentPathPublic = publicPathsRegex.some(pattern => pattern.test(currentPath));
          if (!isCurrentPathPublic) {
            navigate('/login', { 
              state: { message: 'Session expired. Please log in again.' } 
            });
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    initializeAuth();
    
    const tokenCheckInterval = setInterval(async () => {
      if (!authService.isAuthenticated()) {
        console.log('Token invalid in periodic check, attempting refresh');
        try {
          await authService.forceTokenRefresh();
        } catch (e) {
          console.error('Periodic token refresh failed');
        }
      }
    }, 5 * 60 * 1000);
    
    return () => {
      clearInterval(tokenCheckInterval);
    };
  }, [navigate]);

  const validateUserAccess = (role) => {
    const currentPath = window.location.pathname;
    
    const rolePathPatterns = {
      'Admin': /^\/admin($|\/.*)/,
      'Manager': /^\/manager($|\/.*)/,
      'Candidate': /^\/candidate($|\/.*)/,
    };
    
    // UPDATED: Use an array of regex patterns for public paths, including /job/:id
    const publicPathsRegex = [
      /^\/$/,              // Home
      /^\/login$/,         // Login
      /^\/signup$/,        // Signup
      /^\/unauthorized$/,  // Unauthorized
      /^\/aboutus$/,       // About Us
      /^\/jobs$/,          // All Jobs list
      /^\/job\/[^/]+$/,    // Specific Job details: /job/some-uuid-or-id
      /^\/verify-email-status$/, // Add if needed, as it's common
      /^\/forgot-password$/, // Add if needed
      /^\/reset-password$/,  // Add if needed
    ];
    
    // Check if the current path matches any of the public path regex patterns
    const isCurrentPathPublic = publicPathsRegex.some(pattern => pattern.test(currentPath));

    if (isCurrentPathPublic) {
      // User is on a public path, no need to redirect, regardless of role
      return;
    }
    
    // If not a public path, then check against role-specific patterns
    const rolePattern = rolePathPatterns[role];
    if (rolePattern && rolePattern.test(currentPath)) {
      // User is on a valid path for their role, no redirect needed
      return;
    }
    
    // User is on an invalid path for their role, redirect to appropriate dashboard
    console.log(`User with role ${role} accessing invalid path ${currentPath}, redirecting`);
    if (role === 'Admin') {
      navigate('/admin');
    } else if (role === 'Manager') {
      navigate('/manager');
    } else if (role === 'Candidate') {
      navigate('/candidate');
    } else {
      navigate('/unauthorized');
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.login({ email, password });
      const user = await authService.getCurrentUser();
      
      if (!user) {
        throw new Error('Login successful but unable to get user information.');
      }
      
      setCurrentUser(user);
      
      return user;
    } catch (err) {
      setError(err.message || 'Login failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setCurrentUser(null);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Logout failed.');
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      setLoading(true);
      await authService.forceTokenRefresh();
      const user = await authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to refresh user data:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    refreshUserData,
    isAuthenticated: !!currentUser,
    hasRole: (role) => currentUser?.role === role,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};