import React from "react";

export default function UserDetailsModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="w-full max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">User Details</h2>
        <div className="mt-4 space-y-2">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Gender:</strong> {user.gender}</p>
          <p><strong>DOB:</strong> {new Date(user.dob).toLocaleDateString()}</p>
          <p><strong>NIC:</strong> {user.nic}</p>
          <p><strong>Mobile:</strong> {user.mobileNumber}</p>
          <p><strong>Address:</strong> {user.address}</p>
        </div>
        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
