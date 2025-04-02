import React from 'react';

const LongList = () => {
  // Sample data for available long-lists
  const availableLongLists = [
    { id: 1, name: 'Software Engineer' },
    { id: 2, name: 'Data Scientist' },
    { id: 3, name: 'Project Manager' },
    { id: 4, name: 'Front-End Developer' },
    { id: 5, name: 'Back-End Developer' },
    { id: 6, name: 'UI Engineer' },
    { id: 7, name: 'UX Engineer' },
    { id: 8, name: 'UI/UX Engineer' },
  ];

  // Handler functions for buttons
  const handleViewLongList = (id) => {
    console.log(`View Long-List for vacancy with ID: ${id}`);
    // Add logic to view the long-list (e.g., navigate to a details page)
  };

  const handleScheduleInterviews = (id) => {
    console.log(`Schedule Interviews for vacancy with ID: ${id}`);
    // Add logic to schedule interviews (e.g., open a modal)
  };

  const handleDelete = (id) => {
    console.log(`Delete vacancy with ID: ${id}`);
    // Add logic to delete the vacancy (e.g., call an API)
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Candidate Long-List</h1>

      {/* Available Long-Lists Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Available Long-Lists</h2>

        {/* List of Vacancies */}
        <div className="space-y-3">
          {availableLongLists.map((list, index) => (
            <div
              key={list.id}
              className="flex justify-between items-center p-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {/* Vacancy Name */}
              <h3 className="text-lg font-medium">
                <span className="text-gray-600">{index + 1}.</span>{' '}
                <strong>{list.name}</strong>
              </h3>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                {/* View Long-List Button */}
                <button
                  onClick={() => handleViewLongList(list.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  View Long-List
                </button>

                {/* Schedule Interviews Button */}
                <button
                  onClick={() => handleScheduleInterviews(list.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  Schedule Interviews
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(list.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LongList;