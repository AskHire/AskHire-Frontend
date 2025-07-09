import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Interview = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const userId = '39A9BE4D-062F-4BD5-8E51-F049F15C0F41';

  const fetchInterviewDetails = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get(`http://localhost:5190/api/Interview/byUser/${userId}`);
      setInterviews(response.data);
    } catch (error) {
      console.error('Failed to fetch interview data:', error);
      setInterviews([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInterviewDetails();
  }, []);

  if (loading) {
    return <p className="text-center my-10 text-gray-600">Loading interview details...</p>;
  }

  if (!interviews || interviews.length === 0) {
    return <p className="text-center my-10 text-red-500">No interviews found for this user.</p>;
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex justify-between items-center my-10">
        <h1 className="text-2xl font-bold">Upcoming Interviews</h1>
        <button
          onClick={fetchInterviewDetails}
          disabled={refreshing}
          className="px-4 py-1 rounded-full bg-green-100 text-green-600 text-sm"
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {interviews.map((interview, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-4 relative shadow-lg my-6"
        >
          <div className="flex justify-between items-start mb-1">
            <h2 className="text-xl font-bold">{interview.vacancyName}</h2>
            <div className="text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                   viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2"
                   strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M7 13l3 3 7-7" />
              </svg>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4">{interview.interviewInstructions}</p>

          <div className="flex items-center mb-6">
            <div className="text-gray-500 mr-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                   viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2"
                   strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {interview.interviewDate}
            </div>
            <div className="text-gray-500">
              {interview.interviewTime}
            </div>
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded-md font-medium">
            Join Meeting
          </button>
        </div>
      ))}
    </div>
  );
};

export default Interview;
