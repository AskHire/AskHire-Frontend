import React from "react";
import { BiPencil, BiTrash } from "react-icons/bi";

export default function JobItem({ job, index, onEdit, onDelete }) {
  return (
    <div className="grid items-center grid-cols-12 px-6 py-4 transition bg-white border-b border-gray-200 hover:bg-gray-50">
      <span className="col-span-1 text-gray-700">{index }</span>
      <span className="col-span-7 font-medium text-gray-800">{job.JobTitle}</span>
      
      
      <div className="col-span-2 text-right">
        <button
          onClick={() => onEdit(job)}
          className="p-2 text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200"
        >
          <BiPencil className="w-4 h-4" />
        </button>
      </div>
      
      <div className="col-span-2 text-right">
        <button
          onClick={() => onDelete(job.JobId)}
          className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200"
        >
          <BiTrash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
