import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiCheckCircle, FiCalendar } from 'react-icons/fi';

const Interview = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const userId = '53E4740B-D65F-488D-8515-1E6B9569F1EB';

  const fetchInterviewDetails = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get(`http://localhost:5190/api/CandidateInterview/byUser/${userId}`);
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
            <FiCheckCircle className="text-green-500 text-xl" />
          </div>

          <p className="text-gray-600 text-sm mb-4">{interview.interviewInstructions}</p>

          <div className="flex items-center mb-6">
            <div className="text-gray-500 mr-6 flex items-center">
              <FiCalendar className="mr-2" />
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
