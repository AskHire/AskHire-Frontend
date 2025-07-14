import React, { useState, useEffect } from "react";
import axios from "axios";
import { BiTrash } from "react-icons/bi";
import BaseTable from "../../components/BaseTable";

export default function ManageManager() {
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await axios.get("http://localhost:5190/api/AdminUser");
        const allUsers = response.data;
        const managerOnly = allUsers.filter((user) => user.role === "Manager");
        setManagers(managerOnly);
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };
    fetchManagers();
  }, []);

  const handleDeleteManager = async (managerId) => {
    if (!window.confirm("Are you sure you want to delete this manager?")) return;
    try {
      await axios.delete(`http://localhost:5190/api/AdminUser/${managerId}`);
      setManagers((prev) => prev.filter((m) => m.id !== managerId));
      alert("Manager deleted successfully.");
    } catch (error) {
      console.error("Error deleting manager:", error);
      const msg = error.response?.data?.title || error.response?.data?.message || error.message;
      alert(`Failed to delete manager: ${msg}`);
    }
  };

  return (
    <div className="flex-1 p-6">
      <h1 className="mt-3 text-3xl font-bold">Manager Management</h1>

      <div className="mt-6">
        <BaseTable
         
          rows={managers}
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
          renderRow={(manager, index) => (
            <>
              <span className="col-span-1">{index + 1}</span>
              <div className="col-span-2">
                <img
                  className="w-10 h-10 rounded-full"
                  src={manager.image || "https://via.placeholder.com/40"}
                  alt={manager.firstName}
                />
              </div>
              <span className="col-span-5">{manager.firstName} {manager.lastName}</span>
              <div className="col-span-4 text-right">
                <button
                  onClick={() => handleDeleteManager(manager.id)}
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
