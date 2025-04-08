import React from 'react';

const Navbar = () => {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <a href="" className="text-xl font-bold text-blue-600">
            Ask
          </a>
          <a href="" className="text-xl font-bold text-base-600">
            Hire
          </a>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8 text-lg">
          <a href="/home" className="text-grey-600 hover:text-blue-700 hover:font-bold">
            Home
          </a>
          <a href="/jobs" className="text-gray-600 hover:text-blue-700 hover:font-bold">
            Jobs
          </a>
          <a href="/aboutus" className="text-gray-600 hover:text-blue-700 hover:font-bold">
            About Us
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          <button className="px-4 py-1.5 text-sm font-medium text-white bg-gray-800 rounded-full hover:bg-gray-900">
            SignUp
          </button>
          <button className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;