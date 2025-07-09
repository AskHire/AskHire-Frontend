import React from "react";

export default function JobForm({ newJob, setNewJob, onSubmit }) {
  const isFormValid = newJob.JobTitle.trim() && newJob.Description.trim();

  return (
    <form onSubmit={onSubmit}>
      <div className="max-w-4xl mx-auto">
        <div className="p-8 mt-8 space-y-4 bg-white shadow-md rounded-xl">
          <div>
            <label className="font-semibold">Job Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={newJob.JobTitle}
              onChange={(e) => setNewJob({ ...newJob, JobTitle: e.target.value })}
            />
          </div>

          <div>
            <label className="font-semibold">Description</label>
            <textarea
              className="w-full px-3 py-2 border rounded-md"
              value={newJob.Description}
              onChange={(e) => setNewJob({ ...newJob, Description: e.target.value })}
            />
          </div>

          <div>
            <label className="font-semibold">Work Location</label>
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
          </div>

          <div>
            <label className="font-semibold">Work Type</label>
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
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-md ${isFormValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
              disabled={!isFormValid}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
