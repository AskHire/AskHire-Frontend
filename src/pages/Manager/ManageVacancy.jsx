import React from 'react';

const ManageVacancy = () => {
  // Sample data for active vacancies
  const activeVacancies = [
    { id: 1, name: 'Software Engineer', startDate: '2024-12-12', endDate: '2024-12-26' },
    { id: 2, name: 'Data Scientist', startDate: '2024-12-12', endDate: '2024-12-26' },
    { id: 3, name: 'Project Manager', startDate: '2024-12-12', endDate: '2024-12-26' },
    { id: 4, name: 'Front-End Developer', startDate: '2024-12-12', endDate: '2024-12-26' },
    { id: 5, name: 'Back-End Developer', startDate: '2024-12-12', endDate: '2024-12-26' },
    { id: 6, name: 'UI Engineer', startDate: '2024-12-12', endDate: '2024-12-26' },
    { id: 7, name: 'UX Engineer', startDate: '2024-12-12', endDate: '2024-12-26' },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Vacancy</h1>

      {/* Search and Sort Section */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search"
          className="p-2 border border-gray-300 rounded-md w-64"
        />
        <select className="p-2 border border-gray-300 rounded-md">
          <option value="newest">Sort by: Newest</option>
          <option value="oldest">Sort by: Oldest</option>
        </select>
      </div>

      {/* Active Vacancy Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Active Vacancies</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-2"># Vacancy Name</th>
              <th className="text-left py-2">Start Date</th>
              <th className="text-left py-2">End Date</th>
              <th className="text-left py-2">Edit</th>
              <th className="text-left py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {activeVacancies.map((vacancy) => (
              <tr key={vacancy.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="py-3">{vacancy.name}</td>
                <td className="py-3">{vacancy.startDate}</td>
                <td className="py-3">{vacancy.endDate}</td>
                <td className="py-3">
                  <button className="text-blue-500 hover:text-blue-700">Edit</button>
                </td>
                <td className="py-3">
                  <button className="text-red-500 hover:text-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageVacancy;