import React from "react";
import JobItem from "./JobItem";
import Pagination from "../Pagination";

export default function JobList({
  jobs,
  currentPage,
  itemsPerPage,
  totalPages,
  onEdit,
  onDelete,
  onPrev,
  onNext,
}) {
  return (
    <div>
      {/* Table Header */}
      <div className="grid grid-cols-12 p-3 font-semibold">
        <span className="col-span-1">#</span>
        <span className="col-span-7">Name</span>
        <span className="col-span-2 text-right">Edit</span>
        <span className="col-span-2 text-right">Delete</span>
      </div>

      {/* Job Items */}
      {jobs.length > 0 ? (
        jobs.map((job, idx) => (
          <JobItem
            key={job.JobId}
            job={job}
            index={(currentPage - 1) * itemsPerPage + idx + 1}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      ) : (
        <p className="mt-4 text-center text-gray-600">No jobs available</p>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={onPrev}
        onNext={onNext}
      />

      
    </div>
  );
}
