import React, { useState, useRef, useEffect } from "react";
import AdminHeader from "../../components/Admin/AdminHeader";
import axios from "axios";
import AdminSearchSort from "../../components/Admin/ManageAdmin/AdminSearchSort";
import AdminList from "../../components/Admin/ManageAdmin/AdminList";

export default function ManageAdmin() {
  const [admins, setAdmins] = useState([]);
  const [sortOrder, setSortOrder] = useState("Newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch Admins from backend
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("http://localhost:5190/api/AdminUser");
        const adminOnly = response.data.filter(user => user.role === "Admin");
        setAdmins(adminOnly);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };
    fetchAdmins();
  }, []);

  // Delete Admin
  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await axios.delete(`http://localhost:5190/api/AdminUser/${adminId}`, {
        withCredentials: true,
      });
      setAdmins((prev) => prev.filter((admin) => admin.id !== adminId));
      alert("Admin deleted successfully.");
    } catch (error) {
      const message = error.response?.data?.title || error.response?.data?.message || error.message;
      alert(`Failed to delete admin: ${message}`);
    }
  };

  const sortedAdmins = [...admins].sort((a, b) =>
    sortOrder === "Newest"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
  );

  const filteredAdmins = sortedAdmins.filter((admin) =>
    admin.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-6">
      <AdminHeader />
      <h1 className="mt-8 text-3xl font-bold">Admin Management</h1>
      <AdminSearchSort
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
      />
      <AdminList admins={filteredAdmins} onDelete={handleDeleteAdmin} />
    </div>
  );
}
