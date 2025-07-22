import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import ManagerTopbar from '../../components/ManagerTopbar';

const SetupVacancy = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [jobRoles, setJobRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectRole = (role, id) => {
    setSelectedRole(role);
    setSelectedJobId(id);
    setIsOpen(false);
    setSearchQuery('');
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
      alert("Vacancy created successfully!");
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
      alert("Error creating vacancy: " + (error.response?.data?.message || error.message));
      console.error(error);
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

  const filteredJobRoles = jobRoles.filter(role =>
    role.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 pt-1 pb-4 pr-6 pl-6">
      <div className="pb-4">
        <ManagerTopbar />
      </div>
      <h1 className="text-3xl font-bold mb-6">Setup Vacancy</h1>

      {/* Job Role Selector */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Select Job Role</h2>
        <div className="relative w-full">
          <div
            className="flex items-center justify-between p-3 border rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={toggleDropdown}
          >
            <div className="text-gray-700">
              {loading ? 'Loading...' : selectedRole || 'Select a job role'}
            </div>
            <div className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</div>
          </div>

          {isOpen && !loading && (
            <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-10">
              <div className="p-3 border-b">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search job roles..."
                    className="w-full px-4 py-2 pl-10 bg-gray-50 rounded-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto">
                {loadingError ? (
                  <p className="px-4 py-2 text-red-500">{loadingError}</p>
                ) : filteredJobRoles.length === 0 ? (
                  <p className="px-4 py-2 text-gray-500">
                    {searchQuery ? `No job roles found matching "${searchQuery}"` : 'No job roles found'}
                  </p>
                ) : (
                  <ul className="py-1">
                    {filteredJobRoles.map((role) => (
                      <li
                        key={role.jobId}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectRole(role.jobTitle, role.jobId)}
                      >
                        <div className="flex items-center justify-between">
                          <span>{role.jobTitle}</span>
                          {role.jobId === selectedJobId && (
                            <span className="text-blue-600 text-sm">✓ Selected</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vacancy Form */}
      {selectedRole && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold mb-4">{selectedRole}</h2>

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
                ronInput={(e) => {
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
