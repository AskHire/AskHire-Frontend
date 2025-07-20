import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const EmailVerificationStatus = () => {
  const location = useLocation();
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Parse query parameters from the URL
    const queryParams = new URLSearchParams(location.search);
    setStatus(queryParams.get('status') || 'unknown'); // 'success', 'failure', 'error'
    setMessage(queryParams.get('message') || 'An unknown error occurred during email verification.');
  }, [location]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        {status === 'success' ? (
          <>
            <div className="text-green-500 text-6xl mb-4">
              {/* You can use an SVG icon or Font Awesome if configured */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Email Confirmed!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200">
              Go to Login
            </Link>
          </>
        ) : (
          // Handles 'failure' and 'error' status
          <>
            <div className="text-red-500 text-6xl mb-4">
              {/* You can use an SVG icon or Font Awesome if configured */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link to="/signup" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-200">
              Try Registering Again
            </Link>
            <Link to="/" className="text-blue-600 hover:underline block mt-4">
              Go to Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationStatus;