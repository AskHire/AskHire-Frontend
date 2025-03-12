import React, { useState, useRef } from "react";
import AdminHeader from "../../components/AdminHeader";
import { BiPencil, BiTrash, BiChevronDown } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";

export default function ManageCandidate() {
  const [jobs, setJobs] = useState([
    { id: 1, title: "Nicholas Patrick", createdAt: new Date(2023, 5, 1), image: "https://randomuser.me/api/portraits/men/1.jpg"},
    { id: 2, title: "Eshan Senadhi", createdAt: new Date(2023, 6, 15),image: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 3, title: "Kasun Lakmal", createdAt: new Date(2023, 7, 10), image: "https://randomuser.me/api/portraits/men/3.jpg" },
    { id: 4, title: "Larissa Burton", createdAt: new Date(2023, 8, 5),image: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 5, title: "Larissa Burton", createdAt: new Date(2023, 9, 20), image: "https://randomuser.me/api/portraits/women/2.jpg"  },
  ]);

 
  const [sortOrder, setSortOrder] = useState("Newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  

  // Handle job deletion
  const handleDeleteJob = (id) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  // Sort jobs
  const sortedJobs = [...jobs].sort((a, b) => (sortOrder === "Newest" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt));

  // Filter jobs based on search query
  const filteredJobs = sortedJobs.filter((job) => job.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // Toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <AdminHeader />

      <h1 className="mt-8 text-3xl font-bold">Candidate</h1>
      
      <div className="mt-4">
        <div className="flex items-center justify-end gap-3 mb-4">
          {/* Search Input */}
          <div className="relative">
            <input type="text" placeholder="Search jobs..." className="w-64 px-8 py-2 border rounded-xl" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
            <IoIosSearch className="absolute w-5 h-5 text-gray-900 transform -translate-y-1/2 left-3 top-1/2" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="flex items-center px-3 py-2 bg-gray-200 border rounded-md">
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

          {/*Admin List */}
          <div className="p-1">
            <div className="grid grid-cols-12 p-3 font-semibold">
              <span className="col-span-1">#</span>
              <span className="col-span-2">Profile</span>
              <span className="col-span-3">Name</span> 
              <span className="col-span-5 text-right">Delete</span>
            </div>
          
            <ul className="space-y-2">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="grid items-center grid-cols-12 p-2 mb-1 bg-white rounded-md shadow-sm">
                      <span className="col-span-1" >{job.id} </span>
                      <div className="col-span-2">
                      <img className="w-10 h-10 rounded-full" src={job.image} alt={job.name} />
                  </div>
                      <span className="col-span-2">{job.title}</span>
                  <div className="col-span-6 text-right">
                      <button onClick={() => handleDeleteJob(job.id)} className="p-2 text-red-600 hover:text-red-800"><BiTrash className="w-5 h-5" /></button>
                  </div>
            </div>
          ))}
        </ul> 
        </div>
        
      </div>
    </div>
  );
}
