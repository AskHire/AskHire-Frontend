import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, X } from 'lucide-react';
import ManagerTopbar from '../../components/ManagerTopbar';
import DeleteModal from '../../components/DeleteModal';
import SearchableDropdown from '../../components/SearchableDropdown';
import Pagination from '../../components/Admin/Pagination';

const ManageQuestions = () => {
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
  const [updatedQuestion, setUpdatedQuestion] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5190/api/JobRole');
        const data = await response.json();
        setJobRoles(data);
      } catch {
        setError('Failed to load job roles');
      } finally {
        setLoading(false);
      }
    };
    fetchJobRoles();
  }, []);

  useEffect(() => {
    const fetchAllQuestions = async () => {
      try {
        setQuestionsLoading(true);
        const response = await fetch('http://localhost:5190/api/Question');
        setAllQuestions(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setQuestionsLoading(false);
      }
    };
    fetchAllQuestions();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      setQuestions(allQuestions.filter(q => q.jobId === selectedJobId));
      setCurrentPage(1);
    } else {
      setQuestions([]);
    }
  }, [selectedJobId, allQuestions]);

  const handleJobRoleSelect = (jobRole) => {
    if (jobRole) {
      setSelectedRole(jobRole.jobTitle);
      setSelectedJobId(jobRole.jobId);
    } else {
      setSelectedRole('');
      setSelectedJobId(null);
    }
  };

  const handleDeleteClick = (id) => {
    setQuestionToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:5190/api/Question/${questionToDelete}`, {
        method: 'DELETE',
      });
      setAllQuestions(prev => prev.filter(q => q.questionId !== questionToDelete));
    } catch (err) {
      setError(err.message);
    } finally {
      setShowDeleteModal(false);
      setQuestionToDelete(null);
    }
  };

  const handleEdit = (question) => {
    let answerText = '';
    if (question.answer) {
      const answerKey = question.answer.toLowerCase();
      answerText = question[`option${answerKey.charAt(answerKey.length - 1)}`];
    }
    setUpdatedQuestion({ ...question, answerText });
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
      answer: '',
      answerText: ''
    });
    setShowModal(true);
  };

  const handleSaveQuestion = async () => {
    try {
      const { answerText, ...rest } = updatedQuestion;
      let answerKey = '';
      for (let i = 1; i <= 4; i++) {
        if (updatedQuestion[`option${i}`] === answerText) {
          answerKey = `Option${i}`;
          break;
        }
      }
      const dataToSave = { ...rest, answer: answerKey };

      const method = updatedQuestion.questionId ? 'PUT' : 'POST';
      const url = updatedQuestion.questionId
        ? `http://localhost:5190/api/Question/${updatedQuestion.questionId}`
        : 'http://localhost:5190/api/Question';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      });

      const saved = await response.json();
      const updated = updatedQuestion.questionId
        ? allQuestions.map(q => q.questionId === saved.questionId ? saved : q)
        : [...allQuestions, saved];

      setAllQuestions(updated);
      setShowModal(false);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedQuestion(prev => ({ ...prev, [name]: value }));
  };

  const handleAnswerChange = (e) => {
    setUpdatedQuestion(prev => ({ ...prev, answerText: e.target.value }));
  };

  const filteredQuestions = questions.filter(q =>
    q.questionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (sortOption === 'Newest') return b.questionId - a.questionId;
    if (sortOption === 'Oldest') return a.questionId - b.questionId;
    if (sortOption === 'Alphabetical') return a.questionName.localeCompare(b.questionName);
    return 0;
  });

  const indexOfLast = currentPage * questionsPerPage;
  const indexOfFirst = indexOfLast - questionsPerPage;
  const currentQuestions = sortedQuestions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedQuestions.length / questionsPerPage);

  const paginate = (pageNum) => setCurrentPage(pageNum);

  return (
    <div className="flex-1 pt-1 pb-4 pr-6 pl-6">
      <div className="pb-4"><ManagerTopbar /></div>
      <h1 className="text-3xl font-bold mb-6">Manage Questions</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Select Job Role</h2>
        <SearchableDropdown
          options={jobRoles}
          value={selectedJobId}
          onSelect={handleJobRoleSelect}
          placeholder="Search and select job role..."
          loading={loading}
          error={error}
          displayKey="jobTitle"
          valueKey="jobId"
        />
      </div>

      {selectedJobId && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{selectedRole}</h2>
            <div className="flex space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search questions..."
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

          <div className="grid grid-cols-12 py-2 border-b text-gray-500 text-sm">
            <div className="col-span-1 px-4">#</div>
            <div className="col-span-9 px-4">Name</div>
            <div className="col-span-1 text-center">Edit</div>
            <div className="col-span-1 text-center">Delete</div>
          </div>

          {questionsLoading ? (
            <div className="text-center py-8 text-gray-500">Loading questions...</div>
          ) : currentQuestions.length > 0 ? (
            currentQuestions.map((question, index) => (
              <div key={question.questionId} className="grid grid-cols-12 py-4 border-b items-center hover:bg-gray-50">
                <div className="col-span-1 px-4 text-gray-500">
                  {(currentPage - 1) * questionsPerPage + index + 1}
                </div>
                <div className="col-span-9 px-4 font-medium">{question.questionName}</div>
                <div className="col-span-1 flex justify-center">
                  <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors" onClick={() => handleEdit(question)}>
                    <Edit size={16} />
                  </button>
                </div>
                <div className="col-span-1 flex justify-center">
                  <button className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors" onClick={() => handleDeleteClick(question.questionId)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? `No questions found matching "${searchQuery}"` : 'No questions found for this job role.'}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={paginate} />
            </div>
          )}

          <div className="flex justify-center mt-8">
            <button className="bg-blue-600 text-white py-3 px-6 rounded-full text-lg font-medium hover:bg-blue-700 transition-colors" onClick={handleAddNewQuestion}>
              + Add New Question
            </button>
          </div>
        </div>
      )}

      {showModal && updatedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            <button className="absolute top-2 right-2" onClick={() => setShowModal(false)}>
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4">{updatedQuestion.questionId ? 'Edit Question' : 'Add New Question'}</h2>
            <div className="space-y-4">
              <label className="block font-semibold">Question</label>
              <input className="w-full border rounded p-2" name="questionName" value={updatedQuestion.questionName} onChange={handleChange} />
              {[1, 2, 3, 4].map(i => (
                <div key={i}>
                  <label className="block font-semibold">Option {i}</label>
                  <input className="w-full border rounded p-2" name={`option${i}`} value={updatedQuestion[`option${i}`]} onChange={handleChange} />
                </div>
              ))}
              <label className="block font-semibold">Correct Answer</label>
              <select className="w-full border rounded p-2" value={updatedQuestion.answerText} onChange={handleAnswerChange}>
                {[1, 2, 3, 4].map(i => (
                  <option key={i} value={updatedQuestion[`option${i}`]}>Option {i}: {updatedQuestion[`option${i}`]}</option>
                ))}
              </select>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={handleSaveQuestion}>Save</button>
            </div>
          </div>
        </div>
      )}

      <DeleteModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={confirmDelete} />
    </div>
  );
};

export default ManageQuestions;