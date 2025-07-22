import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfileModal({ onClose, onAvatarChange }) {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const avatarList = ["avatar1.png", "avatar2.png", "avatar3.png", "avatar4.png"];

  useEffect(() => {
    axios
      .get("http://localhost:5190/api/profile", { withCredentials: true })
      .then((res) => setProfile(res.data))
      .catch(console.error);
  }, []);

  const handleAvatarSelect = async (avatar) => {
    try {
      await axios.post(
        "http://localhost:5190/api/profile/set-avatar",
        `"${avatar}"`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const newUrl = `/avatars/${avatar}`;
      setProfile((prev) => ({
        ...prev,
        profilePictureUrl: newUrl,
      }));
      onAvatarChange && onAvatarChange(newUrl);
      setSuccessMessage("Avatar updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Avatar update failed", error);
    }
  };

  const handleSave = async () => {
    try {
      const dto = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        gender: profile.gender,
        dob: profile.dob,
        mobileNumber: profile.mobileNumber,
        address: profile.address,
      };

      await axios.put("http://localhost:5190/api/profile", dto, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile", error);
      alert("Failed to update profile.");
    }
  };

  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-[90%] max-w-md max-h-[80vh] overflow-y-auto p-6 bg-white shadow-lg rounded-xl">
        <button
          onClick={onClose}
          className="absolute text-2xl text-gray-500 top-2 right-4 hover:text-gray-700"
        >
          &times;
        </button>

        <h2 className="mb-4 text-xl font-bold text-center">Profile</h2>

        {/* Success Toast */}
        {successMessage && (
          <div className="p-2 mb-4 text-center text-green-700 bg-green-100 border border-green-400 rounded">
            {successMessage}
          </div>
        )}

        <div className="mb-4 text-center">
          <img
            src={`http://localhost:5190${profile.profilePictureUrl || "/avatars/avatar1.png"}`}
            alt="Profile"
            className="w-24 h-24 mx-auto border rounded-full"
          />
          <p className="mt-2 text-gray-600">{profile.role}</p>
          <p className="text-gray-600">{profile.email}</p>
        </div>

        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <label>First Name:</label>
            <input
              type="text"
              className="w-full p-1 border rounded"
              value={profile.firstName || ""}
              disabled={!isEditing}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              className="w-full p-1 border rounded"
              value={profile.lastName || ""}
              disabled={!isEditing}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            />
          </div>
          <div>
            <label>Gender:</label>
            <select
              className="w-full p-1 border rounded"
              value={profile.gender || ""}
              disabled={!isEditing}
              onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label>DOB:</label>
            <input
              type="date"
              className="w-full p-1 border rounded"
              value={profile.dob || ""}
              disabled={!isEditing}
              onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
            />
          </div>
          <div>
            <label>Mobile Number:</label>
            <input
              type="text"
              className="w-full p-1 border rounded"
              value={profile.mobileNumber || ""}
              disabled={!isEditing}
              onChange={(e) => setProfile({ ...profile, mobileNumber: e.target.value })}
            />
          </div>
          <div>
            <label>Address:</label>
            <textarea
              className="w-full p-1 border rounded"
              value={profile.address || ""}
              disabled={!isEditing}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            ></textarea>
          </div>
        </div>

        {/* Avatar selection */}
        <h3 className="mt-4 mb-2 font-semibold text-center text-md">Choose Avatar</h3>
        <div className="flex justify-center gap-4">
          {avatarList.map((avatar) => (
            <img
              key={avatar}
              src={`http://localhost:5190/avatars/${avatar}`}
              alt={avatar}
              className={`w-12 h-12 rounded-full cursor-pointer border-2 ${
                profile.profilePictureUrl?.includes(avatar)
                  ? "border-blue-500"
                  : "border-transparent"
              } hover:border-blue-300`}
              onClick={() => handleAvatarSelect(avatar)}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
