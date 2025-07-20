import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { AiOutlineBell } from 'react-icons/ai'; 
import ProfileModal from './ProfileModal'; 

const Navbar = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [userFirstLetter, setUserFirstLetter] = useState("U"); 

  useEffect(() => {
    if (isAuthenticated) {
      axios
        .get("http://localhost:5190/api/profile", { withCredentials: true })
        .then((res) => {
          setProfilePicture(res.data.profilePictureUrl);
          setUserFirstLetter(res.data.firstName?.charAt(0).toUpperCase() || "U");
        })
        .catch((err) => console.error("Failed to fetch profile", err));
    }
  }, [isAuthenticated]); 

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAvatarChange = (newAvatarUrl) => {
    setProfilePicture(newAvatarUrl);
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-blue-600">
            AskHire
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8 text-lg">
          <Link to="/" className="text-gray-600 hover:text-blue-700 hover:font-bold">
            Home
          </Link>
          <Link to="/jobs" className="text-gray-600 hover:text-blue-700 hover:font-bold">
            Jobs
          </Link>

          {isAuthenticated && (
            <>
              {/* Role-specific Dashboard link */}
              <Link
                to={`/${currentUser?.role.toLowerCase()}`}
                className="text-gray-600 hover:text-blue-700 hover:font-bold"
              >
                Dashboard
              </Link>

              {/* Interviews link - only for Candidate */}
              {currentUser?.role === 'Candidate' && (
                <Link
                  to="/candidate/interview"
                  className="text-gray-600 hover:text-blue-700 hover:font-bold"
                >
                  Interviews
                </Link>
              )}
            </>
          )}

          <Link to="/aboutus" className="text-gray-600 hover:text-blue-700 hover:font-bold">
            About Us
          </Link>
        </div>

        {/* Auth Section */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <AiOutlineBell
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

              <button
                onClick={handleLogout}
                className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/signup">
                <button className="px-4 py-1.5 text-sm font-medium text-white bg-gray-800 rounded-full hover:bg-gray-900">
                  SignUp
                </button>
              </Link>
              <Link to="/login">
                <button className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700">
                  Login
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal
          onClose={() => setShowProfileModal(false)}
          onAvatarChange={handleAvatarChange}
        />
      )}
    </nav>
  );
};

export default Navbar;