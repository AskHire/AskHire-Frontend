import React, { useState } from "react";

export default function JobForm({ newJob, setNewJob, onSubmit }) {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!newJob.JobTitle.trim()) newErrors.JobTitle = "Job Title is required.";
    if (!newJob.Description.trim()) newErrors.Description = "Description is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors); // Show errors
    } else {
      setErrors({}); // Clear errors
      onSubmit(e); // Proceed to submit
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-4xl mx-auto">
        <div className="p-8 mt-8 space-y-4 bg-white shadow-md rounded-xl">
          {/* Job Title */}
          <div>
            <label className="font-semibold">Job Title</label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.JobTitle ? "border-red-500" : "border-gray-300"
              }`}
              value={newJob.JobTitle}
              onChange={(e) =>
                setNewJob({ ...newJob, JobTitle: e.target.value })
              }
            />
            {errors.JobTitle && (
              <p className="mt-1 text-sm text-red-500">{errors.JobTitle}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold">Description</label>
            <textarea
              className={`w-full px-3 py-2 border rounded-md ${
                errors.Description ? "border-red-500" : "border-gray-300"
              }`}
              value={newJob.Description}
              onChange={(e) =>
                setNewJob({ ...newJob, Description: e.target.value })
              }
            />
            {errors.Description && (
              <p className="mt-1 text-sm text-red-500">{errors.Description}</p>
            )}
          </div>

          {/* Work Location */}
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
                    onChange={(e) =>
                      setNewJob({ ...newJob, WorkLocation: e.target.value })
                    }
                    className="mr-2"
                  />
                  {location}
                </label>
              ))}
            </div>
          </div>

          {/* Work Type */}
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
                    onChange={(e) =>
                      setNewJob({ ...newJob, WorkType: e.target.value })
                    }
                    className="mr-2"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button (Always Clickable) */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}