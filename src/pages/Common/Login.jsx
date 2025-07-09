import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setStatusMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const getDefaultPath = (role) => {
    switch (role) {
      case 'Admin':
        return '/admin';
      case 'Manager':
        return '/manager';
      case 'Candidate':
        return '/candidate';
      default:
        return '/unauthorized';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatusMessage('');
    setIsLoading(true);

    try {
      const user = await login(email, password);
      console.log('Login successful for user:', user?.email);
      
      const defaultPath = getDefaultPath(user.role);
      const redirectPath = location.state?.from?.pathname || defaultPath;
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-screen h-screen bg-white relative overflow-hidden">
      {/* Close/Home Button in Top Right Corner of Full Page */}
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

      {/* Left Side - Blue Curved Background */}
      <div className="hidden md:flex md:w-2/5 relative overflow-hidden rounded-r-3xl">
        <div className="w-full h-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative">
          {/* Curved shape */}
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
          
          {/* Decorative circles */}
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white bg-opacity-10"></div>
          <div className="absolute bottom-32 left-20 w-24 h-24 rounded-full bg-white bg-opacity-5"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-white bg-opacity-10"></div>
        </div>
      </div>
      
      {/* Right Side - Login Form */}
      <div className="w-full md:w-3/5 flex items-center justify-center px-8">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Log in</h1>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              Welcome Back 
              <span className="text-2xl">👋</span>
            </h2>
          </div>
          
          {/* Status and Error Messages */}
          {statusMessage && (
            <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg relative" role="alert">
              <span className="block sm:inline">{statusMessage}</span>
            </div>
          )}
          
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
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
            
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                placeholder="Password"
                required
              />
              <div className="text-right mt-2">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                  Forgot Password?
                </a>
              </div>
            </div>
            
            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading || authLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
            >
              {isLoading || authLoading ? 'Signing in...' : 'Log In'}
            </button>
            
            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <span className="text-gray-600">Don't you have an account? </span>
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;