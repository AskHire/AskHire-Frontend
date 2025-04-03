import React from 'react';

const CongratulationsCard = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="border border-gray-300 rounded-xl p-8 w-80 flex flex-col items-center justify-center shadow-md bg-white">
        {/* Checkmark Icon */}
        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-white" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        
        {/* Congratulations Text */}
        <h1 className="text-2xl font-bold text-green-500 mb-4">Congratulations!</h1>
        
        {/* Match Score Card */}
        <div className="bg-green-100 w-full rounded-xl p-4 mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-gray-600 text-sm">Match Score</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg 
                  key={star}
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-green-500" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" 
                  />
                </svg>
              ))}
            </div>
          </div>
          <div className="text-4xl font-bold text-green-500 text-center">93%</div>
        </div>
        
        {/* Continue Button */}
        <button className="bg-blue-600 text-white w-full py-3 rounded-lg flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" 
              clipRule="evenodd" 
            />
          </svg>
          Continue to Interview
        </button>
      </div>
    </div>
  );
};

export default CongratulationsCard;