import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { MdSchedule, MdVisibility } from 'react-icons/md';
import { IoIosArrowDown } from 'react-icons/io';
import ManagerTopbar from '../../components/ManagerTopbar';

const ViewLongList = () => {
  const [selectedVacancy, setSelectedVacancy] = useState('Software Engineer');

  const candidates = [
    { id: 1, name: 'Nicholas Patrick', marks: '97%', status: 'Interview Scheduled (12/30/2025 12:00pm)' },
    { id: 2, name: 'Eshan Senadhi', marks: '95%', status: 'Interview Scheduled (12/30/2025 12:30pm)' },
    { id: 3, name: 'Eshan Senadhi', marks: '92%', status: 'Interview Scheduled (12/30/2025 1:00pm)' },
    { id: 4, name: 'Larissa Burton', marks: '90%', status: 'Interview Scheduled (12/30/2025 1:30pm)' },
    { id: 5, name: 'Larissa Burton', marks: '85%', status: 'Schedule Interview' },
    { id: 6, name: 'Nicholas Patrick', marks: '82%', status: 'Interview Scheduled (1/14/2025 11:00am)' },
    { id: 7, name: 'Eshan Senadhi', marks: '78%', status: 'Schedule Interview' },
    { id: 8, name: 'Eshan Senadhi', marks: '75%', status: 'Schedule Interview' },
    { id: 9, name: 'Larissa Burton', marks: '65%', status: 'Schedule Interview' },
  ];

  return (
    <div className="bg-gray-100 flex-auto min-h-screen">
    <ManagerTopbar />

    <div className="p-6 bg-[#E6ECFA] min-h-screen flex flex-col items-center">
      {/* Vacancy Selection */}
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-2xl mb-6">
        <h2 className="text-lg font-semibold mb-2">Select Vacancy</h2>
        <div className="flex items-center border rounded-md p-2 cursor-pointer">
          <select
            className="w-full outline-none bg-transparent text-lg"
            value={selectedVacancy}
            onChange={(e) => setSelectedVacancy(e.target.value)}
          >
            <option value="Software Engineer">Software Engineer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Project Manager">Project Manager</option>
          </select>
          <IoIosArrowDown className="text-gray-500" />
        </div>
      </div>

      {/* Candidate List */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{selectedVacancy}</h2>
          <button className="text-blue-600 font-semibold">View All</button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-4 font-semibold text-gray-600 py-2 border-b">
          <span>#</span>
          <span>Profile</span>
          <span>Test Marks</span>
          <span>Schedule</span>
        </div>

        {/* Candidate Rows */}
        {candidates.map((candidate, index) => (
          <div
            key={candidate.id}
            className="grid grid-cols-4 items-center py-3 border-b hover:bg-gray-50 transition"
          >
            <span>{index + 1}</span>
            <div className="flex items-center gap-3">
              <FaUserCircle className="text-2xl text-gray-500" />
              <span>{candidate.name}</span>
            </div>
            <span>{candidate.marks}</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-blue-500 text-white rounded-md flex items-center gap-1 hover:bg-blue-600">
                <MdVisibility /> View Details
              </button>
              {candidate.status.includes('Schedule') ? (
                <button className="px-3 py-1 bg-green-500 text-white rounded-md flex items-center gap-1 hover:bg-green-600">
                  <MdSchedule /> Schedule Interview
                </button>
              ) : (
                <span className="text-gray-600 text-sm">{candidate.status}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Long-List Interviews Button */}
      <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700">
        Schedule Long-List Interviews
      </button>
    </div>
    </div>
  );
};

export default ViewLongList;
