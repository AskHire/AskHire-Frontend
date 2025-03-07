import React, { useState } from 'react';

const SetupVacancy = () => {
  const [jobRole, setJobRole] = useState('');
  const [instructions, setInstructions] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [technicalSkills, setTechnicalSkills] = useState('');
  const [nonTechnicalSkills, setNonTechnicalSkills] = useState('');
  const [startDate, setStartDate] = useState('2025-01-23');
  const [endDate, setEndDate] = useState('2025-01-23');
  const [preScreeningPassMark, setPreScreeningPassMark] = useState(70);
  const [questionCount, setQuestionCount] = useState(20);
  const [duration, setDuration] = useState(20);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send data to an API)
    console.log({
      jobRole,
      instructions,
      education,
      experience,
      technicalSkills,
      nonTechnicalSkills,
      startDate,
      endDate,
      preScreeningPassMark,
      questionCount,
      duration,
    });
  };

  return (
    <div className=" bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Setup Vacancy</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {/* Job Role Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Job Role</label>
          <select
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a job role</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Product Manager">Product Manager</option>
            <option value="Data Scientist">Data Scientist</option>
          </select>
        </div>

        {/* Instructions */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={3}
          />
        </div>

        {/* Education */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
          <input
            type="text"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Experience */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
          <input
            type="text"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Technical Skills */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
          <input
            type="text"
            value={technicalSkills}
            onChange={(e) => setTechnicalSkills(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Non-Technical Skills */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Non-Technical Skills</label>
          <input
            type="text"
            value={nonTechnicalSkills}
            onChange={(e) => setNonTechnicalSkills(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Start Date and End Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Pre-Screening Pass Mark */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Pre-Screening Pass Mark (*)</label>
          <input
            type="number"
            value={preScreeningPassMark}
            onChange={(e) => setPreScreeningPassMark(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Question Count */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Question Count</label>
          <input
            type="number"
            value={questionCount}
            onChange={(e) => setQuestionCount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Duration (Minutes) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Minutes)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetupVacancy;