import React, { useState, useRef, useEffect } from "react";
import AdminHeader from "../../components/AdminHeader";
import { BiTrash, BiChevronDown } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";
import axios from "axios";

export default function ManageAdmin() {
  const [admins, setAdmins] = useState([]);
  const [sortOrder, setSortOrder] = useState("Newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch admins from the backend
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch("http://localhost:5190/api/admins"); // Ensure this matches backend URL
        if (!response.ok) throw new Error("Failed to fetch admins");
  
        const data = await response.json();
        console.log("Admins fetched:", data); // Debugging: Check if data is returned
        setAdmins(data);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };
  
    fetchAdmins();
  }, []);
  

  
  // Handle job deletion
  const handleDeleteAdmin = async (UserId) => {
    if (!UserId) return alert("Invalid User ID!");
  
    try {
      console.log("Deleting admin with ID:", UserId);
  
      await axios.delete(`http://localhost:5190/api/admins/${UserId}`);
  
      // Instead of refetching, update state directly (if using React useState)
      setAdmins((prevAdmins) => prevAdmins.filter(admin => admin.userId !== UserId));
  
      console.log("Admin deleted successfully.");
    } catch (error) {
      console.error("Error deleting admin:", error);
  
      // More robust error message
      const errorMessage = error.response?.data?.title || error.response?.data?.message || error.message;
      alert(`Failed to delete admin: ${errorMessage}`);
    }
  };
  

  // Sort admins
  const sortedAdmins = [...admins].sort((a, b) =>
    sortOrder === "Newest" ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt)
  );

  // Filter admins based on search query
  const filteredAdmins = sortedAdmins.filter((admin) =>
    admin.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-6">
      <AdminHeader />
      <h1 className="mt-8 text-3xl font-bold">Admin Management</h1>

      <div className="mt-4">
        <div className="flex items-center justify-end gap-3 mb-4">
          <div className="relative">
            <input type="text" placeholder="Search admins..." className="w-64 px-8 py-2 border rounded-xl"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <IoIosSearch className="absolute w-5 h-5 text-gray-900 transform -translate-y-1/2 left-3 top-1/2" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center px-3 py-2 bg-gray-200 border rounded-md">
              Sort by: {sortOrder} <BiChevronDown className="ml-2" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 w-32 mt-2 bg-white border rounded-md shadow-md">
                <button className="w-full px-3 py-2 text-left hover:bg-gray-100" onClick={() => { setSortOrder("Newest"); setDropdownOpen(false); }}>Newest</button>
                <button className="w-full px-3 py-2 text-left hover:bg-gray-100" onClick={() => { setSortOrder("Oldest"); setDropdownOpen(false); }}>Oldest</button>
              </div>
            )}
          </div>
        </div>

        {/* Admin List */}
        <div className="p-1">
          <div className="grid grid-cols-12 p-3 font-semibold">
            <span className="col-span-1">#</span>
            <span className="col-span-2">Profile</span>
            <span className="col-span-3">Name</span>
            <span className="col-span-5 text-right">Delete</span>
          </div>

          <ul className="space-y-2">
            {filteredAdmins.map((admin, index) => (
              <div key={admin.userId} className="grid items-center grid-cols-12 p-2 bg-white rounded-md shadow-sm">
                <span className="col-span-1">{index + 1}</span>
                <div className="col-span-2">
                    <img className="w-10 h-10 rounded-full" src={admin.image || "http://via.placeholder.com/40"} alt={admin.firstName} />
                  </div>
                <span className="col-span-3">{admin.firstName} {admin.lastName}</span>
                <div className="col-span-5 text-right">
                  <button onClick={() => handleDeleteAdmin(admin.userId)} className="p-2 text-red-600 hover:text-red-800">
                    <BiTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

