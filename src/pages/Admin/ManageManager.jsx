import React, { useState, useRef, useEffect } from "react";
import AdminHeader from "../../components/AdminHeader";
import { BiTrash, BiChevronDown } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";
import axios from "axios";

export default function ManageManager() {
  const [managers, setManagers] = useState([]);
  const [sortOrder, setSortOrder] = useState("Newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch Managers from the backend
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await axios.get("http://localhost:5190/api/AdminUser"); // No token
        const allUsers = response.data;

        const managerOnly = allUsers.filter(user => user.role === "Manager");
        setManagers(managerOnly); // ✅ Corrected (was mistakenly written setAdmins)

      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };

    fetchManagers();
  }, []);

  // Handle manager deletion
  const handleDeleteManager = async (managerId) => {
    if (!window.confirm("Are you sure you want to delete this manager?")) return;

    try {

      await axios.delete(`http://localhost:5190/api/AdminUser/${managerId}`); // No token
      setManagers((prevManagers) => prevManagers.filter(manager => manager.id !== managerId));
      alert("Manager deleted successfully.");

    } catch (error) {
      console.error("Error deleting manager:", error);

      const errorMessage = error.response?.data?.title || error.response?.data?.message || error.message;
      alert(`Failed to delete manager: ${errorMessage}`);
    }
  };

  // Sort managers
  const sortedManagers = [...managers].sort((a, b) =>
    sortOrder === "Newest" ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt)
  );

  // Filter managers based on search query
  const filteredManagers = sortedManagers.filter((manager) =>
    manager.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    manager.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-6">
      <AdminHeader />
      <h1 className="mt-8 text-3xl font-bold">Manager Management</h1>
      <div className="flex items-center justify-end gap-3 mt-4 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search managers..."
            className="w-64 px-8 py-2 border rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IoIosSearch className="absolute w-5 h-5 text-gray-900 transform -translate-y-1/2 left-3 top-1/2" />
        </div>

        {/* Sort Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center px-3 py-2 bg-gray-200 border rounded-md"
          >
            Sort by: {sortOrder} <BiChevronDown className="ml-2" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 w-32 mt-2 bg-white border rounded-md shadow-md">
              <button
                className="w-full px-3 py-2 text-left hover:bg-gray-100"
                onClick={() => { setSortOrder("Newest"); setDropdownOpen(false); }}
              >
                Newest
              </button>
              <button
                className="w-full px-3 py-2 text-left hover:bg-gray-100"
                onClick={() => { setSortOrder("Oldest"); setDropdownOpen(false); }}
              >
                Oldest
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Manager List */}
      <div className="p-1">
        <div className="grid grid-cols-12 p-3 font-semibold">
          <span className="col-span-1">#</span>
          <span className="col-span-2">Profile</span>
          <span className="col-span-5">Name</span>
          <span className="col-span-4 text-right">Delete</span>
        </div>


        {filteredManagers.length > 0 ? (
          filteredManagers.map((manager, index) => (
            <div key={manager.id} className="grid items-center grid-cols-12 p-2 mb-2 bg-white rounded-md shadow-sm">
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
            </div>
          ))
        ) : (
          <p className="mt-8 text-center text-gray-500">No manager users found.</p>
        )}
      </div>
    </div>
  );
}
