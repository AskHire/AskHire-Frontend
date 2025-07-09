import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProfileModal({ onClose }) {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [viewMode, setViewMode] = useState("view"); // view | edit | password
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });

  useEffect(() => {
    if (!userId) return;
  
    axios.get(`http://localhost:5190/api/Profile/get-profile/${userId}`)
      .then(res => {
        setUser(res.data);
        setForm(res.data);
      })
      .catch(err => console.error("Failed to fetch user", err));
  }, [userId]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await axios.put("http://localhost:5190/api/Profile/update-profile", {
        ...form,
        userId: user.id
      });
      alert("Profile updated.");
      setViewMode("view");
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    }
  };

  const handlePasswordChange = async () => {
    const { currentPassword, newPassword } = passwords;

    if (!currentPassword || newPassword.length < 6) {
      alert("Please fill out all fields correctly.");
      return;
    }

    try {
      await axios.post("http://localhost:5190/api/Profile/change-password", {
        userId: user.id,
        currentPassword,
        newPassword
      });

      alert("Password changed successfully.");
      setPasswords({ currentPassword: "", newPassword: "" });
      setViewMode("view");
    } catch (err) {
      console.error(err);
      alert("Password change failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">My Profile</h2>

        {viewMode === "view" && user && (
          <div className="space-y-2">
            <ProfileRow label="First Name" value={user.firstName} />
            <ProfileRow label="Last Name" value={user.lastName} />
            <ProfileRow label="Mobile" value={user.mobileNumber} />
            <ProfileRow label="Gender" value={user.gender} />
            <ProfileRow label="DOB" value={user.dob?.substring(0, 10)} />
            <ProfileRow label="NIC" value={user.nic} />
            <ProfileRow label="Address" value={user.address} />
            <ProfileRow label="Image URL" value={user.image} />
          </div>
        )}

        {viewMode === "edit" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input name="firstName" label="First Name" value={form.firstName} onChange={handleChange} />
            <Input name="lastName" label="Last Name" value={form.lastName} onChange={handleChange} />
            <Input name="mobileNumber" label="Mobile" value={form.mobileNumber} onChange={handleChange} />
            <Input name="gender" label="Gender" value={form.gender} onChange={handleChange} />
            <Input name="dob" label="DOB" type="date" value={form.dob?.substring(0, 10)} onChange={handleChange} />
            <Input name="nic" label="NIC" value={form.nic} onChange={handleChange} />
            <Input name="address" label="Address" value={form.address} onChange={handleChange} />
            <Input name="image" label="Image URL" value={form.image || ""} onChange={handleChange} />
          </div>
        )}

        {viewMode === "password" && (
          <div className="max-w-md space-y-4">
            <div>
              <label className="block mb-1 text-sm">Current Password</label>
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">New Password</label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Close</button>

          {viewMode === "view" && (
            <div className="space-x-2">
              <button onClick={() => setViewMode("edit")} className="px-4 py-2 text-white bg-blue-600 rounded">Edit</button>
              <button onClick={() => setViewMode("password")} className="px-4 py-2 text-white bg-green-600 rounded">Change Password</button>
            </div>
          )}

          {viewMode === "edit" && (
            <button onClick={handleSave} className="px-4 py-2 text-white bg-blue-600 rounded">Save Changes</button>
          )}

          {viewMode === "password" && (
            <button onClick={handlePasswordChange} className="px-4 py-2 text-white bg-green-600 rounded">Save Password</button>
          )}
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded"
      />
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div>
      <p className="text-sm font-semibold">{label}</p>
      <p className="mb-2 text-gray-700">{value || "-"}</p>
    </div>
  );
}
