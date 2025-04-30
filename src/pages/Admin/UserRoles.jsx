import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { HiDotsVertical } from "react-icons/hi";
import AdminHeader from "../../components/AdminHeader";

export default function UserRoles() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);

  // You might already have a token stored after login
  const token = localStorage.getItem("accessToken"); // or wherever you store it

  useEffect(() => {

    fetch("http://localhost:5190/api/AdminUser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, [token]);

  const filteredUsers = users
    .filter((user) =>
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "newest"
        ? b.id.localeCompare(a.id)
        : a.id.localeCompare(b.id)
    );

  const handleRoleChange = (userId, newRole) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const handleSaveRole = async (userId) => {
    const updatedUser = users.find((user) => user.id === userId);
    if (!updatedUser) return;

    try {
      await fetch("http://localhost:5190/api/AdminUser/UpdateRole", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: updatedUser.id,
          newRole: updatedUser.role,
        }),
      });
      setEditingUserId(null);
    } catch (error) {
      console.error("Failed to save role:", error);
    }
  };

  return (
    <div className="flex-1 p-6">
      <AdminHeader />
      <h1 className="mt-8 text-3xl font-bold">Admin Users Role Manager</h1>

      {/* Search and Sort */}
      <div className="flex items-center justify-end gap-3 mt-4 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-64 px-8 py-2 border rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IoIosSearch className="absolute w-5 h-5 text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
        </div>

        <select
          className="px-3 py-2 bg-gray-200 border rounded-md"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Sort by: Newest</option>
          <option value="oldest">Sort by: Oldest</option>
        </select>
      </div>

      {/* Users List */}
      <div className="p-4">
        <div className="grid grid-cols-12 p-3 font-semibold rounded-md">
          <span className="col-span-1">#</span>
          <span className="col-span-2">Profile</span>
          <span className="col-span-5">Name</span>
          <span className="col-span-3">Role</span>
          <span className="col-span-1 text-right">More</span>
        </div>

        <div className="p-1">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <div
                key={user.id}
                className="grid items-center justify-between grid-cols-12 p-3 mt-3 bg-white rounded-lg"
              >
                <span className="col-span-1 font-medium">{index + 1}</span>


                <div className="col-span-2">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={user.image || "http://via.placeholder.com/40"}
                    alt={user.firstName}
                  />
                </div>

                <span className="col-span-5 font-medium">
                  {user.firstName} {user.lastName}
                </span>

                {/* Role Management */}

                <div className="col-span-3">
                  {editingUserId === user.id ? (
                    <div className="flex items-center gap-2">
                      <select
                        className="px-3 py-1 text-sm border rounded-md"
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                      >
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Candidate">Candidate</option>
                      </select>

                      <button
                        className="text-sm text-blue-600 underline"
                        onClick={() => handleSaveRole(user.id)}
                      >
                        Save
                      </button>

                      <button
                        className="text-sm text-red-500 underline"
                        onClick={() => setEditingUserId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className={`text-sm px-3 py-1 rounded-full text-white ${
                        user.role === "Admin"
                          ? "bg-green-500"
                          : user.role === "Candidate"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                      onClick={() => setEditingUserId(user.id)}
                    >
                      {user.role}
                    </button>
                  )}
                </div>

                {/* More Options */}
                <div className="col-span-1 text-right">
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() =>
                      setSelectedUser(
                        selectedUser?.id === user.id ? null : user
                      )
                    }
                  >
                    <HiDotsVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* User Details Modal */}
                {selectedUser && selectedUser.id === user.id && (
                  <div className="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-50">
                    <div className="w-full max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <h2 className="text-2xl font-bold text-center text-gray-700">
                        User Details
                      </h2>

                      <div className="mt-4 space-y-2">
                        <p>
                          <strong>Email:</strong> {selectedUser.email}
                        </p>
                        <p>
                          <strong>Gender:</strong> {selectedUser.gender}
                        </p>
                        <p>
                          <strong>DOB:</strong>{" "}
                          {new Date(selectedUser.dob).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>NIC:</strong> {selectedUser.nic}
                        </p>
                        <p>
                          <strong>Mobile:</strong> {selectedUser.mobileNumber}
                        </p>
                        <p>
                          <strong>Address:</strong> {selectedUser.address}
                        </p>
                        <p>
                          <strong>State:</strong> {selectedUser.state}
                        </p>
                      </div>

                      <div className="flex justify-end mt-6">
                        <button
                          className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                          onClick={() => setSelectedUser(null)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="py-4 text-center text-gray-500">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
