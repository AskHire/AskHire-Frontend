import React from 'react';
import { IoIosSearch } from "react-icons/io";
import {FaUserCircle, FaBell} from "react-icons/fa";

export default function AdminHeader() {
  return (
    <div className="flex items-center justify-between">
            <div className="relative w-full max-w-lg">
              <input
                type="text"
                placeholder="Search jobs"
                className="w-full p-2 pl-10 border border-gray-300 shadow-xl rounded-3xl"
              />
              <IoIosSearch className="absolute text-gray-600 transform -translate-y-1/2 left-3 top-1/2" />
            </div>
            <div className="flex space-x-8">
              <FaBell className="text-2xl text-black" />
              <FaUserCircle className="text-2xl text-black" />
            </div>
          </div>
  )
}
