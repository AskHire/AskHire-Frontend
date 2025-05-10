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
    answer: "", // This will now store the option name (e.g., "option2") instead of the number
  });

  // Fetch job roles when component mounts
  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5190/api/JobRole');
        setJobRoles(response.data);
        
        // Set the first job role as selected if available
        if (response.data.length > 0) {
          setSelectedRole(response.data[0].jobTitle);
          setSelectedJobId(response.data[0].jobId);
          setFormData(prev => ({ ...prev, jobId: response.data[0].jobId }));
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
  
  const toggleAnswerDropdown = () => {
    setIsAnswerDropdownOpen(!isAnswerDropdownOpen);
  };
  
  const selectRole = (role, id) => {
    setSelectedRole(role);
    setSelectedJobId(id);
    setFormData(prev => ({ ...prev, jobId: id }));
    setIsOpen(false);
  };

  const selectAnswer = (answerNumber) => {
    // Convert the answer number to the option format (e.g., 2 -> "option2")
    const optionKey = `Option${answerNumber}`;
    setFormData(prev => ({ ...prev, answer: optionKey }));
    setIsAnswerDropdownOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (id, value) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, text: value } : option
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Transform options to the format expected by the API
    const optionsForSubmission = {};
    options.forEach((Option, index) => {
      optionsForSubmission[`Option${index + 1}`] = Option.text;
    });
    
    const dataToSubmit = {
      jobId: formData.jobId,
      questionName: formData.questionName,
      // The answer is already in the format "option#"
      answer: formData.answer,
      ...optionsForSubmission
    };
    
    try {
      const response = await axios.post("http://localhost:5190/api/Question", dataToSubmit);
      alert("Question added successfully!");
      console.log(response.data);
      
      // Reset form
      setFormData({
        jobId: selectedJobId, // Keep the selected job ID
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
      if (err.response) {
        setSubmissionError(`Error: ${err.response.data.message || "Unable to add the question"}`);
      } else {
        setSubmissionError("Error: Unable to connect to the server.");
      }
      console.error("Error:", err);
    }
  };

  // Helper function to get the number from option format
  const getAnswerNumber = (optionFormat) => {
    if (!optionFormat) return '';
    return optionFormat.replace('Option', '');
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
            className="flex items-center justify-between p-3 border rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={toggleDropdown}
          >
            <div className="flex items-center gap-2">
              🔍
              <span className="text-gray-700">
                {loading ? 'Loading...' : selectedRole || 'Select a job role'}
              </span>
            </div>
            ▼
          </div>
          
          {isOpen && !loading && (
            <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border z-10">
              {loadingError ? (
                <p className="px-4 py-2 text-red-500">{loadingError}</p>
              ) : jobRoles.length === 0 ? (
                <p className="px-4 py-2">No job roles found</p>
              ) : (
                <ul className="py-1 max-h-60 overflow-y-auto">
                  {jobRoles.map((role) => (
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
      
      {/* Question Form */}
      {selectedRole && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">{selectedRole}</h2>
          
          {submissionError && <p className="text-red-500 mb-4">{submissionError}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Text */}
            <div>
              <label htmlFor="questionName" className="block text-gray-700 font-medium mb-2">
                Question Text
              </label>
              <textarea
                id="questionName"
                name="questionName"
                value={formData.questionName}
                onChange={handleChange}
                placeholder="Enter your question here..."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>
            
            {/* Answer Options - Always 4 options */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Answer Options
              </label>
              <div className="space-y-3">
                {options.map((option) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(option.id, e.target.value)}
                      placeholder={`Option ${option.id}`}
                      className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Correct Answer Dropdown */}
            <div>
              <label htmlFor="answer" className="block text-gray-700 font-medium mb-2">
                Correct Answer
              </label>
              <div className="relative w-full">
                <div
                  className="flex items-center justify-between p-3 border rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={toggleAnswerDropdown}
                >
                  <span className="text-gray-700">
                    {formData.answer ? `Answer ${getAnswerNumber(formData.answer)}` : 'Select correct answer'}
                  </span>
                  ▼
                </div>
                
                {isAnswerDropdownOpen && (
                  <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border z-10">
                    <ul className="py-1">
                      {[1, 2, 3, 4].map((num) => (
                        <li
                          key={num}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => selectAnswer(num.toString())}
                        >
                          Answer {num}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-medium"
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