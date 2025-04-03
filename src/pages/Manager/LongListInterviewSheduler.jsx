import React, { useState } from 'react';
import ManagerTopbar from '../../components/ManagerTopbar';

const LongListInterviewScheduler = () => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ date, startTime, endTime, duration, instructions });
    // Handle form submission logic here
  };

  return (
    <div className="bg-gray-100 flex-auto min-h-screen">
      <ManagerTopbar />
   
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Long-List Interviews Scheduler</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Schedule Long-List Interviews
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="date" className="block font-medium mb-2">Date</label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  className="w-full md:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="mm/dd/yyyy"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="startTime" className="block font-medium mb-2">Interviews Start Time</label>
                <div className="relative">
                  <input
                    type="time"
                    id="startTime"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="endTime" className="block font-medium mb-2">Interviews End Time</label>
                <div className="relative">
                  <input
                    type="time"
                    id="endTime"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="duration" className="block font-medium mb-2">Time Duration for One Interview</label>
              <div className="relative w-full md:w-64">
                <input
                  type="time"
                  id="duration"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <label htmlFor="instructions" className="block font-medium mb-2">Instructions</label>
              <textarea
                id="instructions"
                className="w-full p-3 border border-gray-300 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter instructions for interview..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 order-1 sm:order-2"
              >
                Schedule Interviews & Send Invites
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
  );
};

export default LongListInterviewScheduler;