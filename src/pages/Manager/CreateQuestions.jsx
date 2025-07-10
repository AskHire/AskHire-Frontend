import React, { useState, useEffect } from "react";
import axios from "axios";
import ManagerTopbar from '../../components/ManagerTopbar';

const CreateQuestions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnswerDropdownOpen, setIsAnswerDropdownOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [jobRoles, setJobRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);
  const [submissionError, setSubmissionError] = useState("");

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
    setIsOpen(false);
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
      alert("Question added successfully!");

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

  const getAnswerLabel = (optionFormat) => {
    if (!optionFormat) return '';
    const num = optionFormat.replace("Option", "");
    return `Option ${num}`;
  };

  return (
    <div className="flex-1 pt-1 pb-4 pr-6 pl-6">
      <div className="pb-4">
        <ManagerTopbar />
      </div>

      <h1 className="text-3xl font-bold mb-6">Create Questions</h1>

      {/* Job Role Selector */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Select Job Role</h2>

        <div className="relative w-full">
          <div
            className="flex items-center justify-between p-3 border rounded-lg bg-white cursor-pointer"
            onClick={toggleDropdown}
          >
            <div className="text-gray-700">
              {loading ? "Loading..." : selectedRole || "Select a job role"}
            </div>
            <div className="text-gray-500">▼</div>
          </div>

          {isOpen && !loading && (
            <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-10">
              {loadingError ? (
                <p className="px-4 py-2 text-red-500">{loadingError}</p>
              ) : jobRoles.length === 0 ? (
                <p className="px-4 py-2">No job roles found</p>
              ) : (
                <ul className="py-1 max-h-60 overflow-y-auto">
                  {jobRoles.map(role => (
                    <li
                      key={role.jobId}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectRole(role.jobTitle, role.jobId)}
                    >
                      {role.jobTitle}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      {selectedRole && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">{selectedRole}</h2>

          {submissionError && <p className="text-red-500 mb-4">{submissionError}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question */}
            <div>
              <label className="block font-medium mb-2">Question</label>
              <textarea
                name="questionName"
                value={formData.questionName}
                onChange={handleChange}
                placeholder="Enter your question..."
                className="w-full p-3 border rounded-lg focus:ring-blue-500"
                required
              />
            </div>

            {/* Options */}
            <div>
              <label className="block font-medium mb-2">Answer Options</label>
              <div className="space-y-3">
                {options.map((opt) => (
                  <input
                    key={opt.id}
                    type="text"
                    placeholder={`Option ${opt.id}`}
                    value={opt.text}
                    onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-blue-500"
                    required
                  />
                ))}
              </div>
            </div>

            {/* Correct Answer Dropdown */}
            <div>
              <label className="block font-medium mb-2">Correct Answer</label>
              <div className="relative w-full">
                <div
                  className="p-3 border rounded-lg bg-white cursor-pointer"
                  onClick={toggleAnswerDropdown}
                >
                  {formData.answer ? getAnswerLabel(formData.answer) : "Select correct answer"}
                </div>

                {isAnswerDropdownOpen && (
                  <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-10">
                    <ul className="py-1">
                      {[1, 2, 3, 4].map(num => (
                        <li
                          key={num}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => selectAnswer(num)}
                        >
                          Option {num}
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
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
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
