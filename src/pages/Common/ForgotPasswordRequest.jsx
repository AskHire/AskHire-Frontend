import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

const ForgotPasswordRequest = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear error when email changes, but don't clear message if it was set for a successful submission
    setError('');
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email) {
      setError('Email is required.');
      setIsLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      // Call the service method to request password reset
      const response = await authService.requestPasswordReset(email);
      
      // Navigate to the login page with a success message in state
      navigate('/login', { 
        state: { 
          message: response.message || 'If an account with that email exists, a password reset link has been sent to your inbox.' 
        } 
      });

    } catch (err) {
      // Display the error message from the backend or a default one
      setError(err.message || 'Failed to send password reset link. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-screen h-screen bg-white relative overflow-hidden">
      <button
        onClick={handleHomeClick}
        className="absolute top-0 right-0 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 p-2 transition-all duration-200 shadow-sm hover:shadow-md z-10"
        title="Go to Home"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="hidden md:flex md:w-2/5 relative overflow-hidden rounded-r-3xl">
        <div className="w-full h-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative">
          <div className="absolute top-0 right-0 w-full h-full">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 L60,0 Q80,20 85,50 Q80,80 60,100 L0,100 Z"
                fill="url(#gradient)"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white bg-opacity-10"></div>
          <div className="absolute bottom-32 left-20 w-24 h-24 rounded-full bg-white bg-opacity-5"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-white bg-opacity-10"></div>
        </div>
      </div>

      <div className="w-full md:w-3/5 flex items-center justify-center px-8">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
            <p className="text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
          </div>

          {/* This message state is no longer needed here, as we navigate directly */}
          {/* {message && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative" role="alert">
              <span className="block sm:inline">{message}</span>
            </div>
          )} */}
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                placeholder="Email address"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Sending Link...' : 'Send Reset Link'}
            </button>

            <div className="text-center mt-6">
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordRequest;