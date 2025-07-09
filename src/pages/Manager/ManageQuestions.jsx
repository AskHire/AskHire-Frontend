import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, Edit, Trash2, X } from 'lucide-react';
import ManagerTopbar from '../../components/ManagerTopbar';

const ManageQuestions = () => {
  // States
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [jobRoles, setJobRoles] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('Newest');
  const [showModal, setShowModal] = useState(false);
  const [updatedQuestion, setUpdatedQuestion] = useState({});

  // Fetch job roles on mount
  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5190/api/JobRole');
        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
        const data = await response.json();
        setJobRoles(data);
      } catch (err) {
        setError('Failed to load job roles');
      } finally {
        setLoading(false);
      }
    };
    fetchJobRoles();
  }, []);

  // Fetch all questions on mount
  useEffect(() => {
    const fetchAllQuestions = async () => {
      try {
        setQuestionsLoading(true);
        const response = await fetch('http://localhost:5190/api/Question');
        if (!response.ok) throw new Error('Failed to fetch questions');
        setAllQuestions(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setQuestionsLoading(false);
      }
    };
    fetchAllQuestions();
  }, []);

  // Filter questions when job role is selected
  useEffect(() => {
    if (selectedJobId) {
      setQuestions(allQuestions.filter(q => q.jobId === selectedJobId));
    } else {
      setQuestions([]);
    }
  }, [selectedJobId, allQuestions]);

  // Handle dropdown actions
  const toggleDropdown = () => setIsOpen(!isOpen);
  const selectRole = (role, jobId) => {
    setSelectedRole(role);
    setSelectedJobId(jobId);
    setIsOpen(false);
  };

  // CRUD operations
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    
    try {
      const response = await fetch(`http://localhost:5190/api/Question/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete question');
      
      setQuestions(questions.filter(q => q.questionId !== id));
      setAllQuestions(allQuestions.filter(q => q.questionId !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (question) => {
    setUpdatedQuestion({...question});
    setShowModal(true);
  };

  const handleAddNewQuestion = () => {
    setUpdatedQuestion({
      jobId: selectedJobId,
      questionName: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      answer: ''
    });
    setShowModal(true);
  };

  const handleSaveQuestion = async () => {
    try {
      if (updatedQuestion.questionId) {
        // Update existing question
        const response = await fetch(`http://localhost:5190/api/Question/${updatedQuestion.questionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedQuestion),
        });
        
        if (!response.ok) throw new Error('Failed to update question');
        
        const updatedQuestions = questions.map(q => 
          q.questionId === updatedQuestion.questionId ? updatedQuestion : q
        );
        setQuestions(updatedQuestions);
        setAllQuestions(allQuestions.map(q => 
          q.questionId === updatedQuestion.questionId ? updatedQuestion : q
        ));
      } else {
        // Create new question
        const response = await fetch('http://localhost:5190/api/Question', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedQuestion),
        });
        
        if (!response.ok) throw new Error('Failed to create question');
        
        const createdQuestion = await response.json();
        setQuestions([...questions, createdQuestion]);
        setAllQuestions([...allQuestions, createdQuestion]);
      }
      setShowModal(false);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Filter and sort questions
  const filteredQuestions = questions.filter(q => 
    q.questionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (sortOption === 'Newest') return b.questionId - a.questionId;
    if (sortOption === 'Oldest') return a.questionId - b.questionId;
    if (sortOption === 'Alphabetical') return a.questionName.localeCompare(b.questionName);
    return 0;
  });

  return (
    <div className="flex-1 pt-1 pb-4 pr-6 pl-6">
      <div className="pb-4">
        <ManagerTopbar />
      </div>
      <h1 className="text-3xl font-bold mb-6">Manage Questions</h1>
      
      {/* Job Role Selector */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Select Job Role</h2>
        <div className="relative w-full">
          <div
            className="flex items-center justify-between p-3 border rounded-lg bg-white cursor-pointer"
            onClick={toggleDropdown}
          >
            <div className="flex items-center gap-2">
              <Search size={20} className="text-gray-400" />
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

      {/* Questions List */}
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
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>
              
              <select
                className="px-4 py-2 bg-gray-100 rounded-lg"
                value={sortOption}
                onChange={e => setSortOption(e.target.value)}
              >
                <option>Newest</option>
                <option>Oldest</option>
                <option>Alphabetical</option>
              </select>
            </div>
          </div>
          
          {questionsLoading ? (
            <p className="text-center py-4">Loading questions...</p>
          ) : error ? (
            <p className="text-center py-4 text-red-500">Error: {error}</p>
          ) : (
            <>
              {/* Table */}
              <div className="grid grid-cols-12 py-2 border-b text-gray-500 text-sm">
                <div className="col-span-1 px-4">#</div>
                <div className="col-span-9 px-4">Name</div>
                <div className="col-span-1 text-center">Edit</div>
                <div className="col-span-1 text-center">Delete</div>
              </div>
              
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
              
              {/* Add Button */}
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

      {/* Question Modal */}
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
                  onChange={e => setUpdatedQuestion({...updatedQuestion, questionName: e.target.value})}
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={3}
                  placeholder="Enter question text here..."
                />
              </div>
              
              {/* Options */}
              <div className="space-y-3">
                <label className="block text-sm font-medium">Answer Options</label>
                
                {[1, 2, 3, 4].map(num => (
                  <div key={num}>
                    <label className="block text-xs text-gray-500 mb-1">Option {num}</label>
                    <input
                      type="text"
                      name={`option${num}`}
                      value={updatedQuestion[`option${num}`] || ''}
                      onChange={e => setUpdatedQuestion({
                        ...updatedQuestion, 
                        [`option${num}`]: e.target.value
                      })}
                      className="w-full p-3 border rounded-lg"
                      placeholder={`Enter option ${num}`}
                    />
                  </div>
                ))}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Correct Answer</label>
                <input
                  type="text"
                  name="answer"
                  value={updatedQuestion.answer || ''}
                  onChange={e => setUpdatedQuestion({...updatedQuestion, answer: e.target.value})}
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