import React, { useState, useRef } from "react";
import AdminHeader from "../../components/AdminHeader";
import { BiPencil, BiTrash, BiChevronDown } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";

export default function CreateJobs() {
  const [jobs, setJobs] = useState([
    { id: 1, title: "Software Engineer", createdAt: new Date(2023, 5, 1) },
    { id: 2, title: "Data Scientist", createdAt: new Date(2023, 6, 15) },
    { id: 3, title: "UI/UX Engineer", createdAt: new Date(2023, 7, 10) },
    { id: 4, title: "Full Stack Developer", createdAt: new Date(2023, 8, 5) },
    { id: 5, title: "Back-End Developer", createdAt: new Date(2023, 9, 20) },
  ]);

  const [newJob, setNewJob] = useState({ title: "", description: "", location: "Physical", type: "Full-Time" });
  const [sortOrder, setSortOrder] = useState("Newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle job creation
  const handleCreateJob = () => {
    if (newJob.title.trim()) {
      setJobs([...jobs, { id: jobs.length + 1, title: newJob.title, createdAt: new Date() }]);
      setNewJob({ title: "", description: "", location: "Physical", type: "Full-Time" });
    }
  };

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

      {/* Create Job Section */}
      <h1 className="mt-8 text-3xl font-bold">Create Jobs</h1>
      <div className="p-8 mt-8 bg-white shadow-md rounded-xl">
        <div className="space-y-4">
          {/* Job Title */}
          <div className="font-semibold">
            Job Title
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="font-semibold">
            Description
            <textarea
              className="w-full px-3 py-2 border rounded-md"
              value={newJob.description}
              onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
            />
          </div>

          {/* Work Location */}
          <div className="flex items-center gap-4">
            <div className="font-semibold">Work Location</div>
            <label className="flex items-center mr-9">
              <input
                type="radio"
                name="location"
                value="Physical"
                checked={newJob.location === "Physical"}
                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                className="mr-2"
              />
              Physical
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="location"
                value="Remote"
                checked={newJob.location === "Remote"}
                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                className="mr-2"
              />
              Remote
            </label>
          </div>

          {/* Work Type */}
          <div className="flex items-center gap-4">
            <div className="font-semibold pr-7">Work Type</div>
            <label className="flex items-center mr-6">
              <input
                type="radio"
                name="type"
                value="Full-Time"
                checked={newJob.type === "Full-Time"}
                onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                className="mr-2"
              />
              Full-Time
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="Part-Time"
                checked={newJob.type === "Part-Time"}
                onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                className="mr-2"
              />
              Part-Time
            </label>
          </div>

          {/* Create Job Button */}
          <div className="flex justify-end">
            <button onClick={handleCreateJob} className="px-4 py-2 text-white transition bg-blue-600 rounded-md hover:bg-blue-700">
              Create
            </button>
          </div>
        </div>
      </div>

      {/* Manage Jobs Section */}
      <h1 className="mt-8 text-3xl font-bold">Manage Jobs</h1>
      <div className="mt-4">
        <div className="flex items-center justify-end gap-3 mb-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-64 px-8 py-2 border rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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

        {/* Job List */}
        <div className="grid grid-cols-12 p-3 font-semibold">
            <span className="col-span-1">#</span>
            <span className="col-span-7">Name</span>
            <span className="col-span-2 text-right">Edit</span>
            <span className="col-span-2 text-right">Delete</span>
          </div>
          <ul className="space-y-2">
          {filteredJobs.map((job) => (
            <div key={job.id} className="grid items-center justify-between grid-cols-12 p-3 rounded-md bg-gray-50">
              <span className="col-span-1" >{job.id} </span>
              <span className="col-span-7">{job.title}</span>
              <div className="col-span-2 text-right">
                <button className="col-span-2 p-2 text-right text-blue-600 hover:text-blue-800"><BiPencil className="w-5 h-5" /></button>
                  </div>
                  <div className="col-span-2 text-right">
                <button onClick={() => handleDeleteJob(job.id)} className="col-span-2 p-2 text-right text-red-600 hover:text-red-800"><BiTrash className="w-5 h-5" /></button>
              </div>
            </div>
          ))}
        </ul> 
        
      </div>
    </div>
  );
}
