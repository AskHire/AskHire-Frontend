import React, { useState, useEffect } from "react";
import AdminHeader from "../../components/Admin/AdminHeader";
import SearchAndSortBar from "../../components/Admin/AdminUserRoles/SearchAndSortBar";
import UserRow from "../../components/Admin/AdminUserRoles/UserRow";

export default function UserRolesPage() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);

  const token = localStorage.getItem("accessToken");

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
    .filter((u) => u.firstName?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) =>
      sortOrder === "newest"
        ? b.id.localeCompare(a.id)
        : a.id.localeCompare(b.id)
    );

  const handleRoleChange = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
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
      console.error("Save error:", err);
    }
  };

  return (
    <div className="flex-1 p-6">
      <AdminHeader />
      <h1 className="mt-8 text-3xl font-bold">Admin Users Role Manager</h1>

      <SearchAndSortBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

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
              <UserRow
                key={user.id}
                user={user}
                index={index}
                isEditing={editingUserId === user.id}
                selectedUser={selectedUser}
                onEditClick={setEditingUserId}
                onRoleChange={handleRoleChange}
                onSave={handleSaveRole}
                onCancel={() => setEditingUserId(null)}
                onToggleDetail={(u) =>
                  setSelectedUser((prev) => (prev?.id === u.id ? null : u))
                }
                onCloseDetail={() => setSelectedUser(null)}
              />
            ))
          ) : (
            <p className="py-4 text-center text-gray-500">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
