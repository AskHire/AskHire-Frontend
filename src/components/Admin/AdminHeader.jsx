import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
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
    <div className="w-full px-4 pt-3 ">
      <div className="ml-auto flex items-center justify-end gap-4 max-w-[300px]">
        {/* Right section: icons */}
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

        {/* Profile Modal */}
        {showProfileModal && (
          <ProfileModal
            onClose={() => setShowProfileModal(false)}
            onAvatarChange={handleAvatarChange}
          />
        )}
      </div>
    </div>
  );
}
