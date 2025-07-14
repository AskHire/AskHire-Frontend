import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { FaUserCircle, FaBell, FaBars } from "react-icons/fa";
import axios from "axios";
import ProfileModal from "../ProfileModal";

export default function AdminHeader() {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5190/api/profile", { withCredentials: true })
      .then((res) => setProfilePicture(res.data.profilePictureUrl))
      .catch((err) => console.error("Failed to fetch profile", err));
  }, []);

  const handleAvatarChange = (newAvatarUrl) => {
    setProfilePicture(newAvatarUrl);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
      
      {/* Left section: toggle + search bar */}
      <div className="flex items-center flex-1 min-w-[200px] gap-2">
        {/* Sidebar toggle button (optional if sidebar is collapsible) */}
        <button className="p-2 bg-white rounded shadow-md sm:hidden">
          <FaBars />
        </button>

        {/* Search bar */}
        <div className="relative w-full sm:max-w-md md:max-w-lg">
          <input
            type="text"
            placeholder="Search jobs"
            className="w-full p-2 pl-10 border border-gray-300 shadow-md rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <IoIosSearch className="absolute text-gray-600 transform -translate-y-1/2 left-3 top-1/2" />
        </div>
      </div>

      {/* Right section: icons */}
      <div className="flex items-center space-x-4 sm:space-x-6">
        <FaBell
          className="text-2xl text-gray-700 cursor-pointer hover:text-gray-900"
          title="Notifications"
        />

        <button
          onClick={() => setShowProfileModal(true)}
          title="Profile"
          className="focus:outline-none"
        >
          {profilePicture ? (
            <img
              src={`http://localhost:5190${profilePicture}`}
              alt="Avatar"
              className="object-cover w-8 h-8 border border-gray-300 rounded-full hover:border-blue-400"
            />
          ) : (
            <FaUserCircle className="text-2xl text-gray-700 hover:text-gray-900" />
          )}
        </button>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal
          onClose={() => setShowProfileModal(false)}
          onAvatarChange={handleAvatarChange}
        />
      )}
    </div>
  );
}
