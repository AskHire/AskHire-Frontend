import React, { useState } from 'react';
import { FcGoogle } from "react-icons/fc";

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
        // Handle login 
        console.log('Login submitted:', formData);
      };
  return (
    <div className="flex min-h-screen bg-white">
    {/* Left Side - Blue Background */}
    <div className="hidden md:block md:w-2/5 bg-blue-500 relative rounded-r-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-50 rounded-r-3xl "></div>
    </div>
    
    {/* Right Side - Login Form */}
    <div className="w-full md:w-3/5 px-16 py-4">
      <h2 className="text-3xl font-bold mb-8">Log in</h2>
      <p className="text-xl mb-8">Welcome Back 👋</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="flex justify-end mt-1">
            <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
              Forgot Password?
            </a>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Log in
        </button>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>
        
       <button className="w-full mt-4 py-3 border border-gray-300 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-50">
          <FcGoogle />
          <span>Sign in with Google</span>
        </button>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Do not you have an account?{' '}
          <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </a>
        </p>
      </div>
    </div>
  </div>
  )
}

export default Login;