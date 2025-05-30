// import { useState } from 'react';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Login submitted:', formData);
//   };


//   return (
//     <div className="flex min-h-screen bg-white">
//       {/* Left Side - Blue Curved Background */}
//       <div className="hidden md:flex md:w-2/5 relative overflow-hidden rounded-r-3xl">
//         <div className="w-full h-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative">
//           {/* Curved shape */}
//           <div className="absolute top-0 right-0 w-full h-full">
//             <svg 
//               viewBox="0 0 100 100" 
//               className="w-full h-full"
//               preserveAspectRatio="none"
//             >
//               <path 
//                 d="M0,0 L60,0 Q80,20 85,50 Q80,80 60,100 L0,100 Z" 
//                 fill="url(#gradient)"
//               />
//               <defs>
//                 <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                   <stop offset="0%" stopColor="#60a5fa" />
//                   <stop offset="50%" stopColor="#3b82f6" />
//                   <stop offset="100%" stopColor="#2563eb" />
//                 </linearGradient>
//               </defs>
//             </svg>
//           </div>
          
//           {/* Decorative circles */}
//           <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white bg-opacity-10"></div>
//           <div className="absolute bottom-32 left-20 w-24 h-24 rounded-full bg-white bg-opacity-5"></div>
//           <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-white bg-opacity-10"></div>
//         </div>
//       </div>
      
//       {/* Right Side - Login Form */}
//       <div className="w-full md:w-1/2 flex items-center justify-center pl-36 px-8 py-12">
//         <div className="w-full max-w-md">
//           {/* Header */}
//           <div className="mb-8">
//             <h1 className="text-2xl font-bold text-gray-900 mb-2">Log in</h1>
//             <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//               Welcome Back 
//               <span className="text-2xl">👋</span>
//             </h2>
//           </div>
          
//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Email Field */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
//                 required
//               />
//             </div>
            
//             {/* Password Field */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
//                 required
//               />
//               <div className="text-right mt-2">
//                 <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
//                   Forgot Password?
//                 </a>
//               </div>
//             </div>
            
//             {/* Login Button */}
//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
//             >
//               Log In
//             </button>
            
            
//             {/* Sign Up Link */}
//             <div className="text-center mt-6">
//               <span className="text-gray-600">Don't you have an account? </span>
//               <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
//                 Sign up
//               </a>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>
        
        {statusMessage && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{statusMessage}</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading || authLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading || authLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
