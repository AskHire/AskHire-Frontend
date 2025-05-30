import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust the path as needed

export default function Banner() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    navigate(isAuthenticated ? '/jobs' : '/login');
  };

  return (
    <div className="w-full bg-blue-600 py-32 px-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-blue-500 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-blue-400 rounded-full opacity-20"></div>
      </div>
      
      {/* Content */}
      <div className="z-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Find Your Perfect Career Opportunity</h1>
        <p className="text-lg text-blue-50 mb-8">Discover jobs that match your skills and aspirations</p>
        <button
          onClick={handleGetStarted}
          className="bg-white text-blue-600 font-medium py-2 px-6 rounded-full hover:bg-blue-50 transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
