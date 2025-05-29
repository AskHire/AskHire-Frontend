import { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', formData);
  };


  return (
    <div className="flex min-h-screen bg-white">
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
      <div className="w-full md:w-1/2 flex items-center justify-center pl-36 px-8 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Log in</h1>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              Welcome Back 
              <span className="text-2xl">👋</span>
            </h2>
          </div>
          
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
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
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
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
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
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              Log In
            </button>
            
            
            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <span className="text-gray-600">Don't you have an account? </span>
              <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;