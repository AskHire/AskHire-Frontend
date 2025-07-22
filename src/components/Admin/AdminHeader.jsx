import React, { useState, useEffect } from "react";
import { FaBell, FaBars } from "react-icons/fa";
import axios from "axios";
import ProfileModal from "../ProfileModal";

export default function AdminHeader() {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [userFirstLetter, setUserFirstLetter] = useState("U"); // Default to U if firstName missing

  useEffect(() => {
    axios
      .get("http://localhost:5190/api/profile", { withCredentials: true })
      .then((res) => {
        setProfilePicture(res.data.profilePictureUrl);
        setUserFirstLetter(res.data.firstName?.charAt(0).toUpperCase() || "U");
      })
      .catch((err) => console.error("Failed to fetch profile", err));
  }, []);

  const handleAvatarChange = (newAvatarUrl) => {
    setProfilePicture(newAvatarUrl);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
      
      {/* Left section: toggle */}
      <div className="flex items-center flex-1 min-w-[200px] gap-2">
        <button className="p-2 bg-white rounded shadow-md sm:hidden">
          <FaBars />
        </button>
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
            <div className="flex items-center justify-center w-8 h-8 font-semibold text-white uppercase bg-blue-500 rounded-full">
              {userFirstLetter}
            </div>
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
