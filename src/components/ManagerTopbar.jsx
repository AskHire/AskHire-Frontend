import React, { useState, useEffect, useRef } from "react"; // Import useRef
import { AiOutlineSearch, AiOutlineBell } from "react-icons/ai";
import { FaBars } from "react-icons/fa";
import axios from "axios";
import ProfileModal from "../components/ProfileModal";
import ManagerNotification from "./ManagerNotification"; // Import the new component
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ManagerTopbar = () => {
  const navigate = useNavigate(); // Initialize navigate hook

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [userFirstLetter, setUserFirstLetter] = useState("U");

  // Notification states
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState(null);

  const notificationRef = useRef(null); // Ref for click outside detection

  useEffect(() => {
    axios
      .get("http://localhost:5190/api/profile", { withCredentials: true })
      .then((res) => {
        setProfilePicture(res.data.profilePictureUrl);
        setUserFirstLetter(res.data.firstName?.charAt(0).toUpperCase() || "U");
      })
      .catch((err) => console.error("Failed to fetch profile", err));
  }, []);

  // Effect to handle clicks outside the notification dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAvatarChange = (newAvatarUrl) => {
    setProfilePicture(newAvatarUrl);
  };

  // Function to fetch manager notifications
  const fetchManagerNotifications = async () => {
    setLoadingNotifications(true);
    setNotificationError(null);
    try {
      const res = await axios.get('http://localhost:5190/api/NotificationShow/admin', { withCredentials: true });
      // Sort by time (newest first) and take the first 5
      const sorted = res.data.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
      setNotifications(sorted);
    } catch (err) {
      console.error('Failed to load manager notifications:', err);
      setNotificationError('Failed to load notifications.');
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Toggle notification dropdown and fetch if not already shown
  const handleBellClick = () => {
    if (!showNotifications) {
      fetchManagerNotifications();
    }
    setShowNotifications((prev) => !prev);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
      {/* Left section: toggle + search bar (existing) */}
      <div className="flex items-center flex-1 min-w-[200px] gap-2">
        {/* You can add your toggle button and search bar here if needed */}
      </div>

      {/* Right section: icons */}
      <div className="flex items-center space-x-4 sm:space-x-6">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <AiOutlineBell
            title="Notifications"
            onClick={handleBellClick}
            className={`text-2xl cursor-pointer transition-colors ${showNotifications ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}`}
          />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notifications.length > 9 ? '9+' : notifications.length}
            </span>
          )}
          {showNotifications && (
            <ManagerNotification
              notifications={notifications}
              loading={loadingNotifications}
              error={notificationError}
              onViewAllClick={() => {
                setShowNotifications(false);
                navigate('/manager/notifications'); // Navigate to a dedicated notifications page for managers
              }}
            />
          )}
        </div>

        {/* Profile Picture */}
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
};

export default ManagerTopbar;