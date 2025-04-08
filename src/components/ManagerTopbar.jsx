import React from 'react';
import { AiOutlineSearch, AiOutlineBell, AiOutlineUser } from 'react-icons/ai';

const ManagerTopbar = () => {
  return (
    <div>
      {/* Logo and topbar container */}
      <div className="flex items-center">
        {/* Logo section - left side */}
        
          
        
        
        {/* Search and icons section - right side */}
        <div className="flex-1 h-16 bg-gray-100 flex items-center justify-between px-4">
          {/* Search bar */}
          <div className="w-full max-w-xl relative mx-auto">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <AiOutlineSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full shadow-sm bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search jobs"
            />
          </div>
          
          {/* Divider */}
          <div className="h-6 w-px bg-gray-300 mx-4"></div>
          
          {/* Notification and profile icons */}
          <div className="flex items-center">
            <button className="p-2 text-gray-700 hover:text-gray-900">
              <AiOutlineBell size={22} />
            </button>
            <button className="p-2 text-gray-700 hover:text-gray-900 ml-2">
              <div className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                <AiOutlineUser size={20} className="text-gray-600" />
              </div>
            </button>
          </div>
        </div>
      </div>
      
      </div>
    
  );
};

export default ManagerTopbar;