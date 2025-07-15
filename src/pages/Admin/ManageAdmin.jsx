import React, { useState, useEffect } from "react";
import axios from "axios";
import { BiTrash } from "react-icons/bi";
import Pagination from "../../components/Admin/Pagination";

export default function ManageAdmin() {
  const [admins, setAdmins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("FirstName");
  const [isDescending, setIsDescending] = useState(false); // toggle this for A-Z / Z-A

  const itemsPerPage = 5;
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchAdmins(currentPage, searchQuery, sortBy, isDescending);
  }, [currentPage, searchQuery, sortBy, isDescending]);

  const fetchAdmins = async (page, search, sortKey, descending) => {
    try {
      const params = new URLSearchParams({
        Page: page,
        PageSize: itemsPerPage,
        RoleFilter: "Admin",
        SortBy: sortKey,
        IsDescending: descending,
      });

      if (search) params.append("SearchTerm", search);

      const response = await axios.get(
        `http://localhost:5190/api/AdminUser?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAdmins(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      await axios.delete(`http://localhost:5190/api/AdminUser/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAdmins(currentPage, searchQuery, sortBy, isDescending);
      alert("Admin deleted successfully.");
    } catch (error) {
      console.error("Error deleting admin:", error);
      const msg =
        error.response?.data?.title ||
        error.response?.data?.message ||
        error.message;
      alert(`Failed to delete admin: ${msg}`);
    }
  };

  return (
    <div className="flex-1 p-6">
      <h1 className="mt-3 text-3xl font-bold">Admin Management</h1>

      {/* Search and Sort Controls */}
      <div className="flex flex-col gap-2 my-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 text-sm bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        <select
          onChange={(e) => {
            const value = e.target.value;
            if (value === "asc") {
              setSortBy("FirstName");
              setIsDescending(false);
            } else if (value === "desc") {
              setSortBy("FirstName");
              setIsDescending(true);
            }
            setCurrentPage(1);
          }}
          className="px-3 py-2 text-sm text-gray-700 bg-gray-100 border rounded-md"
        >
          <option value="">Sort by</option>
          <option value="asc">Name (A - Z)</option>
          <option value="desc">Name (Z - A)</option>
        </select>
      </div>

      {/* Table */}
      <div className="p-4 overflow-x-auto bg-white shadow-md rounded-xl min-w-[768px]">
        <div className="grid grid-cols-12 px-4 py-3 text-sm font-semibold text-gray-600 border-b bg-gray-50 rounded-t-md">
          <span className="col-span-1">#</span>
          <span className="col-span-2">Profile</span>
          <span className="col-span-5">Name</span>
          <span className="col-span-4 text-right">Delete</span>
        </div>

        {admins.length > 0 ? (
          admins.map((admin, index) => (
            <div
              key={admin.id}
              className="grid grid-cols-12 px-4 py-3 text-sm bg-white border-b hover:bg-gray-50"
            >
              <span className="col-span-1">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </span>

              <div className="col-span-2">
                <img
                  className="w-10 h-10 rounded-full"
                  src={
                    admin.profilePictureUrl
                      ? `http://localhost:5190${admin.profilePictureUrl}`
                      : "https://via.placeholder.com/40"
                  }
                  alt={admin.firstName}
                />
              </div>

              <span className="col-span-5">
                {admin.firstName} {admin.lastName}
              </span>

              <div className="col-span-4 text-right">
                <button
                  onClick={() => handleDeleteAdmin(admin.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <BiTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-12 px-4 py-6 text-center text-gray-400">
            No admins found.
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
