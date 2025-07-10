import React from "react";

export default function JobEditModal({ job, setJob, onSave, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-xl">
        <h2 className="mb-4 text-xl font-semibold">Edit Job</h2>
        <form onSubmit={onSave}>
          <div className="space-y-4">
            <div>
              <label className="font-semibold">Job Title</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={job.JobTitle}
                onChange={(e) => setJob({ ...job, JobTitle: e.target.value })}
              />
            </div>

            <div>
              <label className="font-semibold">Description</label>
              <textarea
                className="w-full px-3 py-2 border rounded-md"
                value={job.Description}
                onChange={(e) => setJob({ ...job, Description: e.target.value })}
              />
            </div>

            <div>
              <label className="font-semibold">Work Location</label>
              <div className="flex gap-4">
                {["Physical", "Remote"].map((loc) => (
                  <label key={loc} className="flex items-center">
                    <input
                      type="radio"
                      name="editWorkLocation"
                      value={loc}
                      checked={job.WorkLocation === loc}
                      onChange={(e) => setJob({ ...job, WorkLocation: e.target.value })}
                      className="mr-2"
                    />
                    {loc}
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
                      name="editWorkType"
                      value={type}
                      checked={job.WorkType === type}
                      onChange={(e) => setJob({ ...job, WorkType: e.target.value })}
                      className="mr-2"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
