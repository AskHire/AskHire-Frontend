import React from 'react';
import { IoIosSearch } from "react-icons/io";
import { FaUserCircle, FaBell } from "react-icons/fa";

export default function AdminHeader() {
  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      {/* Search Bar */}
      <div className="relative w-full sm:max-w-md md:max-w-lg">
        <input
          type="text"
          placeholder="Search jobs"
          className="w-full p-2 pl-10 border border-gray-300 shadow-md rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <IoIosSearch className="absolute text-gray-600 transform -translate-y-1/2 left-3 top-1/2" />
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-4 sm:space-x-6">
        <FaBell className="text-2xl text-gray-700 transition duration-200 cursor-pointer hover:text-gray-900" />
        <FaUserCircle className="text-2xl text-gray-700 transition duration-200 cursor-pointer hover:text-gray-900" />
      </div>
    </div>
  );
}
