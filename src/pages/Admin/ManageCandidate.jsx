import React, { useState, useRef, useEffect } from "react";
import AdminHeader from "../../components/AdminHeader";
import { BiTrash, BiChevronDown } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";
import axios from "axios";

export default function ManageCandidate() {
  const [candidates, setCandidates] = useState([]);
  const [sortOrder, setSortOrder] = useState("Newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch candidates from the backend
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get("http://localhost:5190/api/AdminUser"); // 🚫 No token
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
      await axios.delete(`http://localhost:5190/api/AdminUser/${candidateId}`); // 🚫 No token

      setCandidates((prevCandidates) => prevCandidates.filter(candidate => candidate.id !== candidateId));
      alert("Candidate deleted successfully.");
    } catch (error) {
      console.error("Error deleting candidate:", error);

      const errorMessage = error.response?.data?.title || error.response?.data?.message || error.message;
      alert(`Failed to delete candidate: ${errorMessage}`);
    }
  };
  

  // Sort candidates
  const sortedCandidates = [...candidates].sort((a, b) =>
    sortOrder === "Newest" ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt)
  );

  // Filter candidate based on search query
  const filteredCandidates = sortedCandidates.filter((candidate) =>
    candidate.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-6">
      <AdminHeader />
      <h1 className="mt-8 text-3xl font-bold">Candidate Management</h1>
      <div className="mt-4">
        <div className="flex items-center justify-end gap-3 mb-4">
          <div className="relative">
            <input type="text" placeholder="Search admins..." className="w-64 px-8 py-2 border rounded-xl"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <IoIosSearch className="absolute w-5 h-5 text-gray-900 transform -translate-y-1/2 left-3 top-1/2" 
            />
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

        {/* Candidate List */}
        <div className="p-1">
          <div className="grid grid-cols-12 p-3 font-semibold">
            <span className="col-span-1">#</span>
            <span className="col-span-2">Profile</span>
            <span className="col-span-3">Name</span>
            <span className="col-span-5 text-right">Delete</span>
          </div>

          <ul className="space-y-2">
            {filteredCandidates.map((candidate, index) => (
              <div key={candidate.id} className="grid items-center grid-cols-12 p-2 bg-white rounded-md shadow-sm">
                <span className="col-span-1">{index + 1}</span>
                <div className="col-span-2">
                    <img className="w-10 h-10 rounded-full" src={candidate.image || "https://via.placeholder.com/40"} alt={candidate.firstName} />
                </div>
                <span className="col-span-3">{candidate.firstName} {candidate.lastName}</span>
                <div className="col-span-5 text-right">
                  <button onClick={() => handleDeleteCandidate(candidate.id)} className="p-2 text-red-600 hover:text-red-800">
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

