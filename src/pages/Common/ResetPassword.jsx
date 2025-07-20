import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract userId and token from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('userId');
    const resetToken = queryParams.get('token');

    if (!id || !resetToken) {
      setError('Invalid or missing password reset link. Please ensure you clicked the full link from your email.');
    } else {
      setUserId(id);
      setToken(resetToken);
    }
  }, [location]);

  useEffect(() => {
    setError(''); // Clear error when password fields change
    setMessage(''); // Clear message when password fields change
  }, [newPassword, confirmNewPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    // Basic client-side validation
    if (!newPassword || !confirmNewPassword) {
      setError('All password fields are required.');
      setIsLoading(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      setIsLoading(false);
      return;
    }

    if (!userId || !token) {
      setError('Invalid password reset request. User ID or token is missing from the link.');
      setIsLoading(false);
      return;
    }

    try {
      // Call the new service method to reset the password
      const response = await authService.resetPassword(userId, token, newPassword, confirmNewPassword);
      setMessage(response.message || 'Your password has been reset successfully. You can now log in.');
      setNewPassword('');
      setConfirmNewPassword('');
      // Optionally redirect to login after a short delay
      setTimeout(() => {
        navigate('/login', { state: { message: 'Password reset successful. Please log in with your new password.' } });
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password. The link might be invalid or expired, or your new password does not meet requirements.');
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
            <p className="text-gray-600">Enter your new password below.</p>
          </div>

          {message && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative" role="alert">
              <span className="block sm:inline">{message}</span>
            </div>
          )}
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {userId && token ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  placeholder="New Password"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  placeholder="Confirm New Password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          ) : (
            <div className="text-center text-red-700">
              <p>Error: This link is invalid or incomplete.</p>
              <Link to="/forgot-password" className="text-blue-600 hover:underline mt-4 block">
                Request a new password reset link
              </Link>
            </div>
          )}

          <div className="text-center mt-6">
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;