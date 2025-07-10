import React, { useState, useEffect } from "react";
import AdminHeader from "../../components/Admin/AdminHeader";
import axios from "axios";
import { BiTrash } from "react-icons/bi";
import BaseTable from "../../components/BaseTable";

export default function ManageCandidate() {
  const [candidates, setCandidates] = useState([]);

  // Fetch candidates from the backend
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get("http://localhost:5190/api/AdminUser");
        const allUsers = response.data;
        const candidateOnly = allUsers.filter(user => user.role === "Candidate");
        setCandidates(candidateOnly);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    fetchCandidates();
  }, []);

  // Handle candidate deletion
  const handleDeleteCandidate = async (candidateId) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;
    try {
      await axios.delete(`http://localhost:5190/api/AdminUser/${candidateId}`);
      setCandidates((prev) => prev.filter(c => c.id !== candidateId));
      alert("Candidate deleted successfully.");
    } catch (error) {
      console.error("Error deleting candidate:", error);
      const msg = error.response?.data?.title || error.response?.data?.message || error.message;
      alert(`Failed to delete candidate: ${msg}`);
    }
  };

  return (
    <div className="flex-1 p-6">
      <AdminHeader />
      <h1 className="mt-8 text-3xl font-bold">Candidate Management</h1>

      <div className="mt-6">
        <BaseTable
          
          rows={candidates}
          searchKey="firstName"
          sortOptions={[
            { label: "Newest", value: "createdAt:desc" },
            { label: "Oldest", value: "createdAt:asc" },
          ]}
          headers={[
            { label: "#", span: 1 },
            { label: "Profile", span: 2 },
            { label: "Name", span: 3 },
            { label: "Delete", span: 5, align: "text-right" },
          ]}
          renderRow={(candidate, index) => (
            <>
              <span className="col-span-1">{index + 1}</span>
              <div className="col-span-2">
                <img
                  className="w-10 h-10 rounded-full"
                  src={candidate.image || "https://via.placeholder.com/40"}
                  alt={candidate.firstName}
                />
              </div>
              <span className="col-span-3">
                {candidate.firstName} {candidate.lastName}
              </span>
              <div className="col-span-5 text-right">
                <button
                  onClick={() => handleDeleteCandidate(candidate.id)}
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
