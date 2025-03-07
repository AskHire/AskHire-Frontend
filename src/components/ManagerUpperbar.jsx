import React from 'react';
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';

const ManagerUpperbar = () => {
  return (
    <div className="bg-gray-100 p-4 flex justify-end items-center">
      {/* Search Bar */}
      <div className="relative flex items-center bg-white px-4 py-2 rounded-full shadow-sm w-[400px]">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search jobs"
          className="outline-none bg-transparent w-full text-gray-600"
        />
      </div>

      {/* Icons Section */}
      <div className="flex items-center ml-6 space-x-6">
        <div className="border-r h-6 border-gray-300"></div>
        <FaBell className="text-gray-700 text-xl cursor-pointer hover:text-gray-900" />
        <FaUserCircle className="text-gray-700 text-2xl cursor-pointer hover:text-gray-900" />
      </div>
    </div>
  );
};

export default ManagerUpperbar;
