import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import ManagerTopbar from '../../components/ManagerTopbar';

const LongListInterviewScheduler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get vacancy information from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const vacancyName = searchParams.get('vacancy') || '';
  
  // State for form inputs
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [interviewDuration, setInterviewDuration] = useState('00:30'); // Default 30 minutes
  const [interviewInstructions, setInterviewInstructions] = useState('');
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [numInterviews, setNumInterviews] = useState(0);

  // Handle duration input changes - enforce HH:MM format without AM/PM
  const handleDurationChange = (e) => {
    let value = e.target.value;
    
    // Only allow digits and colon
    value = value.replace(/[^0-9:]/g, '');
    
    // Format as HH:MM
    if (value.length > 0) {
      const parts = value.split(':');
      if (parts.length === 1) {
        // If user entered only hours
        if (parts[0].length > 2) {
          parts[0] = parts[0].substring(0, 2);
        }
        value = parts[0] + (parts[0].length === 2 ? ':' : '');
      } else if (parts.length === 2) {
        // Format hours
        if (parts[0].length > 2) {
          parts[0] = parts[0].substring(0, 2);
        }
        
        // Format minutes
        if (parts[1].length > 2) {
          parts[1] = parts[1].substring(0, 2);
        }
        
        value = parts[0] + ':' + parts[1];
      }
    }
    
    setInterviewDuration(value);
  };

  // Calculate number of possible interviews when inputs change
  useEffect(() => {
    if (startTime && endTime && interviewDuration) {
      try {
        // Parse times to minutes
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        
        // Parse duration (handle special format)
        let durationHour = 0;
        let durationMinute = 0;
        
        const durationParts = interviewDuration.split(':');
        if (durationParts.length === 2) {
          durationHour = parseInt(durationParts[0]) || 0;
          durationMinute = parseInt(durationParts[1]) || 0;
        } else if (durationParts.length === 1 && durationParts[0]) {
          durationHour = parseInt(durationParts[0]) || 0;
        }
        
        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;
        const durationMinutes = durationHour * 60 + durationMinute;
        
        // Calculate number of interviews
        if (durationMinutes > 0) {
          const totalMinutes = endMinutes - startMinutes;
          const possibleInterviews = Math.floor(totalMinutes / durationMinutes);
          setNumInterviews(possibleInterviews > 0 ? possibleInterviews : 0);
        }
      } catch (error) {
        console.error('Error calculating interviews:', error);
        setNumInterviews(0);
      }
    } else {
      setNumInterviews(0);
    }
  }, [startTime, endTime, interviewDuration]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    // Validate inputs
    if (!date || !startTime || !endTime || !interviewDuration || !interviewInstructions) {
      setError('Please fill in all fields');
      setIsSaving(false);
      return;
    }
    
    // Validate duration format
    const durationParts = interviewDuration.split(':');
    if (durationParts.length !== 2 || !durationParts[0] || !durationParts[1]) {
      setError('Please enter duration in HH:MM format (e.g., 00:30 for 30 minutes)');
      setIsSaving(false);
      return;
    }
    
    try {
      // Create the interview data object
      const scheduleData = {
        vacancy: vacancyName, // Include vacancy name
        date: date,
        startTime: startTime,
        endTime: endTime,
        interviewDuration: interviewDuration,
        interviewInstructions: interviewInstructions
      };
      
      console.log("Sending request to schedule long-list interviews");
      console.log("Request data:", scheduleData);
      
      // This would be your API endpoint for scheduling multiple interviews
      const response = await fetch("http://localhost:5190/api/LongListInterviewScheduler/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scheduleData),
      });
      
      console.log("Response status:", response.status);
      
      if (response.ok) {
        const successMessage = `Interviews scheduled successfully for ${vacancyName} and invitations sent!`;
        
        // Navigate back with success message
        const encodedMessage = encodeURIComponent(successMessage);
        navigate(`/manager/View_LongList?message=${encodedMessage}&vacancy=${encodeURIComponent(vacancyName)}`);
      } else {
        let errorMessage = "Failed to schedule interviews. Please try again.";
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
      console.error('Error scheduling interviews:', error);
      setError(`An error occurred: ${error.message}`);
      setIsSaving(false);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    // Navigate back to long list with the same vacancy
    if (vacancyName) {
      navigate(`/manager/View_LongList?vacancy=${encodeURIComponent(vacancyName)}`);
    } else {
      navigate('/manager/View_LongList');
    }
  };

  return (
    <div className="bg-gray-100 flex-auto min-h-screen">
      <ManagerTopbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">Long-List Interviews Scheduler</h2>
        
        {/* Show vacancy name if available */}
        {vacancyName && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
            <strong>Scheduling interviews for vacancy: </strong> {vacancyName}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Success:</strong>
            <span className="block sm:inline"> {success}</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-blue-600 flex flex-col py-4">
          <div className="flex items-center mb-6">
            <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <h2 className="text-xl font-bold text-gray-800">Schedule Long-List Interviews</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Date field */}
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

            {/* Time fields in a flex container */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              {/* Start Time field */}
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

              {/* End Time field */}
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

            {/* Interview Duration - Custom input for HH:MM format without AM/PM */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Time Duration for One Interview (HH:MM)
              </label>
              <input
                type="text"
                pattern="[0-9]{1,2}:[0-9]{2}"
                placeholder="00:30"
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={interviewDuration}
                onChange={handleDurationChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter duration in hours:minutes format (e.g., 00:30 for 30 minutes, 01:00 for 1 hour)
              </p>
            </div>

            {/* Display number of possible interviews in a text box */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Quantity of Possible Interviews
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-blue-200 rounded-lg bg-gray-50 focus:outline-none"
                value={numInterviews.toString()}
                readOnly
              />
            </div>

            {/* Instructions field */}
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
                    Scheduling...
                  </>
                ) : (
                  "Schedule Interviews & Send Invites"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LongListInterviewScheduler;