import React, { useState, useEffect } from "react";
import axios from "axios";
import ManagerTopbar from '../../components/ManagerTopbar';
import SearchableDropdown from '../../components/SearchableDropdown';
import SuccessToast from '../../components/SuccessToast';

const SetupVacancy = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [jobRoles, setJobRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [recentJobRoles, setRecentJobRoles] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [submissionError, setSubmissionError] = useState("");

  const [formData, setFormData] = useState({
    VacancyName: "",
    Instructions: "",
    education: "",
    experience: "",
    requiredSkills: "",
    nonTechnicalSkills: "",
    startDate: "",
    endDate: "",
    cvPassMark: "",
    preScreenPassMark: "",
    questionCount: "",
    duration: ""
  });

  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5190/api/JobRole');
        setJobRoles(response.data);

        if (response.data.length > 0) {
          setSelectedRole(response.data[0].jobTitle);
          setSelectedJobId(response.data[0].jobId);
        }
      } catch (err) {
        console.error('Error fetching job roles:', err);
        setLoadingError('Failed to load job roles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobRoles();
  }, []);

  const handleJobRoleSelect = (jobTitle, jobId) => {
    setSelectedRole(jobTitle);
    setSelectedJobId(jobId);
    setJobSearchQuery('');
    
    // Add to recent items if not already there
    const selectedRole = jobRoles.find(role => role.jobId === jobId);
    if (selectedRole) {
      setRecentJobRoles(prev => {
        const filtered = prev.filter(item => item.jobId !== jobId);
        return [selectedRole, ...filtered].slice(0, 5); // Keep only 5 recent items
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      jobId: selectedJobId
    };

    try {
      const response = await axios.post("http://localhost:5190/api/Vacancy", dataToSubmit, {
        headers: { "Content-Type": "application/json" }
      });
      
      // Clear any previous submission errors
      setSubmissionError("");
      
      // Show success toast
      setSuccessMessage("Vacancy added successfully!");
      
      console.log(response.data);

      setFormData({
        VacancyName: "",
        Instructions: "",
        education: "",
        experience: "",
        requiredSkills: "",
        nonTechnicalSkills: "",
        startDate: "",
        endDate: "",
        cvPassMark: "",
        preScreenPassMark: "",
        questionCount: "",
        duration: ""
      });
    } catch (error) {
      console.error(error);
      setSubmissionError("Error creating vacancy: " + (error.response?.data?.message || error.message));
    }
  };

  const handleClear = () => {
    setFormData({
      VacancyName: "",
      Instructions: "",
      education: "",
      experience: "",
      requiredSkills: "",
      nonTechnicalSkills: "",
      startDate: "",
      endDate: "",
      cvPassMark: "",
      preScreenPassMark: "",
      questionCount: "",
      duration: ""
    });
  };

  const handleCloseSuccessToast = () => {
    setSuccessMessage("");
  };

  return (
    <div className="flex-1 pt-1 pb-4 pr-6 pl-6">
      <div className="pb-4">
        <ManagerTopbar />
      </div>
      <h1 className="text-3xl font-bold mb-6">Setup Vacancy</h1>

      {/* Success Toast */}
      <SuccessToast
        message={successMessage}
        onClose={handleCloseSuccessToast}
        duration={3000}
      />

      {/* Job Role Selector */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Select Job Role</h2>
        {loading ? (
          <div className="text-center py-4 text-gray-500">Loading job roles...</div>
        ) : loadingError ? (
          <div className="text-center py-4 text-red-500">{loadingError}</div>
        ) : (
          <SearchableDropdown
            items={jobRoles}
            searchQuery={jobSearchQuery}
            setSearchQuery={setJobSearchQuery}
            onSelect={handleJobRoleSelect}
            selectedId={selectedJobId}
            recentItems={recentJobRoles}
            title={selectedRole || "Select a job role..."}
            placeholder="Search job roles..."
            isOpen={isDropdownOpen}
            setIsOpen={setIsDropdownOpen}
          />
        )}
      </div>

      {/* Vacancy Form */}
      {selectedRole && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold mb-4">{selectedRole}</h2>

            {/* Submission Error */}
            {submissionError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {submissionError}
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-2">Vacancy Name</label>
              <input
                type="text"
                name="VacancyName"
                value={formData.VacancyName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Instructions</label>
              <textarea
                name="Instructions"
                value={formData.Instructions}
                onChange={handleChange}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                className="w-full h-10 p-3 border rounded-lg overflow-hidden resize-none transition-all duration-200 ease-in-out focus:h-32"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Education</label>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleChange}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                className="w-full h-10 p-3 border rounded-lg overflow-hidden resize-none transition-all duration-200 ease-in-out focus:h-32"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Experience</label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                className="w-full h-10 p-3 border rounded-lg overflow-hidden resize-none transition-all duration-200 ease-in-out focus:h-32"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Technical Skills</label>
              <textarea
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleChange}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                className="w-full h-10 p-3 border rounded-lg overflow-hidden resize-none transition-all duration-200 ease-in-out focus:h-32"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Non-Technical Skills</label>
              <textarea
                name="nonTechnicalSkills"
                value={formData.nonTechnicalSkills}
                onChange={handleChange}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                className="w-full h-10 p-3 border rounded-lg overflow-hidden resize-none transition-all duration-200 ease-in-out focus:h-32"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">📅 Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">📅 End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">📋 CV Pass Mark (%)</label>
              <input
                type="number"
                name="cvPassMark"
                value={formData.cvPassMark}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full p-3 border rounded-lg"
              />
            </div>

            {/* Pre-Screening */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">📊 Pre-Screening Pass Mark (%)</label>
                <input
                  type="number"
                  name="preScreenPassMark"
                  value={formData.preScreenPassMark}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">❓ Question Count</label>
                <input
                  type="number"
                  name="questionCount"
                  value={formData.questionCount}
                  onChange={handleChange}
                  min="1"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">⏰ Duration (Minutes)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={handleClear}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Clear
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SetupVacancy;