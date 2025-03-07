import React, { useState } from 'react';

const CreateQuestions = () => {
  const [jobRole, setJobRole] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send data to an API)
    console.log({
      jobRole,
      questionText,
      options,
      correctAnswer,
    });
  };

  return (
    <div className=" bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Create Questions</h1>

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

        {/* Question Text */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter your question here."
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={4}
          />
        </div>

        {/* Answer Options */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Answer Options</label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="w-full p-2 border border-gray-300 rounded-md mr-2"
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddOption}
            className="text-blue-500 hover:text-blue-700"
          >
            + Add Option
          </button>
        </div>

        {/* Correct Answer */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
          <select
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select the correct answer</option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option || `Option ${index + 1}`}
              </option>
            ))}
          </select>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Create
          </button>
        </div>
      </form>

      {/* Add New Question Button */}
      <div className="mt-6">
        <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
          + Add New Question
        </button>
      </div>
    </div>
  );
};

export default CreateQuestions;