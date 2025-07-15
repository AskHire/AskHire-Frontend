import React, { useState, useEffect } from "react";
import axios from "axios";
import JobForm from "../../components/Admin/AdminJobRole/JobForm";
import JobEditModal from "../../components/Admin/AdminJobRole/JobEditModal";
import Pagination from "../../components/Admin/Pagination";
import DeleteModal from "../../components/DeleteModal";
import { BiPencil, BiTrash } from "react-icons/bi";

export default function CreateJobs() {
  const [newJob, setNewJob] = useState({
    JobTitle: "",
    Description: "",
    WorkLocation: "Physical",
    WorkType: "Full-Time",
  });

  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  // Delete modal and toast state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchJobs(currentPage, searchQuery, sortOrder);
  }, [currentPage, searchQuery, sortOrder]);

  const normalizeJob = (job) => ({
    JobId: job.jobId || job.JobId || job.id,
    JobTitle: job.jobTitle || job.JobTitle || "No Title",
    Description: job.description || job.Description || "No Description",
    WorkType: job.workType || job.WorkType || "N/A",
    WorkLocation: job.workLocation || job.WorkLocation || "N/A",
    CreatedAt: job.createdAt || job.CreatedAt || "2000-01-01",
  });

  const fetchJobs = async (page, search, sort) => {
    try {
      const params = new URLSearchParams({
        Page: page,
        PageSize: itemsPerPage,
      });

      if (search) params.append("SearchTerm", search);
      if (sort) {
        const [key, dir] = sort.split(":");
        params.append("SortBy", key);
        params.append("IsDescending", dir === "desc");
      }

      const res = await axios.get(
        `http://localhost:5190/api/adminjobrole?${params.toString()}`
      );
      const result = res.data;

      if (Array.isArray(result.data)) {
        setJobs(result.data.map(normalizeJob));
        setTotalPages(result.totalPages || 1);
      } else {
        setJobs([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newJob.JobTitle || !newJob.Description) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      await axios.post("http://localhost:5190/api/adminjobrole", newJob);
      setSuccessMessage("Job created successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setNewJob({
        JobTitle: "",
        Description: "",
        WorkLocation: "Physical",
        WorkType: "Full-Time",
      });
      setCurrentPage(1);
      fetchJobs(1, searchQuery, sortOrder);
    } catch (error) {
      alert(
        `Error creating job: ${error.response?.data?.title || error.message}`
      );
    }
  };

  const handleDeleteClick = (jobId) => {
    setJobToDelete(jobId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5190/api/adminjobrole/${jobToDelete}`);
      setSuccessMessage("Job deleted successfully!");
      fetchJobs(currentPage, searchQuery, sortOrder);
    } catch (error) {
      alert(`Delete failed: ${error.response?.data?.title || error.message}`);
    } finally {
      setDeleteModalOpen(false);
      setJobToDelete(null);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setJobToDelete(null);
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    if (!editingJob) return;

    try {
      await axios.put(
        `http://localhost:5190/api/adminjobrole/${editingJob.JobId}`,
        editingJob
      );
      setSuccessMessage("Job updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setEditingJob(null);
      fetchJobs(currentPage, searchQuery, sortOrder);
    } catch (error) {
      alert(`Update failed: ${error.response?.data?.title || error.message}`);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="flex-1 p-6">
      <h1 className="mt-3 text-3xl font-bold">Create Jobs</h1>

      <JobForm newJob={newJob} setNewJob={setNewJob} onSubmit={handleSubmit} />

      <h1 className="mt-10 text-3xl font-bold">Manage Jobs</h1>

      <div className="flex flex-col gap-2 my-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search by job title..."
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
          <option value="">Sort By</option>
          <option value="JobTitle:asc">Title A-Z</option>
          <option value="JobTitle:desc">Title Z-A</option>
          <option value="CreatedAt:desc">Newest</option>
          <option value="CreatedAt:asc">Oldest</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <div className="grid grid-cols-12 px-4 py-3 text-sm font-semibold text-gray-600 border-b bg-gray-50">
          <span className="col-span-2">#</span>
          <span className="col-span-6">Job Title</span>
          <span className="col-span-2 text-right">Edit</span>
          <span className="col-span-2 text-right">Delete</span>
        </div>

        {jobs.length > 0 ? (
          jobs.map((job, index) => (
            <div
              key={job.JobId}
              className="grid grid-cols-12 px-4 py-3 text-sm border-t hover:bg-gray-50"
            >
              <span className="col-span-2">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </span>
              <span className="col-span-6">{job.JobTitle}</span>
              <div className="col-span-2 text-right">
                <button
                  onClick={() => setEditingJob(job)}
                  className="p-2 text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200"
                >
                  <BiPencil className="w-4 h-4" />
                </button>
              </div>
              <div className="col-span-2 text-right">
                <button
                  onClick={() => handleDeleteClick(job.JobId)}
                  className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200"
                >
                  <BiTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-6 text-center text-gray-400">
            No matching records.
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {editingJob && (
        <JobEditModal
          job={editingJob}
          setJob={setEditingJob}
          onSave={handleUpdateJob}
          onCancel={() => setEditingJob(null)}
        />
      )}

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />

      {/*  Toast-style floating success message */}
      {successMessage && (
        <div className="fixed z-50 px-4 py-2 text-blue-800 bg-blue-100 border border-blue-300 rounded-lg shadow-lg top-4 right-4 animate-slide-in-out">
          <strong className="font-medium">Success!</strong> {successMessage}
        </div>
      )}
    </div>
  );
}
