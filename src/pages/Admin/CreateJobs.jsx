import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import AdminHeader from "../../components/Admin/AdminHeader";
import JobForm from "../../components/Admin/AdminJobRole/JobForm";
import JobList from "../../components/Admin/AdminJobRole/JobList";
import JobSearchAndSort from "../../components/Admin/AdminJobRole/JobSearchAndSort";
import JobEditModal from "../../components/Admin/AdminJobRole/JobEditModal";

export default function CreateJobs() {
  const [newJob, setNewJob] = useState({
    JobTitle: "",
    Description: "",
    WorkLocation: "Physical",
    WorkType: "Full-Time",
  });

  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);

  // Fetch jobs whenever currentPage changes
  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage]);

  const fetchJobs = async (page = 1) => {
    try {

      const res = await axios.get(
        `http://localhost:5190/api/adminjobrole?page=${page}&pageSize=${itemsPerPage}`
      );
      const result = res.data;

      if (Array.isArray(result.data)) {
        const mapped = result.data.map((job) => ({
          JobId: job.JobId || job.jobId || job.id,
          JobTitle: job.JobTitle || job.jobTitle || "No Title",
          Description: job.Description || job.description || "No Description",
          WorkType: job.WorkType || job.workType || "N/A",
          WorkLocation: job.WorkLocation || job.workLocation || "N/A",
          CreatedAt: job.CreatedAt || job.createdAt || "2000-01-01",
        }));
        setJobs(mapped);
        setTotalPages(result.totalPages || 1);
      } else {
        console.error("Unexpected data:", result);
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newJob.JobTitle || !newJob.Description) return alert("Please fill all fields.");
    try {


      await axios.post("http://localhost:5190/api/adminjobrole", newJob);

      alert("Job Created Successfully!");


      setNewJob({
        JobTitle: "",
        Description: "",
        WorkLocation: "Physical",
        WorkType: "Full-Time",
      });

      setCurrentPage(1); // Reload first page
      fetchJobs(1);
    } catch (err) {
      alert(`Error: ${err.response?.data?.title || "Validation failed"}`);
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      await axios.delete(`http://localhost:5190/api/adminjobrole/${id}`);
      alert("Deleted successfully");
      fetchJobs(currentPage);
    } catch (err) {
      alert(`Delete failed: ${err.response?.data?.title || err.message}`);
    }
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    if (!editingJob) return;
    try {
      await axios.put(
        `http://localhost:5190/api/adminjobrole/${editingJob.JobId}`,
        editingJob
      );
      alert("Updated successfully");
      setEditingJob(null);
      fetchJobs(currentPage);
    } catch (err) {
      alert(`Update failed: ${err.response?.data?.title || "Unknown error"}`);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // Close sort dropdown when clicking outside

  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  return (
    <div className="flex-1 p-6">
      <AdminHeader />
      <h1 className="mt-8 text-3xl font-bold">Create Jobs</h1>
      <JobForm
        newJob={newJob}
        setNewJob={setNewJob}
        onSubmit={handleSubmit}
      />

      <h1 className="mt-10 text-3xl font-bold">Manage Jobs</h1>
      <JobSearchAndSort
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        dropdownRef={dropdownRef}
      />

      <JobList
        jobs={jobs}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        onEdit={setEditingJob}
        onDelete={handleDeleteJob}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
      />

      {editingJob && (
        <JobEditModal
          job={editingJob}
          setJob={setEditingJob}
          onSave={handleUpdateJob}
          onCancel={() => setEditingJob(null)}
        />
      )}
    </div>
  );
}
