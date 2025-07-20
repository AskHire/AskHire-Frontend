import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineBell } from 'react-icons/ai';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import ProfileModal from './ProfileModal';
import CandidateNotification from '../components/CandidateComponants/CandidateNotification';

const Navbar = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [firstLetter, setFirstLetter] = useState("U");

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState(null);

  const notificationRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      axios
        .get("http://localhost:5190/api/profile", { withCredentials: true })
        .then((res) => {
          setProfilePicture(res.data.profilePictureUrl);
          setFirstLetter(res.data.firstName?.[0]?.toUpperCase() || "U");
        })
        .catch(console.error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    setNotificationError(null);

    try {
      const res = await axios.get('http://localhost:5190/api/NotificationShow/all');
      const sorted = res.data.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
      setNotifications(sorted);
    } catch (err) {
      console.error(err);
      setNotificationError('Failed to load notifications.');
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleBellClick = () => {
    if (!showNotifications) {
      fetchNotifications();
    }
    setShowNotifications((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">AskHire</Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8 text-lg">
          <Link to="/" className="text-gray-600 hover:text-blue-700 hover:font-bold">Home</Link>
          <Link to="/jobs" className="text-gray-600 hover:text-blue-700 hover:font-bold">Jobs</Link>

          {isAuthenticated && (
            <>
              <Link to={`/${currentUser?.role.toLowerCase()}`} className="text-gray-600 hover:text-blue-700 hover:font-bold">Dashboard</Link>
              {currentUser?.role === 'Candidate' && (
                <Link to="/candidate/interview" className="text-gray-600 hover:text-blue-700 hover:font-bold">Interviews</Link>
              )}
            </>
          )}

          <Link to="/aboutus" className="text-gray-600 hover:text-blue-700 hover:font-bold">About Us</Link>
        </div>

        {/* Auth Controls */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
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
                  <CandidateNotification
                    notifications={notifications}
                    loading={loadingNotifications}
                    error={notificationError}
                    onViewAllClick={() => {
                      setShowNotifications(false);
                      navigate('/notifications');
                    }}
                  />
                )}
              </div>

              {/* Profile Picture */}
              <button onClick={() => setShowProfileModal(true)} title="Profile" className="focus:outline-none">
                {profilePicture ? (
                  <img
                    src={`http://localhost:5190${profilePicture}`}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full border object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold uppercase">
                    {firstLetter}
                  </div>
                )}
              </button>

              {/* Logout */}
              <button onClick={handleLogout} className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signup">
                <button className="px-4 py-1.5 text-sm bg-gray-800 text-white rounded-full hover:bg-gray-900">
                  Sign Up
                </button>
              </Link>
              <Link to="/login">
                <button className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700">
                  Login
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal
          onClose={() => setShowProfileModal(false)}
          onAvatarChange={setProfilePicture}
        />
      )}
    </nav>
  );
};

export default Navbar;
