import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ManagerTopbar from '../../components/ManagerTopbar';

const LongListInterviewScheduler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [vacancyName, setVacancyName] = useState('');
  const [vacancyId, setVacancyId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [interviewDuration, setInterviewDuration] = useState('00:30:00'); // Default 30 minutes
  const [interviewInstructions, setInterviewInstructions] = useState('');
  const [unscheduledCandidates, setUnscheduledCandidates] = useState([]);
  const [possibleInterviews, setPossibleInterviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allVacancies, setAllVacancies] = useState([]);
  const [sendEmail, setSendEmail] = useState(true); // Added email toggle
  
  // New state for success message and view
  const [successMessage, setSuccessMessage] = useState(null);
  const [showSuccessView, setShowSuccessView] = useState(false);
  const [scheduledResults, setScheduledResults] = useState({
    scheduledCount: 0,
    notScheduledCount: 0
  });

  // Extract vacancyId from URL query params and fetch unscheduled candidates directly
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const vacancyId = params.get('vacancyId');
    if (vacancyId) {
      setVacancyId(vacancyId);
      fetchUnscheduledCandidates(vacancyId);
    } else {
      setError('No vacancy ID specified');
      setIsLoading(false);
    }
  }, [location.search]);

  // Fetch unscheduled candidates for the given vacancy ID using the correct backend API
  const fetchUnscheduledCandidates = async (vacancyId) => {
    try {
      setIsLoading(true);
      setError(null);

      const formattedId = vacancyId.trim();
      const url = `http://localhost:5190/api/ManagerLongListInterviewScheduler/unscheduled-candidates/63742936-66b8-48a7-ba06-d476f344ec9f`;
      // const url = `http://localhost:5190/api/ManagerLongListInterviewScheduler/unscheduled-candidates/${formattedId}`;
      const response = await fetch(url);
      // console.log("Fetching unscheduled candidates for vacancy ID:", response);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch unscheduled candidates: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Unscheduled candidates data:", data);
      // Only keep candidates with status 'longlist' (case-insensitive)
      const unscheduled = data.filter(
        c => (c.status || '').toLowerCase() === 'longlist'
      );
      setUnscheduledCandidates(unscheduled);
      setIsLoading(false);

      if (unscheduled.length === 0) {
        setError("No unscheduled candidates found for this vacancy.");
      }
    } catch (error) {
      setError('Error fetching unscheduled candidates: ' + error.message);
      setIsLoading(false);
    }
  };

  // Calculate number of possible interviews based on time range and duration
  useEffect(() => {
    if (startTime && endTime && interviewDuration) {
      try {
        // Parse times to calculate difference
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        
        // Calculate total minutes in range
        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;
        
        if (endTotalMinutes <= startTotalMinutes) {
          setPossibleInterviews(0);
          return;
        }
        
        const totalAvailableMinutes = endTotalMinutes - startTotalMinutes;
        
        // Parse duration to get minutes
        const [durationHours, durationMinutes] = interviewDuration.split(':').map(Number);
        const interviewDurationMinutes = durationHours * 60 + durationMinutes;
        
        // Calculate number of possible interviews
        const possibleCount = Math.floor(totalAvailableMinutes / interviewDurationMinutes);
        setPossibleInterviews(possibleCount);
      } catch (error) {
        console.error("Error calculating possible interviews:", error);
        setPossibleInterviews(0);
      }
    } else {
      setPossibleInterviews(0);
    }
  }, [startTime, endTime, interviewDuration]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (possibleInterviews <= 0) {
      setError('Please set a valid time range and duration that allows for at least one interview');
      return;
    }
    
    if (!date) {
      setError('Please select a date for the interviews');
      return;
    }
    
    if (!interviewInstructions) {
      setError('Please provide interview instructions');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Format time strings properly - just send the time part without trying to combine with date
      // The backend will handle combining the date and time
      const requestData = {
        vacancy: vacancyId,
        date: date, // Just send the date as YYYY-MM-DD
        startTime: startTime, // Send just the time HH:MM
        endTime: endTime, // Send just the time HH:MM
        interviewDuration: interviewDuration,
        interviewInstructions: interviewInstructions,
        sendEmail: sendEmail // Add the email flag
      };
      
      console.log("Submitting interview schedule request:", requestData);
      
      const response = await fetch('http://localhost:5190/api/ManagerLongListInterviewScheduler/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText);
        throw new Error(errorText || 'Failed to schedule interviews');
      }
      
      const result = await response.json();
      console.log("Schedule response:", result);
      
      // Set the success message and show success view instead of navigating immediately
      setScheduledResults({
        scheduledCount: result.scheduledCount,
        notScheduledCount: result.notScheduledCount || 0
      });
      setSuccessMessage(`Successfully scheduled ${result.scheduledCount} interviews. ${result.notScheduledCount || 0} candidates could not be scheduled. ${sendEmail ? 'Email invitations have been sent.' : ''}`);
      setShowSuccessView(true);
      setIsSubmitting(false);
      
      // Don't navigate away automatically - we'll show the success screen instead
      // navigate(`/manager/LongList?message=${successMessage}`);
    } catch (error) {
      console.error("Error during submission:", error);
      setError(`Error scheduling interviews: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    // Check the referrer to determine which page to go back to
    const referrer = document.referrer;
    if (referrer.includes('/manager/View_LongList')) {
      navigate('/manager/View_LongList');
    } else {
      navigate('/manager/LongList');
    }
  };

  // Manual refresh functionality
  const handleRefresh = () => {
    if (vacancyId) {
      setIsLoading(true);
      fetchUnscheduledCandidates(vacancyId);
    } else {
      setError("No vacancy ID available to refresh data");
    }
  };
  
  // Handle return to listing after successful scheduling
  const handleReturnToListing = () => {
    // Check the referrer to determine which page to go back to
    const referrer = document.referrer;
    if (referrer.includes('/manager/View_LongList')) {
      navigate('/manager/View_LongList');
    } else {
      navigate('/manager/LongList');
    }
  };

  // Handle scheduling more interviews
  const handleScheduleMore = () => {
    // Reset the success view but keep the form data
    setShowSuccessView(false);
    setSuccessMessage(null);
    
    // If there are still unscheduled candidates, refresh the list
    if (vacancyId) {
      setIsLoading(true);
      fetchUnscheduledCandidates(vacancyId);
    }
  };

  // Success view component
  const SuccessView = () => (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <div className="flex justify-center mb-6">
        <div className="bg-green-100 rounded-full p-3">
          <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Interviews Scheduled Successfully!</h3>
      
      <div className="text-gray-600 mb-8">
        <p className="mb-4">{successMessage}</p>
        
        <div className="flex justify-center space-x-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{scheduledResults.scheduledCount}</div>
            <div className="text-sm text-gray-500">Scheduled</div>
          </div>
          
          {scheduledResults.notScheduledCount > 0 && (
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-1">{scheduledResults.notScheduledCount}</div>
              <div className="text-sm text-gray-500">Not Scheduled</div>
            </div>
          )}
        </div>
        
        {sendEmail && (
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-50 px-4 py-2 rounded-full flex items-center">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span className="text-blue-700">Email invitations sent</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={handleScheduleMore}
          className="px-6 py-3 bg-white border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
        >
          Schedule More Interviews
        </button>
        
        <button
          onClick={handleReturnToListing}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Return to Long List
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 flex-auto min-h-screen">
      <ManagerTopbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">
          {showSuccessView ? 'Interview Scheduling Complete' : 'Schedule Long-List Interviews'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-blue-600">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : showSuccessView ? (
            <SuccessView />
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Vacancy Name Display */}
              <div className="flex items-center mb-6 bg-blue-50 p-4 rounded-lg">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">
                  Vacancy: {vacancyName}
                </h3>
              </div>

              {/* Candidates Summary */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-800">
                    Unscheduled Candidates
                  </h3>
                  <div className="flex space-x-2">
                    <span className="bg-blue-100 text-blue-800 font-medium py-1 px-3 rounded-full">
                      {unscheduledCandidates.length} Candidates
                    </span>
                    <button 
                      type="button"
                      onClick={handleRefresh}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-1 rounded-full"
                      title="Refresh candidates list"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                {console.log('Rendering unscheduledCandidates:', unscheduledCandidates)}
                {unscheduledCandidates.length > 0 ? (
                  <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                    <ul className="space-y-2">
                      {unscheduledCandidates.map(candidate => (
                        <li key={candidate.applicationId} className="flex justify-between">
                          <span className="font-medium">{candidate.firstName} {candidate.lastName}</span>
                          <span className="text-gray-500">{candidate.email}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-center text-gray-500 mb-2">
                      No unscheduled candidates found for this vacancy
                    </div>
                    <div className="flex justify-center">
                      <button 
                        type="button"
                        onClick={handleRefresh} 
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        Refresh Candidates List
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Date Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              {/* Time Range Fields */}
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                {/* Start Time */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Interviews Start Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>

                {/* End Time */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Interviews End Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Duration Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">Time Duration for One Interview</label>
                <select
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={interviewDuration}
                  onChange={(e) => setInterviewDuration(e.target.value)}
                  required
                >
                  <option value="00:15:00">15 minutes</option>
                  <option value="00:30:00">30 minutes</option>
                  <option value="00:45:00">45 minutes</option>
                  <option value="01:00:00">1 hour</option>
                  <option value="01:30:00">1 hour 30 minutes</option>
                  <option value="02:00:00">2 hours</option>
                </select>
              </div>

              {/* Possible Interviews Count */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">Quantity of Possible Interviews</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg bg-gray-50"
                  value={possibleInterviews}
                  readOnly
                />
                {startTime && endTime ? (
                  possibleInterviews > 0 ? (
                    <p className="mt-2 text-sm text-green-600">
                      You can schedule up to {possibleInterviews} interviews with the selected time range and duration.
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-red-600">
                      Please configure start time, end time, and duration to allow for interviews.
                    </p>
                  )
                ) : (
                  <p className="mt-2 text-sm text-gray-500">
                    Please configure start time, end time, and duration
                  </p>
                )}
              </div>

              {/* Instructions Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">Interview Instructions</label>
                <textarea
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-32"
                  placeholder="Enter instructions for interview..."
                  value={interviewInstructions}
                  onChange={(e) => setInterviewInstructions(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* Email Option */}
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    id="sendEmail"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                  />
                  <label htmlFor="sendEmail" className="ml-2 block text-sm font-medium text-gray-700">
                    Send email invitations to all scheduled candidates
                  </label>
                </div>
              </div>

              {/* Button Container */}
              <div className="flex flex-col-reverse sm:flex-row justify-between pt-4 gap-3">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-center"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting || possibleInterviews <= 0 || unscheduledCandidates.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Scheduling...
                    </>
                  ) : (
                    'Schedule Interviews & Send Invites'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default LongListInterviewScheduler;