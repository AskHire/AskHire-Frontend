import { useState, useEffect } from "react";
import { AiOutlineBell } from "react-icons/ai";
import axios from "axios";
import ProfileModal from "./ProfileModal"; // Import the modal

const ManagerTopbar = () => {
  const [profilePic, setProfilePic] = useState("/avatars/avatar1.png");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Fetch the current profile picture
  useEffect(() => {
    axios
      .get("http://localhost:5190/api/profile", { withCredentials: true })
      .then((res) => {
        if (res.data?.profilePictureUrl) {
          setProfilePic(`http://localhost:5190${res.data.profilePictureUrl}`);
        }
      })
      .catch(console.error);
  }, []);

  // Handle avatar change from modal
  const handleAvatarChange = (newAvatarUrl) => {
    setProfilePic(`http://localhost:5190${newAvatarUrl}`);
  };

  return (
    <div>
      {/* Topbar container */}
      <div className="flex items-center">
        {/* Right side - Notification and Profile */}
        <div className="flex items-center justify-end flex-1 h-16 px-4">
          <div className="flex items-center">
            {/* Notification button */}
            <button className="p-2 text-gray-700 hover:text-gray-900">
              <AiOutlineBell size={22} />
            </button>

            {/* Profile button */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="p-1 ml-2 border border-gray-200 rounded-full hover:border-gray-400"
            >
              <img
                src={profilePic}
                alt="Profile"
                className="object-cover w-8 h-8 rounded-full"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileOpen && (
        <ProfileModal
          onClose={() => setIsProfileOpen(false)}
          onAvatarChange={handleAvatarChange}
        />
      )}
    </div>
  );
};

export default ManagerTopbar;
