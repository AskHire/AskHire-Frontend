import React, { useState, useRef, useEffect } from "react";
import AdminHeader from "../../components/AdminHeader";
import { BiPencil, BiTrash, BiChevronDown } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";
import axios from "axios";

export default function CreateJobs() {
  const [newJob, setNewJob] = useState({
    JobTitle: "",
    Description: "",
    WorkLocation: "Physical",
    WorkType: "Full-Time",
  });

  const [sortOrder, setSortOrder] = useState("Newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null); 

  // Fetch jobs on page load
  useEffect(() => {
    fetchJobs();
  }, []);

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5190/api/jobrole");
      console.log("API Response:", response.data); // Debugging: Check API response

      if (Array.isArray(response.data)) {
        const mappedJobs = response.data.map((job) => ({
          JobId: job.JobId || job.jobId || job.id, // Ensure correct field mapping
          JobTitle: job.JobTitle || job.jobTitle || "No Title",
          Description: job.Description || job.description || "No Description",
          WorkType: job.WorkType || job.workType || "N/A",
          WorkLocation: job.WorkLocation || job.workLocation || "N/A",
          CreatedAt: job.CreatedAt || job.createdAt || "Unknown Date",
        }));

        console.log("Mapped Jobs:", mappedJobs); // Debugging: Check final job list
        setJobs(mappedJobs);
      } else {
        console.error("Unexpected API response format:", response.data);
        setJobs([]); // Avoid breaking UI
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]); // Prevent UI crashes
    }
  };

  // Handle job creation
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newJob.JobTitle || !newJob.Description) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await axios.post("http://localhost:5190/api/jobrole", newJob);
      alert("Job Created Successfully!");

      setNewJob({
        JobTitle: "",
        Description: "",
        WorkLocation: "Physical",
        WorkType: "Full-Time",
      });

      setTimeout(() => {
        fetchJobs(); // Delay fetch to ensure backend updates
      }, 500);
    } catch (error) {
      console.error("Error creating job:", error.response?.data);
      alert(`Error creating job: ${error.response?.data?.title || "Validation failed"}`);
    }
  };

  // Handle job deletion
  const handleDeleteJob = async (JobId) => {
    try {
      console.log("Deleting job with ID:", JobId);
      await axios.delete(`http://localhost:5190/api/jobrole/${JobId}`);
      fetchJobs(); // Refresh job list after deletion
    } catch (error) {
      console.error("Error deleting job:", error);
      alert(`Failed to delete job: ${error.response?.data?.title || error.message}`);
    }
  };

  // Filter and sort jobs
  const filteredJobs = jobs
    .filter((job) => job?.JobTitle?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const dateA = new Date(a?.CreatedAt || "2000-01-01");
      const dateB = new Date(b?.CreatedAt || "2000-01-01");
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });
    
    const handleUpdateJob = async (e) => {
      e.preventDefault();
      if (!editingJob) return;
    
      try {
        await axios.put(`http://localhost:5190/api/jobrole/${editingJob.JobId}`, editingJob);
        alert("Job Updated Successfully!");
    
        setEditingJob(null); // Close edit card
        fetchJobs(); // Refresh job list
      } catch (error) {
        console.error("Error updating job:", error.response?.data);
        alert(`Error updating job: ${error.response?.data?.title || "Failed to update"}`);
      }
    };
    

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <AdminHeader />

      {/* Create Job Section */}
      <h1 className="mt-8 text-3xl font-bold">Create Jobs</h1>
      <form onSubmit={handleSubmit}>
        <div className="p-8 mt-8 bg-white shadow-md rounded-xl">
          <div className="space-y-4">
            <div className="font-semibold">
              Job Title
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={newJob.JobTitle}
                onChange={(e) => setNewJob({ ...newJob, JobTitle: e.target.value })}
              />
            </div>

            <div className="font-semibold">
              Description
              <textarea
                className="w-full px-3 py-2 border rounded-md"
                value={newJob.Description}
                onChange={(e) => setNewJob({ ...newJob, Description: e.target.value })}
              />
            </div>

            <div className="font-semibold">Work Location</div>
            <div className="flex gap-4">
              {["Physical", "Remote"].map((location) => (
                <label key={location} className="flex items-center">
                  <input
                    type="radio"
                    name="WorkLocation"
                    value={location}
                    checked={newJob.WorkLocation === location}
                    onChange={(e) => setNewJob({ ...newJob, WorkLocation: e.target.value })}
                    className="mr-2"
                  />
                  {location}
                </label>
              ))}
            </div>

            <div className="font-semibold">Work Type</div>
            <div className="flex gap-4">
              {["Full-Time", "Part-Time"].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    name="WorkType"
                    value={type}
                    checked={newJob.WorkType === type}
                    onChange={(e) => setNewJob({ ...newJob, WorkType: e.target.value })}
                    className="mr-2"
                  />
                  {type}
                </label>
              ))}
            </div>

            <div className="flex justify-end">
              <button className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Create
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Manage Jobs Section */}
      <h1 className="mt-8 text-3xl font-bold">Manage Jobs</h1>
      <div className="mt-4">
        {/* Search & Sort */}
        <div className="flex items-center justify-end gap-3 mb-4">
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
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center px-3 py-2 bg-gray-200 border rounded-md">
              Sort by: {sortOrder} <BiChevronDown className="ml-2" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 w-32 mt-2 bg-white border rounded-md shadow-md">
                {["Newest", "Oldest"].map((order) => (
                  <button key={order} className="w-full px-3 py-2 text-left hover:bg-gray-100" onClick={() => { setSortOrder(order); setDropdownOpen(false); }}>
                    {order}
                  </button>
                ))}
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
      <ul className="mt-4 space-y-2">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <div key={job.JobId} className="grid grid-cols-12 p-3 bg-white rounded-md shadow-md">
              <span className="col-span-1">{index + 1}</span>
              <span className="col-span-7">{job.JobTitle}</span>
              <div className="col-span-2 text-right">
                <button className="col-span-2 p-2 text-blue-600 hover:text-blue-800">
                  <BiPencil onClick={() => setEditingJob(job)} className="w-5 h-5 mb-1" />
                </button>
              </div>
              <div className="col-span-2 text-right">
                <button onClick={() => handleDeleteJob(job.JobId)} className="col-span-2 p-2 text-red-600 hover:text-red-800">
                  <BiTrash className="w-5 h-5 mb-1" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="mt-4 text-center text-gray-600">No jobs available</p>
        )}
      </ul>

      {/* Edit Job Card */}
{editingJob && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="w-full max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-700">Edit Job</h2>
      <form onSubmit={handleUpdateJob} className="mt-4 space-y-4">
        {/* Job Title (Read-Only) */}
        <div>
          <label className="block font-semibold text-gray-600">Job Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-gray-100 border rounded-md"
            value={editingJob.JobTitle}
            disabled // Prevent editing Job Title
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold text-gray-600">Description</label>
          <textarea
            className="w-full px-3 py-2 border rounded-md"
            value={editingJob.Description}
            onChange={(e) => setEditingJob({ ...editingJob, Description: e.target.value })}
          />
        </div>

        {/* Work Location */}
        <div>
          <label className="block font-semibold text-gray-600">Work Location</label>
          <div className="flex gap-4">
            {["Physical", "Remote"].map((location) => (
              <label key={location} className="flex items-center">
                <input
                  type="radio"
                  name="WorkLocation"
                  value={location}
                  checked={editingJob.WorkLocation === location}
                  onChange={(e) => setEditingJob({ ...editingJob, WorkLocation: e.target.value })}
                  className="mr-2"
                />
                {location}
              </label>
            ))}
          </div>
        </div>

        {/* Work Type */}
        <div>
          <label className="block font-semibold text-gray-600">Work Type</label>
          <div className="flex gap-4">
            {["Full-Time", "Part-Time"].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="radio"
                  name="WorkType"
                  value={type}
                  checked={editingJob.WorkType === type}
                  onChange={(e) => setEditingJob({ ...editingJob, WorkType: e.target.value })}
                  className="mr-2"
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => setEditingJob(null)}
            className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  </div>
  );
}

