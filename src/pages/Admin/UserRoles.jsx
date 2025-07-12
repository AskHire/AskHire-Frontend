import React, { useState, useEffect } from "react";
import AdminHeader from "../../components/Admin/AdminHeader";
import BaseTable from "../../components/BaseTable";
import UserRoleBadge from "../../components/Admin/AdminUserRoles/UserRoleBadge";
import UserDetailsModal from "../../components/Admin/AdminUserRoles/UserDetailsModal";

export default function UserRoles() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetch("http://localhost:5190/api/AdminUser", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, [token]);

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
    } catch (err) {
      console.error("Failed to save role:", err);
    }
  };

  return (
    <div className="flex-1 p-6">
      <AdminHeader />
      <h1 className="mt-8 text-3xl font-bold">Admin Users Role Manager</h1>

      <div className="mt-6">
        <BaseTable
          title="All Users"
          headers={[
            { label: "#", span: 1 },
            { label: "Profile", span: 2 },
            { label: "Name", span: 5 },
            { label: "Role", span: 3 },
            { label: "More", span: 1, align: "text-right" },
          ]}
          rows={users}
          searchKey="firstName"
          sortOptions={[
            { label: "Newest", value: "id:desc" },
            { label: "Oldest", value: "id:asc" },
          ]}
          renderRow={(user, index) => [
            <span className="col-span-1" key="index">{index + 1}</span>,
            <div className="col-span-2" key="image">
              <img
                src={user.image || "https://via.placeholder.com/40"}
                alt={user.firstName}
                className="w-10 h-10 rounded-full"
              />
            </div>,
            <span className="col-span-5" key="name">{user.firstName} {user.lastName}</span>,
            <div key="role" className="col-span-3">
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
                <UserRoleBadge
                  role={user.role}
                  onClick={() => setEditingUserId(user.id)}
                />
              )}
            </div>,
            <div key="more" className="col-span-1 text-right">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() =>
                  setSelectedUser(selectedUser?.id === user.id ? null : user)
                }
              >
                ...
              </button>
            </div>,
          ]}
        />
      </div>

      <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}
