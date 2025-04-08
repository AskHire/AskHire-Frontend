import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, Edit, Trash2, X } from 'lucide-react';
import ManagerTopbar from '../../components/ManagerTopbar';

const ManageQuestions = () => {
  // Job role selector states
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [jobRoles, setJobRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Questions management states
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsError, setQuestionsError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('Newest');
  const [allQuestions, setAllQuestions] = useState([]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [updatedQuestion, setUpdatedQuestion] = useState({});

  // Fetch job roles on component mount
  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5190/api/JobRole');
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        setJobRoles(data);
      } catch (err) {
        console.error('Error fetching job roles:', err);
        setError('Failed to load job roles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobRoles();
  }, []);

  // Fetch all questions when component mounts
  useEffect(() => {
    const fetchAllQuestions = async () => {
      try {
        setQuestionsLoading(true);
        const response = await fetch('http://localhost:5190/api/Question');
        
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        
        const data = await response.json();
        setAllQuestions(data);
      } catch (err) {
        setQuestionsError(err.message);
      } finally {
        setQuestionsLoading(false);
      }
    };

    fetchAllQuestions();
  }, []);

  // Filter questions when a job role is selected
  useEffect(() => {
    if (selectedJobId) {
      // Filter questions that match the selected job role ID
      const filteredQuestions = allQuestions.filter(
        question => question.jobId === selectedJobId
      );
      setQuestions(filteredQuestions);
    } else {
      // Clear questions when no role is selected
      setQuestions([]);
    }
  }, [selectedJobId, allQuestions]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const selectRole = (role, jobId) => {
    setSelectedRole(role);
    setSelectedJobId(jobId);
    setIsOpen(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    
    try {
      const response = await fetch(`http://localhost:5190/api/Question/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete question');
      }
      
      // Remove from both filtered questions and all questions
      setQuestions(questions.filter((q) => q.questionId !== id));
      setAllQuestions(allQuestions.filter((q) => q.questionId !== id));
    } catch (err) {
      setQuestionsError(err.message);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setUpdatedQuestion({...question});
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedQuestion({ ...updatedQuestion, [name]: value });
  };

  const handleAddNewQuestion = () => {
    const newQuestion = {
      jobId: selectedJobId,
      questionName: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      answer: ''
    };
    
    setEditingQuestion(null);
    setUpdatedQuestion(newQuestion);
    setShowModal(true);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter questions based on search query
  const filteredQuestions = questions.filter(question => 
    question.questionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort questions based on selected option
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (sortOption === 'Newest') {
      return b.questionId - a.questionId;
    } else if (sortOption === 'Oldest') {
      return a.questionId - b.questionId;
    } else if (sortOption === 'Alphabetical') {
      return a.questionName.localeCompare(b.questionName);
    }
    return 0;
  });

  const handleSaveQuestion = async () => {
    try {
      if (updatedQuestion.questionId) {
        // Update existing question
        const response = await fetch(`http://localhost:5190/api/Question/${updatedQuestion.questionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedQuestion),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update question');
        }
        
        // Update questions in state
        setQuestions(
          questions.map((q) => (q.questionId === updatedQuestion.questionId ? updatedQuestion : q))
        );
        setAllQuestions(
          allQuestions.map((q) => (q.questionId === updatedQuestion.questionId ? updatedQuestion : q))
        );
      } else {
        // Create new question
        const response = await fetch('http://localhost:5190/api/Question', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedQuestion),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create question');
        }
        
        const createdQuestion = await response.json();
        
        // Add new question to state
        setQuestions([...questions, createdQuestion]);
        setAllQuestions([...allQuestions, createdQuestion]);
      }
      
      // Close modal after successful save
      setShowModal(false);
    } catch (err) {
      console.error('Error saving question:', err);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <ManagerTopbar />
      <h1 className="text-3xl font-bold mb-6">Manage Questions</h1>
      
      {/* Job Role Selector */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Select Job Role</h2>
        
        <div className="relative w-full">
          <div
            className="flex items-center justify-between p-3 border rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={toggleDropdown}
          >
            <div className="flex items-center gap-2">
              <Search className="text-gray-400" size={20} />
              <span className="text-lg">
                {loading ? 'Loading...' : selectedRole || 'Select Job Role'}
              </span>
            </div>
            <ChevronDown className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {isOpen && !loading && (
            <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border z-10">
              {error ? (
                <p className="px-4 py-2 text-red-500">{error}</p>
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

      {/* Questions List Table */}
      {selectedJobId && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{selectedRole}</h2>
            
            <div className="flex space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="px-4 py-2 pl-10 bg-gray-100 rounded-lg"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>
              
              <div className="relative">
                <select
                  className="px-4 py-2 bg-gray-100 rounded-lg appearance-none pr-10"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option>Newest</option>
                  <option>Oldest</option>
                  <option>Alphabetical</option>
                </select>
                <span className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
                  Sort by:
                </span>
              </div>
            </div>
          </div>
          
          {questionsLoading ? (
            <p className="text-center py-4">Loading questions...</p>
          ) : questionsError ? (
            <p className="text-center py-4 text-red-500">Error: {questionsError}</p>
          ) : (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-12 py-2 border-b text-gray-500 text-sm">
                <div className="col-span-1 px-4">#</div>
                <div className="col-span-9 px-4">Name</div>
                <div className="col-span-1 text-center">Edit</div>
                <div className="col-span-1 text-center">Delete</div>
              </div>
              
              {/* Table Body */}
              {sortedQuestions.length > 0 ? (
                sortedQuestions.map((question, index) => (
                  <div 
                    key={question.questionId} 
                    className="grid grid-cols-12 py-4 border-b items-center hover:bg-gray-50"
                  >
                    <div className="col-span-1 px-4 text-gray-500">{index + 1}</div>
                    <div className="col-span-9 px-4 font-medium">
                      {question.questionName}
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button 
                        className="p-2 bg-blue-100 text-blue-600 rounded-full"
                        onClick={() => handleEdit(question)}
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button 
                        className="p-2 bg-red-100 text-red-600 rounded-full"
                        onClick={() => handleDelete(question.questionId)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No questions found for this job role.
                </div>
              )}
              
              {/* Add New Question Button */}
              <div className="flex justify-center mt-8">
                <button 
                  className="bg-blue-600 text-white py-3 px-6 rounded-full text-lg font-medium"
                  onClick={handleAddNewQuestion}
                >
                  + Add New Question
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Question Edit/Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {updatedQuestion.questionId ? 'Edit Question' : 'Add New Question'}
              </h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Question Text</label>
                <textarea
                  name="questionName"
                  value={updatedQuestion.questionName || ''}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={3}
                  placeholder="Enter question text here..."
                />
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium">Answer Options</label>
                
                {/* Option 1 */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Option 1</label>
                  <input
                    type="text"
                    name="option1"
                    value={updatedQuestion.option1 || ''}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Enter option 1"
                  />
                </div>
                
                {/* Option 2 */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Option 2</label>
                  <input
                    type="text"
                    name="option2"
                    value={updatedQuestion.option2 || ''}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Enter option 2"
                  />
                </div>
                
                {/* Option 3 */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Option 3</label>
                  <input
                    type="text"
                    name="option3"
                    value={updatedQuestion.option3 || ''}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Enter option 3"
                  />
                </div>
                
                {/* Option 4 */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Option 4</label>
                  <input
                    type="text"
                    name="option4"
                    value={updatedQuestion.option4 || ''}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Enter option 4"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Correct Answer</label>
                <input
                  type="text"
                  name="answer"
                  value={updatedQuestion.answer || ''}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter the correct answer"
                />
              </div>
              
              <div className="flex space-x-2 pt-4">
                <button 
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
                  onClick={handleSaveQuestion}
                >
                  {updatedQuestion.questionId ? 'Save Changes' : 'Create Question'}
                </button>
                <button 
                  className="bg-gray-300 px-6 py-2 rounded-lg font-medium"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuestions;