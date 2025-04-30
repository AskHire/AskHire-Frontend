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
  const [duration, setDuration] = useState('01:00:00'); // Added duration state with default 1 hour
  const [interviewInstructions, setInterviewInstructions] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [interviewId, setInterviewId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Check if we're editing an existing interview
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editMode = params.get('edit') === 'true';
    setIsEditing(editMode);
  }, [location.search]);

  // Fetch candidate details and any existing interview data
  useEffect(() => {
    const fetchCandidateAndInterview = async () => {
      try {
        setIsLoading(true);
        // Add cache busting parameter to prevent caching
        const timestamp = new Date().getTime();
        const response = await fetch(`http://localhost:5190/api/ManagerCandidates/${applicationId}?_=${timestamp}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch candidate: ${response.status}`);
        }
        
        const data = await response.json();

        if (data && data.user) {
          setCandidate(data);
          
          // Now fetch interview directly to ensure we have the latest data
          if (isEditing) {
            try {
              const interviewResponse = await fetch(`http://localhost:5190/api/ManagerInterview/application/${applicationId}?_=${timestamp}`);
              if (interviewResponse.ok) {
                const interviewData = await interviewResponse.json();
                console.log("Fetched interview data:", interviewData);
                
                if (interviewData) {
                  setInterviewId(interviewData.interviewId);
                  
                  // Format date from API (assuming format is ISO or similar)
                  if (interviewData.date) {
                    const interviewDate = new Date(interviewData.date);
                    setDate(interviewDate.toISOString().split('T')[0]);
                  }
                  
                  // Set time if available
                  if (interviewData.time) {
                    setTime(interviewData.time);
                  }
                  
                  // Set duration if available (if not in the current model, will be ignored)
                  if (interviewData.duration) {
                    setDuration(interviewData.duration);
                  }
                  
                  // Set instructions if available - using the property name from API
                  if (interviewData.instructions) {
                    setInterviewInstructions(interviewData.instructions);
                  } else if (interviewData.interview_Instructions) {
                    // Fallback for backward compatibility
                    setInterviewInstructions(interviewData.interview_Instructions);
                  }
                }
              } else {
                console.log("No interview found or error fetching interview");
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
        console.error('Error fetching candidate data:', error);
        setError(`Error loading data: ${error.message}`);
        setIsLoading(false);
      }
    };

    fetchCandidateAndInterview();
  }, [applicationId, isEditing]);

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

    try {
      // Create the interview data object
      const interviewData = {
        applicationId: applicationId,
        date: date,
        time: time,
        duration: duration, // Added duration field in time format (HH:MM:SS)
        instructions: interviewInstructions // Based on the API documentation, this should be "instructions"
      };
      
      let url, method;
      
      // If editing and we have an interview ID, use PUT to update existing record
      if (isEditing && interviewId) {
        interviewData.interviewId = interviewId;
        url = `http://localhost:5190/api/ManagerInterview/${interviewId}`;
        method = "PUT";
        console.log("Updating interview with ID:", interviewId);
      } else {
        // For new interview, use POST
        url = "http://localhost:5190/api/ManagerInterview";
        method = "POST";
        console.log("Creating new interview");
      }
      
      console.log("Sending request:", method, url);
      console.log("Request data:", interviewData);
      
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(interviewData),
      });

      console.log("Response status:", response.status);
      
      if (response.ok) {
        const successMessage = isEditing 
          ? "Interview updated successfully!" 
          : "Interview scheduled successfully and invitation sent!";
          
        // Navigate back with success message
        const encodedMessage = encodeURIComponent(successMessage);
        navigate(`/manager/View_LongList?message=${encodedMessage}`);
      } else {
        let errorMessage = "Failed to process interview. Please try again.";
        try {
          const errorData = await response.json();
          console.error("Error data:", errorData);
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // Ignore JSON parsing error
        }
        setError(errorMessage);
        setIsSaving(false);
      }
    } catch (error) {
      console.error('Error handling interview:', error);
      setError(`An error occurred: ${error.message}`);
      setIsSaving(false);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    navigate('/manager/View_LongList');
  };

  if (isLoading) {
    return (
      <div className="bg-gray-100 flex-auto min-h-screen">
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
    <div className="bg-gray-100 flex-auto min-h-screen">
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
            <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <h2 className="text-xl font-bold text-gray-800">
              {isEditing ? "Edit Interview Schedule" : "Schedule Interview"}
            </h2>
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
              
              {/* Duration field (new) */}
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

            {/* Instructions field - updated label for clarity */}
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

            {/* Button container */}
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