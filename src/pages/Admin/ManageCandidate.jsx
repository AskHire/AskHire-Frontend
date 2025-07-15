import React, { useState, useEffect } from "react";
import axios from "axios";
import { BiTrash } from "react-icons/bi";
import Pagination from "../../components/Admin/Pagination";
import DeleteModal from "../../components/DeleteModal"; 

export default function ManageCandidate() {
  const [candidates, setCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // e.g., "firstName:asc"

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const itemsPerPage = 5;
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchCandidates(currentPage, searchQuery, sortOrder);
  }, [currentPage, searchQuery, sortOrder]);

  const fetchCandidates = async (page, search, sort) => {
    try {
      const params = new URLSearchParams({
        Page: page,
        PageSize: itemsPerPage,
        RoleFilter: "Candidate",
      });

      if (search) params.append("SearchTerm", search);
      if (sort) {
        const [key, dir] = sort.split(":");
        params.append("SortBy", key);
        params.append("IsDescending", dir === "desc");
      }

      const response = await axios.get(`http://localhost:5190/api/AdminUser?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCandidates(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  // When delete icon clicked, open modal and set candidate to delete
  const handleDeleteClick = (candidateId) => {
    setCandidateToDelete(candidateId);
    setDeleteModalOpen(true);
  };

  // Confirm delete from modal
  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5190/api/AdminUser/${candidateToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage("Candidate deleted successfully!");
      fetchCandidates(currentPage, searchQuery, sortOrder);
    } catch (error) {
      console.error("Error deleting candidate:", error);
      const msg = error.response?.data?.title || error.response?.data?.message || error.message;
      alert(`Failed to delete candidate: ${msg}`);
    } finally {
      setDeleteModalOpen(false);
      setCandidateToDelete(null);
      setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
    }
  };

  // Cancel modal
  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setCandidateToDelete(null);
  };

  return (
    <div className="flex-1 p-6">
      <h1 className="mt-3 text-3xl font-bold">Candidate Management</h1>

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
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 text-sm text-gray-700 bg-gray-100 border rounded-md"
        >
          <option value="">Sort by</option>
          <option value="firstName:asc">Name (A-Z)</option>
          <option value="firstName:desc">Name (Z-A)</option>
        </select>
      </div>

      {/*  Toast-style floating success message */}
      {successMessage && (
        <div className="fixed z-50 px-4 py-2 text-blue-800 bg-blue-100 border border-blue-300 rounded-lg shadow-lg top-4 right-4 animate-slide-in-out">
          <strong className="font-medium">Success!</strong> {successMessage}
        </div>
      )}

      {/* Candidates Table */}
      <div className="p-4 overflow-x-auto bg-white shadow-md rounded-xl min-w-[768px]">
        <div className="grid grid-cols-12 px-4 py-3 text-sm font-semibold text-gray-600 border-b bg-gray-50 rounded-t-md">
          <span className="col-span-1">#</span>
          <span className="col-span-2">Profile</span>
          <span className="col-span-5">Name</span>
          <span className="col-span-4 text-right">Delete</span>
        </div>

        {candidates.length > 0 ? (
          candidates.map((candidate, index) => (
            <div
              key={candidate.id}
              className="grid grid-cols-12 px-4 py-3 text-sm bg-white border-b hover:bg-gray-50"
            >
              <span className="col-span-1">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </span>

              <div className="col-span-2">
                <img
                  className="w-10 h-10 rounded-full"
                  src={
                    candidate.profilePictureUrl
                      ? `http://localhost:5190${candidate.profilePictureUrl}`
                      : "https://via.placeholder.com/40"
                  }
                  alt={candidate.firstName}
                />
              </div>

              <span className="col-span-5">
                {candidate.firstName} {candidate.lastName}
              </span>

              <div className="col-span-4 text-right">
                <button
                  onClick={() => handleDeleteClick(candidate.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <BiTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-12 px-4 py-6 text-center text-gray-400">
            No candidates found.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
