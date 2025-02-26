import React, { useState } from 'react';

const ManageQuestions = () => {
  const [jobRole, setJobRole] = useState('');

  // Sample data for questions
  const [questions, setQuestions] = useState([
    {
      id: 1,
      questionText: 'What is React?',
      options: ['A library', 'A framework', 'A programming language'],
      correctAnswer: 'A library',
    },
    {
      id: 2,
      questionText: 'What is JSX?',
      options: ['JavaScript XML', 'A CSS framework', 'A database'],
      correctAnswer: 'JavaScript XML',
    },
  ]);

  const [editingQuestionId, setEditingQuestionId] = useState(null); // Track which question is being edited
  const [editedQuestionText, setEditedQuestionText] = useState('');
  const [editedOptions, setEditedOptions] = useState([]);
  const [editedCorrectAnswer, setEditedCorrectAnswer] = useState('');

  console.log('Rendering ManageQuestions:', { jobRole, questions }); // Debugging log

  const handleDeleteQuestion = (id) => {
    const updatedQuestions = questions.filter((question) => question.id !== id);
    setQuestions(updatedQuestions);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestionId(question.id);
    setEditedQuestionText(question.questionText);
    setEditedOptions([...question.options]);
    setEditedCorrectAnswer(question.correctAnswer);
  };

  const handleSaveEdit = () => {
    const updatedQuestions = questions.map((question) =>
      question.id === editingQuestionId
        ? {
            ...question,
            questionText: editedQuestionText,
            options: editedOptions,
            correctAnswer: editedCorrectAnswer,
          }
        : question
    );
    setQuestions(updatedQuestions);
    setEditingQuestionId(null); // Exit edit mode
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Questions</h1>

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

      {/* Questions List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <div key={question.id} className="mb-6 border-b border-gray-200 pb-4">
              {/* Question Number */}
              <p className="text-lg font-semibold mb-2">Question {index + 1}</p>

              {editingQuestionId === question.id ? (
                // Edit Mode
                <div>
                  <textarea
                    value={editedQuestionText}
                    onChange={(e) => setEditedQuestionText(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    rows={3}
                  />
                  {editedOptions.map((option, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...editedOptions];
                          newOptions[index] = e.target.value;
                          setEditedOptions(newOptions);
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md mr-2"
                      />
                      <button
                        onClick={() => {
                          const newOptions = editedOptions.filter((_, i) => i !== index);
                          setEditedOptions(newOptions);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setEditedOptions([...editedOptions, ''])}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    + Add Option
                  </button>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                    <select
                      value={editedCorrectAnswer}
                      onChange={(e) => setEditedCorrectAnswer(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select the correct answer</option>
                      {editedOptions.map((option, index) => (
                        <option key={index} value={option}>
                          {option || `Option ${index + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingQuestionId(null)}
                      className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{question.questionText}</h2>
                      <ul className="list-disc list-inside mb-4">
                        {question.options.map((option, index) => (
                          <li key={index} className="text-gray-600">
                            {option}
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Correct Answer:</span> {question.correctAnswer}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditQuestion(question)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No questions found for the selected job role.</p>
        )}
      </div>

      {/* Add New Question Button */}
      <div className="mt-6">
        <button
          onClick={() => console.log('Add new question')}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          + Add New Question
        </button>
      </div>
    </div>
  );
};

export default ManageQuestions;