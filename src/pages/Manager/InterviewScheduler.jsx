import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ManagerTopbar from '../../components/ManagerTopbar';

const InterviewScheduler = () => {
  const { applicationId } = useParams();  // Extract applicationId from URL
  const [candidate, setCandidate] = useState(null);  // State to store candidate data
  const [date, setDate] = useState('');  // Date input field
  const [time, setTime] = useState('');  // Time input field
  const [instructions, setInstructions] = useState('');  // Instructions input field

  // Fetch candidate details using the applicationId
  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await fetch(`https://localhost:7256/api/Candidates/${applicationId}`);
        const data = await response.json();

        if (data && data.user) {
          setCandidate(data);  // Store the candidate data, including their name
        } else {
          console.error('Candidate not found');
        }
      } catch (error) {
        console.error('Error fetching candidate data:', error);
      }
    };

    fetchCandidate();
  }, [applicationId]);

  // Handle form submission to send interview schedule
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!candidate || !candidate.user) {
      alert('Candidate data is missing. Please try again.');
      return;
    }

    try {
      // Create the interview data object to send to the backend
      const interviewData = {
        applicationId, // Use the applicationId from the URL
        date,          // Date entered by user
        time,          // Time entered by user
        instructions,  // Instructions entered by user
      };

      // Send the interview schedule data to the backend
      const response = await fetch("https://localhost:7256/api/Interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(interviewData),
      });

      if (response.ok) {
        alert("Interview scheduled successfully and invitation sent!");
      } else {
        alert("Failed to schedule interview.");
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="bg-gray-100 flex-auto min-h-screen">
      <ManagerTopbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">Interview Scheduler</h2>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-blue-600 flex flex-col py-4">
          <div className="flex items-center mb-6">
            <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <h2 className="text-xl font-bold text-gray-800">Schedule Interview</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Candidate Name Display */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-1">Scheduling for:</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={candidate ? `${candidate.user.firstName} ${candidate.user.lastName} (${candidate.user.position || 'Candidate'})` : "Loading..."}
                readOnly
              />
            </div>

            {/* Date and Time Flex Container */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              {/* Date field */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              {/* Time field */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">Time</label>
                <input
                  type="time"
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Instructions field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-1">Instructions</label>
              <textarea
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-32"
                placeholder="Enter instructions for interview..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Button container */}
            <div className="flex flex-col-reverse sm:flex-row justify-between pt-4 gap-3">
              <button
                type="button"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
              >
                Schedule Interview & Send Invite
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default InterviewScheduler;
