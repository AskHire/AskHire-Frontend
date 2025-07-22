import React, { useState, useEffect, useRef } from "react";
import { AiOutlineBell } from "react-icons/ai"; // Changed from FaBell to AiOutlineBell
import axios from "axios";
import ProfileModal from "../ProfileModal";
import AdminNotification from "./AdminNotification";
import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const navigate = useNavigate();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [userFirstLetter, setUserFirstLetter] = useState("U");

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState(null);

  const notificationRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:5190/api/profile", { withCredentials: true })
      .then((res) => {
        setProfilePicture(res.data.profilePictureUrl);
        setUserFirstLetter(res.data.firstName?.charAt(0).toUpperCase() || "U");
      })
      .catch((err) => console.error("Failed to fetch profile", err));
  }, []);

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

  const fetchAdminNotifications = async () => {
    setLoadingNotifications(true);
    setNotificationError(null);
    try {
      const res = await axios.get('http://localhost:5190/api/NotificationShow/admin', { withCredentials: true });
      const sorted = res.data.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
      setNotifications(sorted);
    } catch (err) {
      console.error('Failed to load admin notifications:', err);
      setNotificationError('Failed to load notifications.');
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleBellClick = () => {
    if (!showNotifications) {
      fetchAdminNotifications();
    }
    setShowNotifications((prev) => !prev);
  };

  return (
    <div className="w-full px-4 pt-3 ">
      <div className="ml-auto flex items-center justify-end gap-4 max-w-[300px]">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <AiOutlineBell // Changed from FaBell to AiOutlineBell
            title="Notifications"
            onClick={handleBellClick}
            className={`text-2xl cursor-pointer transition-colors ${showNotifications ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}`}
          />
          {notifications.length > 0 && (
            <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
              {notifications.length > 9 ? '9+' : notifications.length}
            </span>
          )}
          {showNotifications && (
            <AdminNotification
              notifications={notifications}
              loading={loadingNotifications}
              error={notificationError}
              onViewAllClick={() => {
                setShowNotifications(false);
                navigate('/admin/notifications');
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