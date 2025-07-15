import React, { useEffect, useState } from 'react';
import { AiOutlineSearch, AiOutlineBell } from 'react-icons/ai';
import axios from 'axios';
import ProfileModal from './ProfileModal'; // Ensure the path is correct

const ManagerTopbar = () => {
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5190/api/profile", { withCredentials: true })
      .then((res) => setProfile(res.data))
      .catch(console.error);
  }, []);

  const handleAvatarChange = (newUrl) => {
    setProfile((prev) => ({ ...prev, profilePictureUrl: newUrl }));
  };

  const getInitial = () => {
    return profile?.firstName?.charAt(0)?.toUpperCase() || '?';
  };

  const getProfileImage = () => {
    if (profile?.profilePictureUrl) {
      return `http://localhost:5190${profile.profilePictureUrl}`;
    }
    return null;
  };

  return (
    <>
      <div className="flex items-center">
        {/* Search and icons section - right side */}
        <div className="flex items-center justify-between flex-1 h-16 px-4">
          {/* Search bar */}
          <div className="relative w-full max-w-xl mx-auto">
            <div className="absolute inset-y-0 flex items-center pointer-events-none left-3">
              <AiOutlineSearch className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full py-2 pl-10 pr-3 placeholder-gray-500 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search jobs"
            />
          </div>

          {/* Divider */}
          <div className="w-px h-6 mx-4 bg-gray-300"></div>

          {/* Notification and profile icons */}
          <div className="flex items-center">
            <button className="p-2 text-gray-700 hover:text-gray-900">
              <AiOutlineBell size={22} />
            </button>

            {/* Profile Section */}
            <button
              onClick={() => setShowModal(true)}
              className="p-2 ml-2 text-gray-700 hover:text-gray-900"
            >
              {getProfileImage() ? (
                <img
                  src={getProfileImage()}
                  alt="Profile"
                  className="object-cover w-8 h-8 border border-gray-300 rounded-full"
                />
              ) : (
                <div className="flex items-center justify-center w-8 h-8 font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-full">
                  {getInitial()}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showModal && (
        <ProfileModal
          onClose={() => setShowModal(false)}
          onAvatarChange={handleAvatarChange}
        />
      )}
    </>
  );
};

export default ManagerTopbar;
