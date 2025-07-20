import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Keep a top-level error state if needed
  const navigate = useNavigate();

  // Event listener for global token refresh failures
  useEffect(() => {
    const handleTokenRefreshFailure = () => {
      console.log('Token refresh failed event received, logging out');
      setCurrentUser(null);

      // List of public paths that don't require re-login on session expiry
      const publicPaths = ['/', '/login', '/signup', '/unauthorized', '/aboutus', '/jobs'];
      const currentPath = window.location.pathname;

      if (!publicPaths.includes(currentPath)) {
        navigate('/login', { state: { message: 'Your session has expired. Please log in again.' } });
      }
    };

    window.addEventListener('auth:tokenRefreshFailed', handleTokenRefreshFailure);
    
    return () => {
      window.removeEventListener('auth:tokenRefreshFailed', handleTokenRefreshFailure);
    };
  }, [navigate]);

  // Initial authentication check and periodic token check
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('Initializing auth for path:', window.location.pathname);
      try {
        setLoading(true);
        
        let user = await authService.getCurrentUser(false); // Try without forced refresh first
        
        if (!user) {
          console.log('No user found with current token, trying to refresh...');
          try {
            await authService.forceTokenRefresh(); // Force a refresh
            user = await authService.getCurrentUser(false); // Re-fetch user after refresh
          } catch (refreshError) {
            console.log('Refresh attempt failed during initialization', refreshError);
          }
        }
        
        if (user) {
          console.log('User authenticated:', user);
          setCurrentUser(user);
          validateUserAccess(user.role); // Validate user's access path
        } else {
          console.log('User not authenticated after refresh attempts');
          setCurrentUser(null);
          
          const publicPaths = ['/', '/login', '/signup', '/unauthorized', '/aboutus', '/jobs'];
          const currentPath = window.location.pathname;
          if (!publicPaths.includes(currentPath)) {
            // Only redirect if not already on a public path
            navigate('/login', { 
              state: { message: 'Session expired. Please log in again.' } 
            });
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message); // Set context-level error for general issues
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    initializeAuth();
    
    // Set up periodic token check to refresh before expiry
    const tokenCheckInterval = setInterval(async () => {
      if (!authService.isAuthenticated()) {
        console.log('Token invalid in periodic check, attempting refresh');
        try {
          await authService.forceTokenRefresh();
        } catch (e) {
          console.error('Periodic token refresh failed');
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => {
      clearInterval(tokenCheckInterval); // Clean up interval on component unmount
    };
  }, [navigate]);

  // Function that validates user's current path based on their role
  const validateUserAccess = (role) => {
    const currentPath = window.location.pathname;
    
    // Define role-specific path patterns
    const rolePathPatterns = {
      'Admin': /^\/admin($|\/.*)/,     // Matches /admin or any path starting with /admin/
      'Manager': /^\/manager($|\/.*)/, // Matches /manager or any path starting with /manager/
      'Candidate': /^\/candidate($|\/.*)/, // Matches /candidate or any path starting with /candidate/
    };
    
    const publicPaths = ['/', '/login', '/signup', '/unauthorized', '/aboutus', '/jobs'];
    
    // If user is on a public path, no need to redirect
    if (publicPaths.includes(currentPath)) {
      return;
    }
    
    // Check if user is on a valid path for their role
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

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors before new login attempt
      
      await authService.login({ email, password });
      const user = await authService.getCurrentUser(); // Fetch user details after successful login
      
      if (!user) {
        throw new Error('Login successful but unable to get user information.');
      }
      
      setCurrentUser(user);
      
      return user; // Return user object for redirection logic in Login.jsx
    } catch (err) {
      setError(err.message || 'Login failed.'); // Set the specific error message from authService
      throw err; // Re-throw to be caught by the component
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setCurrentUser(null);
      navigate('/login'); // Redirect to login page after logout
    } catch (err) {
      setError(err.message || 'Logout failed.');
      setCurrentUser(null); // Ensure user is null even if logout API call fails
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh user data from the token
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