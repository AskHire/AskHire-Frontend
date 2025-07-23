import React, { useState, useEffect } from "react";
import axios from "axios";
import ManagerTopbar from '../../components/ManagerTopbar';
import SearchableDropdown from '../../components/SearchableDropdown';
import SuccessToast from '../../components/SuccessToast';

const CreateQuestions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnswerDropdownOpen, setIsAnswerDropdownOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [jobRoles, setJobRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);
  const [submissionError, setSubmissionError] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [recentJobRoles, setRecentJobRoles] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const [options, setOptions] = useState([
    { id: 1, text: "" },
    { id: 2, text: "" },
    { id: 3, text: "" },
    { id: 4, text: "" }
  ]);

  const [formData, setFormData] = useState({
    jobId: "",
    questionName: "",
    answer: "", // Will be "Option1", "Option2", etc.
  });

  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5190/api/JobRole');
        setJobRoles(response.data);

        if (response.data.length > 0) {
          const defaultJob = response.data[0];
          setSelectedRole(defaultJob.jobTitle);
          setSelectedJobId(defaultJob.jobId);
          setFormData(prev => ({ ...prev, jobId: defaultJob.jobId }));
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

  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleAnswerDropdown = () => setIsAnswerDropdownOpen(!isAnswerDropdownOpen);

  const selectRole = (role, id) => {
    setSelectedRole(role);
    setSelectedJobId(id);
    setFormData(prev => ({ ...prev, jobId: id }));
    setSearchQuery(''); // Clear search when role is selected
    
    // Update recent job roles
    const selectedJob = jobRoles.find(job => job.jobId === id);
    if (selectedJob) {
      setRecentJobRoles(prev => {
        const filtered = prev.filter(item => item.jobId !== id);
        return [selectedJob, ...filtered].slice(0, 3); // Keep only 3 recent items
      });
    }
  };

  const selectAnswer = (num) => {
    setFormData(prev => ({ ...prev, answer: `Option${num}` }));
    setIsAnswerDropdownOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (id, value) => {
    setOptions(prev =>
      prev.map(option =>
        option.id === id ? { ...option, text: value } : option
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const optionsForSubmission = {};
    options.forEach((opt, idx) => {
      optionsForSubmission[`Option${idx + 1}`] = opt.text;
    });

    const dataToSubmit = {
      jobId: formData.jobId,
      questionName: formData.questionName,
      answer: formData.answer,
      ...optionsForSubmission,
    };

    try {
      const response = await axios.post("http://localhost:5190/api/Question", dataToSubmit);
      
      // Clear any previous submission errors
      setSubmissionError("");
      
      // Show success toast
      setSuccessMessage("Question added successfully!");

      // Reset form
      setFormData({
        jobId: selectedJobId,
        questionName: "",
        answer: "",
      });

      setOptions([
        { id: 1, text: "" },
        { id: 2, text: "" },
        { id: 3, text: "" },
        { id: 4, text: "" }
      ]);

    } catch (err) {
      console.error("Submission error:", err);
      if (err.response?.data?.message) {
        setSubmissionError(`Error: ${err.response.data.message}`);
      } else {
        setSubmissionError("Error: Unable to connect to the server.");
      }
    }
  };

  const handleCloseSuccessToast = () => {
    setSuccessMessage("");
  };

  const getAnswerLabel = (optionFormat) => {
    if (!optionFormat) return '';
    const num = optionFormat.replace("Option", "");
    return `Option ${num}`;
  };

  return (
    <div className="flex-1 pt-1 pb-20 pr-6 pl-6">
      <div className="pb-4">
        <ManagerTopbar />
      </div>

      <h1 className="text-3xl font-bold mb-6">Create Questions</h1>

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
          <div className="p-3 border rounded-lg bg-gray-50 text-gray-500">
            Loading job roles...
          </div>
        ) : loadingError ? (
          <div className="p-3 border rounded-lg bg-red-50 text-red-500">
            {loadingError}
          </div>
        ) : (
          <SearchableDropdown
            items={jobRoles}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelect={selectRole}
            selectedId={selectedJobId}
            recentItems={recentJobRoles}
            title={selectedRole || "Select a job role"}
            placeholder="Search job roles..."
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        )}
      </div>

      {/* Form */}
      {selectedRole && (
        <div className="bg-white pt-6 px-6 py-6 rounded-lg shadow-md pb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{selectedRole}</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Job ID: {selectedJobId}
            </span>
          </div>

          {submissionError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {submissionError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question */}
            <div>
              <label className="block font-medium mb-2">Question</label>
              <textarea
                name="questionName"
                value={formData.questionName}
                onChange={handleChange}
                placeholder="Enter your question..."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                rows="3"
                required
              />
            </div>

            {/* Options */}
            <div>
              <label className="block font-medium mb-2">Answer Options</label>
              <div className="space-y-3">
                {options.map((opt) => (
                  <div key={opt.id} className="relative">
                    <input
                      type="text"
                      placeholder={`Option ${opt.id}`}
                      value={opt.text}
                      onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      required
                    />
                    <span className="absolute right-3 top-3 text-gray-400 text-sm">
                      {opt.id}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Correct Answer Dropdown */}
            <div>
              <label className="block font-medium mb-2">Correct Answer</label>
              <div className="relative w-full">
                <div
                  className="p-3 border rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={toggleAnswerDropdown}
                  tabIndex={0}
                >
                  <div className="flex items-center justify-between">
                    <span className={formData.answer ? "text-gray-700" : "text-gray-400"}>
                      {formData.answer ? getAnswerLabel(formData.answer) : "Select correct answer"}
                    </span>
                    <div className={`text-gray-500 transition-transform ${isAnswerDropdownOpen ? 'rotate-180' : ''}`}>▼</div>
                  </div>
                </div>

                {isAnswerDropdownOpen && (
                  <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-10">
                    <ul className="py-1">
                      {[1, 2, 3, 4].map(num => (
                        <li
                          key={num}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                          onClick={() => selectAnswer(num)}
                        >
                          <div className="flex items-center justify-between">
                            <span>Option {num}</span>
                            {formData.answer === `Option${num}` && (
                              <span className="text-blue-600 text-sm">✓</span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save Question
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateQuestions;