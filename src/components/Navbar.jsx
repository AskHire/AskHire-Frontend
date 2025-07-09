import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-blue-600">
            AskHire
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8 text-lg">
          <Link to="/" className="text-gray-600 hover:text-blue-700 hover:font-bold">
            Home
          </Link>
          <Link to="/jobs" className="text-gray-600 hover:text-blue-700 hover:font-bold">
            Jobs
          </Link>

          {isAuthenticated && (
            <>
              {/* Role-specific Dashboard link */}
              <Link
                to={`/${currentUser?.role.toLowerCase()}`}
                className="text-gray-600 hover:text-blue-700 hover:font-bold"
              >
                Dashboard
              </Link>

              {/* Interviews link - only for Candidate */}
              {currentUser?.role === 'Candidate' && (
                <Link
                  to="/candidate/interview"
                  className="text-gray-600 hover:text-blue-700 hover:font-bold"
                >
                  Interviews
                </Link>
              )}
            </>
          )}

          <Link to="/aboutus" className="text-gray-600 hover:text-blue-700 hover:font-bold">
            About Us
          </Link>
        </div>

        {/* Auth Section */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/signup">
                <button className="px-4 py-1.5 text-sm font-medium text-white bg-gray-800 rounded-full hover:bg-gray-900">
                  SignUp
                </button>
              </Link>
              <Link to="/login">
                <button className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700">
                  Login
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;