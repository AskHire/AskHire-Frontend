import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const Unauthorized = () => {
  const { currentUser } = useAuth();
  
  // Determine the appropriate dashboard based on user role
  const getDashboardLink = () => {
    if (!currentUser) return '/';
    
    switch (currentUser.role) {
      case 'Admin':
        return '/admin';
      case 'Manager':
        return '/manager';
      case 'Candidate':
        return '/candidate';
      default:
        return '/dashboard';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="mb-8 text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Access Denied</h1>
      
      <p className="text-xl text-gray-600 mb-8">
        You don't have permission to access this page.
      </p>
      
      {currentUser && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p>Your current role: <span className="font-semibold">{currentUser.role}</span></p>
          <p className="text-sm text-gray-500 mt-1">
            This page requires a different role level to access.
          </p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to={getDashboardLink()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Go to My Dashboard
        </Link>
        
        <Link
          to="/"
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;