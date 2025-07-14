import React, { useState, useEffect } from "react";
import axios from "axios";
import JobForm from "../../components/Admin/AdminJobRole/JobForm";
import JobEditModal from "../../components/Admin/AdminJobRole/JobEditModal";
import BaseTable from "../../components/BaseTable";
import { BiPencil, BiTrash } from "react-icons/bi";
import Pagination from "../../components/Admin/Pagination"; 

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
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);

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
    if (!newJob.JobTitle || !newJob.Description)
      return alert("Please fill all fields.");
    try {
      await axios.post("http://localhost:5190/api/adminjobrole", newJob);
      alert("Job Created Successfully!");
      setNewJob({
        JobTitle: "",
        Description: "",
        WorkLocation: "Physical",
        WorkType: "Full-Time",
      });
      setCurrentPage(1);
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

  return (
    <div className="flex-1 p-6">
      <h1 className="mt-3 text-3xl font-bold">Create Jobs</h1>
      <JobForm newJob={newJob} setNewJob={setNewJob} onSubmit={handleSubmit} />

      <h1 className="mt-10 text-3xl font-bold">Manage Jobs</h1>
      <div className="mt-6">
      <BaseTable
  headers={[
    { label: "#", span: 2 },
    { label: "Job Title", span: 6 },
    { label: "Edit", span: 2, align: "text-right" },
    { label: "Delete", span: 2, align: "text-right" },
  ]}
  rows={jobs}
  searchKey="JobTitle" 
  sortOptions={[
    { label: "Title A-Z", value: "JobTitle:asc" },
    { label: "Title Z-A", value: "JobTitle:desc" },
    { label: "Created Date (Newest)", value: "CreatedAt:desc" },
    { label: "Created Date (Oldest)", value: "CreatedAt:asc" },
  ]}
  renderRow={(job, index) => (
    <>
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
          onClick={() => handleDeleteJob(job.JobId)}
          className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200"
        >
          <BiTrash className="w-4 h-4" />
        </button>
      </div>
    </>
  )}
/>

      </div>

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
      />

      {/* Edit Modal */}
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
