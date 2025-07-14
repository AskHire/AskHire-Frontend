import React, { useState, useEffect } from "react";
import axios from "axios";
import { BiTrash } from "react-icons/bi";
import BaseTable from "../../components/BaseTable";

export default function ManageAdmin() {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("http://localhost:5190/api/AdminUser");
        const allUsers = response.data;
        const adminOnly = allUsers.filter((user) => user.role === "Admin");
        setAdmins(adminOnly);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };
    fetchAdmins();
  }, []);

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await axios.delete(`http://localhost:5190/api/AdminUser/${adminId}`, {
        withCredentials: true,
      });
      setAdmins((prev) => prev.filter((a) => a.id !== adminId));
      alert("Admin deleted successfully.");
    } catch (error) {
      console.error("Error deleting admin:", error);
      const msg = error.response?.data?.title || error.response?.data?.message || error.message;
      alert(`Failed to delete admin: ${msg}`);
    }
  };

  return (
    <div className="flex-1 p-6">
      <h1 className="mt-3 text-3xl font-bold">Admin Management</h1>

      <div className="mt-6">
        <BaseTable
         
          rows={admins}
          searchKey="firstName"
          sortOptions={[
            { label: "Newest", value: "createdAt:desc" },
            { label: "Oldest", value: "createdAt:asc" },
          ]}
          headers={[
            { label: "#", span: 1 },
            { label: "Profile", span: 2 },
            { label: "Name", span: 5 },
            { label: "Delete", span: 4, align: "text-right" },
          ]}
          renderRow={(admin, index) => (
            <>
              <span className="col-span-1">{index + 1}</span>
              <div className="col-span-2">
                <img
                  className="w-10 h-10 rounded-full"
                  src={admin.image || "https://via.placeholder.com/40"}
                  alt={admin.firstName}
                />
              </div>
              <span className="col-span-5">{admin.firstName} {admin.lastName}</span>
              <div className="col-span-4 text-right">
                <button
                  onClick={() => handleDeleteAdmin(admin.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <BiTrash className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        />
      </div>
    </div>
  );
}