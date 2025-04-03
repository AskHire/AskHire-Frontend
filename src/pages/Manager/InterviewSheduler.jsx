import React, { useState } from 'react';
import ManagerTopbar from '../../components/ManagerTopbar';

const InterviewScheduler = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [instructions, setInstructions] = useState('');
  const [candidate, setCandidate] = useState('John Smith (Frontend Developer)');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ candidate, date, time, instructions });
    // Handle form submission logic here
  };

  return (
    <div className="bg-gray-100 flex-auto min-h-screen">
      <ManagerTopbar />
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div className="p-6 pb-0">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Interview Scheduler</h1>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-6">
              <div className="text-gray-500 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Schedule Interview</h2>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Scheduling for:</label>
                <input 
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={candidate}
                  onChange={(e) => setCandidate(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">Date</label>
                  <div className="relative">
                    <input 
                      type="date"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="mm/dd/yyyy"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                    <div className="absolute right-3 top-2 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Time</label>
                  <div className="relative">
                    <input 
                      type="time"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="00:00"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                    <div className="absolute right-3 top-2 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Instructions</label>
                <textarea 
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
                  placeholder="Enter instructions for interview..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                ></textarea>
              </div>
              
              <div className="flex justify-between pt-2">
                <button 
                  type="button" 
                  className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Schedule Interview & Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default InterviewScheduler;