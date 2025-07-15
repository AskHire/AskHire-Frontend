import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ManagerTopbar from '../../components/ManagerTopbar';

const InterviewScheduler = () => {
  const { applicationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('01:00:00');
  const [interviewInstructions, setInterviewInstructions] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [interviewId, setInterviewId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [timeWarning, setTimeWarning] = useState('');
  const [originalVacancy, setOriginalVacancy] = useState('');

  // Get the original vacancy from URL when component mounts
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const vacancy = params.get('vacancy');
    const editMode = params.get('edit') === 'true';
    if (vacancy) {
      setOriginalVacancy(decodeURIComponent(vacancy));
    }
    setIsEditing(editMode);
  }, [location.search]);

  // Fetch candidate details and any existing interview data
  useEffect(() => {
    const fetchCandidateAndInterview = async () => {
      try {
        setIsLoading(true);
        const timestamp = new Date().getTime();
        const response = await fetch(`http://localhost:5190/api/ManagerCandidates/${applicationId}?_=${timestamp}`);
        if (!response.ok) throw new Error(`Failed to fetch candidate: ${response.status}`);
        const data = await response.json();
        if (data && data.user) {
          setCandidate(data);
          if (!originalVacancy && data.jobTitle) setOriginalVacancy(data.jobTitle);
          if (isEditing) {
            try {
              const interviewResponse = await fetch(`http://localhost:5190/api/ManagerInterview/application/${applicationId}?_=${timestamp}`);
              if (interviewResponse.ok) {
                const interviewData = await interviewResponse.json();
                if (interviewData) {
                  setInterviewId(interviewData.interviewId);
                  if (interviewData.date) setDate(new Date(interviewData.date).toISOString().split('T')[0]);
                  if (interviewData.time) setTime(interviewData.time);
                  if (interviewData.duration) setDuration(interviewData.duration);
                  if (interviewData.instructions) setInterviewInstructions(interviewData.instructions);
                }
              }
            } catch (interviewError) {
              console.error("Error fetching interview:", interviewError);
            }
          }
        } else {
          console.error('Candidate not found');
        }
        setIsLoading(false);
      } catch (error) {
        setError(`Error loading data: ${error.message}`);
        setIsLoading(false);
      }
    };
    fetchCandidateAndInterview();
    // eslint-disable-next-line
  }, [applicationId, isEditing, originalVacancy]);

  // Helper to get min time for time input
  const getMinTime = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (date === todayStr) {
      const now = new Date();
      now.setSeconds(0, 0);
      now.setMinutes(now.getMinutes() + 1);
      return now.toTimeString().slice(0, 5);
    }
    return "00:00";
  };

  // Handle time change with validation
  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    if (date === new Date().toISOString().split('T')[0]) {
      const minTime = getMinTime();
      if (selectedTime < minTime) {
        setTimeWarning(`Please select a time after ${minTime}`);
        setTime('');
        return;
      } else {
        setTimeWarning('');
      }
    } else {
      setTimeWarning('');
    }
    setTime(selectedTime);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    if (!candidate || !candidate.user) {
      setError('Candidate data is missing. Please try again.');
      setIsSaving(false);
      return;
    }

    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    if (selectedDateTime < now) {
      setError('Cannot schedule an interview in the past. Please select a valid date and time.');
      setIsSaving(false);
      return;
    }

    try {
      const interviewData = {
        applicationId: applicationId,
        date: date,
        time: time,
        duration: duration,
        Interview_Instructions: interviewInstructions
      };
      let url, method;
      if (isEditing && interviewId) {
        interviewData.interviewId = interviewId;
        url = `http://localhost:5190/api/ManagerInterview/${interviewId}`;
        method = "PUT";
      } else {
        url = "http://localhost:5190/api/ManagerInterview";
        method = "POST";
      }
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(interviewData),
      });
      if (response.ok) {
        const successMessage = isEditing
          ? "Interview updated successfully!"
          : "Interview scheduled successfully and invitation sent!";
        navigateBackToLongList(successMessage);
      } else {
        let errorMessage = "Failed to process interview. Please try again.";
        try {
          const errorData = await response.json();
          if (errorData.message) errorMessage = errorData.message;
        } catch (e) {}
        setError(errorMessage);
        setIsSaving(false);
      }
    } catch (error) {
      setError(`An error occurred: ${error.message}`);
      setIsSaving(false);
    }
  };

  // Helper function to navigate back to the correct long-list page
  const navigateBackToLongList = (message = null) => {
    // Always use the vacancy param from the URL if present
    const paramsFromUrl = new URLSearchParams(location.search);
    const vacancyParam = paramsFromUrl.get('vacancy');
    let navUrl = '/manager/View_LongList';
    const params = new URLSearchParams();
    if (message) params.append('message', message);
    if (vacancyParam) {
      params.append('vacancy', vacancyParam);
      params.append('filter', 'true');
    } else if (originalVacancy) {
      params.append('vacancy', originalVacancy);
      params.append('filter', 'true');
    } else if (candidate && candidate.vacancyId) {
      params.append('vacancyId', candidate.vacancyId);
      params.append('filter', 'true');
    } else if (candidate && candidate.jobTitle) {
      params.append('vacancy', candidate.jobTitle);
      params.append('filter', 'true');
    }
    if (params.toString()) navUrl += '?' + params.toString();
    navigate(navUrl);
  };

  // Handle cancel button
  const handleCancel = () => {
    navigateBackToLongList();
  };

  if (isLoading) {
    return (
      <div className="bg-blue-50 flex-auto min-h-screen">
        <ManagerTopbar />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-center items-center mt-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 flex-auto min-h-screen">
      <ManagerTopbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">
          {isEditing ? "Edit Interview Schedule" : "Interview Scheduler"}
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-blue-600 flex flex-col py-4">
          <div className="flex items-center mb-6">
            <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <h2 className="text-xl font-bold text-gray-800">
              {isEditing ? "Edit Interview Schedule" : "Schedule Interview"}
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-1">Scheduling for:</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={candidate ? `${candidate.user.firstName} ${candidate.user.lastName} (${originalVacancy || candidate.jobTitle || 'Candidate'})` : "Loading..."}
                readOnly
              />
            </div>
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setTime(''); // Reset time when date changes
                  }}
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">Time</label>
                <input
                  type="time"
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={time}
                  min={getMinTime()}
                  onChange={handleTimeChange}
                  required
                />
                {timeWarning && (
                  <div className="text-red-500 text-xs mt-1">{timeWarning}</div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">Duration</label>
                <select
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
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
            </div>
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
            <div className="flex flex-col-reverse sm:flex-row justify-between pt-4 gap-3">
              <button
                type="button"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-center"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center flex items-center justify-center ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    {isEditing ? "Updating..." : "Scheduling..."}
                  </>
                ) : (
                  isEditing ? "Update Interview" : "Schedule Interview & Send Invite"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default InterviewScheduler;