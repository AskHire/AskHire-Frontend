import React, { useState, useEffect } from "react";
import UserRoleBadge from "../../components/Admin/AdminUserRoles/UserRoleBadge";
import UserDetailsModal from "../../components/Admin/AdminUserRoles/UserDetailsModal";
import Pagination from "../../components/Admin/Pagination";

export default function UserRoles() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState(""); // e.g., "Admin", "Manager", "Candidate"

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchUsers(currentPage, searchQuery, filterRole);
  }, [currentPage, searchQuery, filterRole, token]);

  const fetchUsers = async (page, search, role) => {
    try {
      const params = new URLSearchParams({
        Page: page,
        PageSize: 10,
      });

      if (search) params.append("SearchTerm", search);
      if (role) params.append("RoleFilter", role); // <-- pass role filter

      const res = await fetch(`http://localhost:5190/api/AdminUser?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      setUsers(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
    );
  };

  const handleSaveRole = async (userId) => {
    const updatedUser = users.find((u) => u.id === userId);
    if (!updatedUser) return;

    try {
      await fetch("http://localhost:5190/api/AdminUser/UpdateRole", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: updatedUser.id, newRole: updatedUser.role }),
      });
      setEditingUserId(null);
      fetchUsers(currentPage, searchQuery, filterRole);
    } catch (err) {
      console.error("Failed to save role:", err);
    }
  };

  return (
    <div className="flex-1 pl-2 pr-4 md:pl-6">
      <h1 className="text-3xl font-bold">Users Role Manager</h1>

      {/* Search and Role Filter */}
      <div className="flex flex-col gap-2 my-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search by first name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 text-sm bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        <select
          value={filterRole}
          onChange={(e) => {
            setFilterRole(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 text-sm text-gray-700 bg-gray-100 border rounded-md"
        >
          <option value="">Filter by Role</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Candidate">Candidate</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="p-4 overflow-x-auto bg-white shadow-md rounded-xl min-w-[768px]">
        <div className="grid grid-cols-12 px-4 py-3 text-sm font-semibold text-gray-600 border-b bg-gray-50 rounded-t-md">
          <span className="col-span-1">#</span>
          <span className="col-span-2">Profile</span>
          <span className="col-span-5">Name</span>
          <span className="col-span-3">Role</span>
          <span className="col-span-1 text-right">More</span>
        </div>

        {users.length > 0 ? (
          users.map((user, index) => (
            <div
              key={user.id}
              className="grid grid-cols-12 px-4 py-3 text-sm bg-white border-b hover:bg-gray-50"
            >
              <span className="col-span-1">{(currentPage - 1) * 5 + index + 1}</span>

              <div className="col-span-2">
                <img
                  src={user.profilePictureUrl ? `http://localhost:5190${user.profilePictureUrl}` : "https://via.placeholder.com/40"}
                  alt={user.firstName || "User"}
                  className="w-10 h-10 rounded-full"
                />
              </div>

              <span className="col-span-5">{user.firstName} {user.lastName}</span>

              <div className="col-span-3">
                {editingUserId === user.id ? (
                  <div className="flex items-center gap-2">
                    <select
                      className="px-3 py-1 text-sm border rounded-md"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
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
                  <UserRoleBadge role={user.role} onClick={() => setEditingUserId(user.id)} />
                )}
              </div>

              <div className="col-span-1 text-right">
                <button
                  className="text-2xl text-gray-500 rounded hover:text-gray-700"
                  onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                >
                  ...
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-12 px-4 py-6 text-center text-gray-400">No matching records.</div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}
