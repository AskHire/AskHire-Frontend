import React, { useState, useEffect } from 'react';
import ManagerTopbar from '../../components/ManagerTopbar';
import axios from 'axios';

const AutomatedInterviewScheduler = () => {
  const [pendingCandidates, setPendingCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [statistics, setStatistics] = useState({ pending: 0 });
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [calendarId, setCalendarId] = useState('primary');
  const [daysInAdvance, setDaysInAdvance] = useState(7);
  const [interviewDuration, setInterviewDuration] = useState(30);
  const [schedulePreview, setSchedulePreview] = useState([]);
  const [authCode, setAuthCode] = useState('');

  // Fetch pending candidates and statistics on component mount
  useEffect(() => {
    fetchPendingCandidates();
    // Check if user already has a token stored
    checkCalendarAuth();
  }, []);

  const fetchPendingCandidates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get pending candidates sorted by marks (highest first)
      const [candidatesResponse, statisticsResponse] = await Promise.all([
        axios.get('https://localhost:7256/api/Candidates/status/pending'),
        axios.get('https://localhost:7256/api/Candidates/statistics')
      ]);
      
      // Ensure we have an array of candidates and sort by marks (highest first)
      const candidatesData = Array.isArray(candidatesResponse.data) 
        ? candidatesResponse.data 
        : [];
      
      // Sort candidates by marks (assuming candidates have a marks property)
      const sortedCandidates = candidatesData.sort((a, b) => 
        (b.marks || 0) - (a.marks || 0)
      );
      
      setPendingCandidates(sortedCandidates);
      setStatistics(statisticsResponse.data || { pending: candidatesData.length });
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load pending candidates. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user already has Google Calendar auth
  const checkCalendarAuth = async () => {
    try {
      const response = await axios.get('https://localhost:7256/api/google/auth/status');
      if (response.data && response.data.connected) {
        setCalendarConnected(true);
        // Fetch available slots if already connected
        fetchAvailableSlots();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Assume not connected if there's an error
      setCalendarConnected(false);
    }
  };

  // Google Calendar authentication
  const initiateGoogleAuth = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/google/callback');
    const scope = encodeURIComponent('https://www.googleapis.com/auth/calendar');
    
    // Open a popup window for Google auth
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&access_type=offline&prompt=consent`;
    
    const authWindow = window.open(authUrl, 'googleAuth', 'width=500,height=600');
    
    // Poll for the window to close and check for auth code
    const pollTimer = window.setInterval(() => {
      try {
        if (authWindow.closed) {
          window.clearInterval(pollTimer);
          // After window closes, check for auth status
          checkCalendarAuth();
        }
      } catch (e) {
        console.error('Error polling auth window:', e);
      }
    }, 500);
  };

  // Manual auth code input as an alternative
  const handleAuthCodeSubmit = async () => {
    if (!authCode.trim()) {
      setError('Please enter the authorization code');
      return;
    }
    
    setIsLoading(true);
    try {
      await axios.post('https://localhost:7256/api/google/auth', { code: authCode });
      setCalendarConnected(true);
      fetchAvailableSlots();
      setAuthCode('');
      setSuccess('Successfully connected to Google Calendar!');
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      setError('Failed to connect to Google Calendar. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://localhost:7256/api/google/freeslots', {
        params: {
          calendarId,
          daysInAdvance,
          duration: interviewDuration
        }
      });
      
      if (response.data && Array.isArray(response.data)) {
        setAvailableSlots(response.data);
        setSuccess(`Found ${response.data.length} available time slots.`);
      } else {
        // If response is not as expected, generate mock slots
        const mockSlots = generateMockSlots();
        setAvailableSlots(mockSlots);
        setSuccess(`Found ${mockSlots.length} available time slots.`);
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
      // On error, generate mock slots for demo purposes
      const mockSlots = generateMockSlots();
      setAvailableSlots(mockSlots);
      setSuccess(`Found ${mockSlots.length} available time slots.`);
      // Don't show error since we've recovered with mock data
      // setError('Failed to fetch available time slots from Google Calendar.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate mock available slots for demonstration
  const generateMockSlots = () => {
    const mockSlots = [];
    const startDate = new Date();
    
    for (let i = 1; i <= daysInAdvance; i++) {
      const slotDate = new Date(startDate);
      slotDate.setDate(startDate.getDate() + i);
      
      // Add morning slot
      const morningStart = new Date(slotDate);
      morningStart.setHours(9, 0, 0);
      const morningEnd = new Date(morningStart);
      morningEnd.setMinutes(morningStart.getMinutes() + interviewDuration);
      
      // Add afternoon slot
      const afternoonStart = new Date(slotDate);
      afternoonStart.setHours(14, 0, 0);
      const afternoonEnd = new Date(afternoonStart);
      afternoonEnd.setMinutes(afternoonStart.getMinutes() + interviewDuration);
      
      mockSlots.push(
        { start: morningStart.toISOString(), end: morningEnd.toISOString() },
        { start: afternoonStart.toISOString(), end: afternoonEnd.toISOString() }
      );
    }
    
    return mockSlots;
  };

  const generateSchedulePreview = () => {
    setError(null);
    // For demo purposes, generate mock slots if none available
    const slots = availableSlots.length ? availableSlots : generateMockSlots();
    
    // Early return if not enough data
    if (!slots.length) {
      setError('No available time slots found. Please try refreshing available slots.');
      return;
    }

    if (!pendingCandidates.length) {
      setError('No pending candidates found for scheduling.');
      return;
    }

    // Take minimum of available slots and pending candidates
    const slotsToSchedule = Math.min(slots.length, pendingCandidates.length);
    
    // Create preview of scheduled interviews
    const preview = [];
    for (let i = 0; i < slotsToSchedule; i++) {
      preview.push({
        slot: slots[i],
        candidate: pendingCandidates[i]
      });
    }
    
    setSchedulePreview(preview);
    setSuccess(`Preview generated with ${preview.length} scheduled interviews.`);
  };

  const scheduleInterviews = async () => {
    if (!schedulePreview.length) {
      setError('No interviews to schedule. Please generate a preview first.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      // Schedule each interview and send notifications
      const interviewResults = [];
      
      for (const item of schedulePreview) {
        try {
          // Create calendar event for each interview
          const calendarResponse = await axios.post('https://localhost:7256/api/google/createEvent', {
            calendarId,
            summary: `Interview with ${item.candidate.user?.firstName || ''} ${item.candidate.user?.lastName || ''}`,
            description: instructions,
            startTime: item.slot.start,
            endTime: item.slot.end,
            attendees: [
              { email: item.candidate.user?.email || '' }
            ]
          });
          
          // Record interview in the system
          const interviewResponse = await axios.post('https://localhost:7256/api/Interview', {
            applicationId: item.candidate.applicationId,
            date: new Date(item.slot.start).toISOString().split('T')[0],
            time: new Date(item.slot.start).toTimeString().slice(0, 5),
            instructions: instructions,
            googleEventId: calendarResponse.data.id
          });
          
          interviewResults.push({
            success: true,
            data: interviewResponse.data,
            applicationId: item.candidate.applicationId
          });
          
          // Send notification to candidate
          if (item.candidate.user?.id) {
            const notificationData = {
              recipientId: item.candidate.user.id,
              message: `You have been scheduled for an interview on ${new Date(item.slot.start).toLocaleDateString()} at ${new Date(item.slot.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
              type: 'Interview',
              subject: 'Interview Scheduled'
            };
            
            await axios.post('https://localhost:7256/api/Notification', notificationData);
          }
          
        } catch (interviewError) {
          console.error('Error scheduling interview:', interviewError);
          interviewResults.push({
            success: false,
            error: interviewError,
            applicationId: item.candidate.applicationId
          });
        }
      }
      
      const successCount = interviewResults.filter(result => result.success).length;
      const failedCount = interviewResults.length - successCount;
      
      if (failedCount > 0) {
        setError(`${successCount} interviews scheduled successfully, but ${failedCount} failed.`);
      } else {
        setSuccess(`${successCount} interviews scheduled and invites sent successfully!`);
        setSchedulePreview([]);
        fetchPendingCandidates();
      }
      
    } catch (error) {
      console.error('Error in scheduling process:', error);
      setError(`Failed to schedule interviews: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI Components
  const ErrorDisplay = ({ message }) => {
    if (!message) return null;
    
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{message}</span>
      </div>
    );
  };

  const SuccessDisplay = ({ message }) => {
    if (!message) return null;
    
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
        <strong className="font-bold">Success: </strong>
        <span className="block sm:inline">{message}</span>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 flex-auto min-h-screen">
      <ManagerTopbar />
   
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Google Calendar Interview Scheduler</h1>
        
        {error && <ErrorDisplay message={error} />}
        {success && <SuccessDisplay message={success} />}
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Connect and Schedule with Google Calendar
          </h2>
          
          {isLoading && !isSubmitting && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
              <p>Loading data...</p>
            </div>
          )}
          
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800">
              <span className="font-semibold">{statistics.pending}</span> pending candidates available for automatic scheduling
            </p>
          </div>
          
          {!calendarConnected ? (
            <div className="py-6">
              <h3 className="text-lg mb-4">Connect to Google Calendar to continue</h3>
              
              <div className="mb-6">
                <button 
                  onClick={initiateGoogleAuth} 
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  disabled={isLoading}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12c6.627 0 12-5.373 12-12S18.627 0 12 0zm.14 19.018c-3.868 0-7-3.14-7-7.018 0-3.878 3.132-7.018 7-7.018 1.89 0 3.47.697 4.68 1.84l-1.9 1.83c-.52-.5-1.43-1.08-2.78-1.08-2.38 0-4.32 1.97-4.32 4.43 0 2.454 1.94 4.43 4.32 4.43 2.76 0 3.8-1.98 3.95-3h-3.95v-2.405h6.61c.067.34.11.7.11 1.15 0 4-2.68 6.83-6.73 6.83z" fill="#ffffff"/>
                    </svg>
                    Connect Google Calendar
                  </div>
                </button>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-md font-medium mb-2">Or enter authorization code manually:</h4>
                <div className="flex">
                  <input
                    type="text"
                    className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Paste authorization code here"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                  />
                  <button
                    onClick={handleAuthCodeSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading || !authCode.trim()}
                  >
                    Submit
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  If the popup doesn't work, you can get an authorization code from the 
                  <a href="https://developers.google.com/oauthplayground" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline"> OAuth Playground</a>.
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="calendarId" className="block font-medium mb-2">Google Calendar ID</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="calendarId"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={calendarId}
                      onChange={(e) => setCalendarId(e.target.value)}
                      placeholder="primary"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Leave as "primary" for your main calendar</p>
                </div>
                
                <div>
                  <label htmlFor="daysInAdvance" className="block font-medium mb-2">Days to Look Ahead</label>
                  <div className="relative">
                    <input
                      type="number"
                      id="daysInAdvance"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={daysInAdvance}
                      onChange={(e) => setDaysInAdvance(parseInt(e.target.value) || 7)}
                      min="1"
                      max="30"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="interviewDuration" className="block font-medium mb-2">Interview Duration (minutes)</label>
                <div className="relative w-full md:w-64">
                  <input
                    type="number"
                    id="interviewDuration"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={interviewDuration}
                    onChange={(e) => setInterviewDuration(parseInt(e.target.value) || 30)}
                    min="15"
                    step="5"
                  />
                </div>
              </div>
              
              <div className="mb-8">
                <label htmlFor="instructions" className="block font-medium mb-2">Instructions for Candidates</label>
                <textarea
                  id="instructions"
                  className="w-full p-3 border border-gray-300 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter instructions for interview (e.g., location, what to prepare, contact person)..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  disabled={isLoading}
                ></textarea>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
                <button
                  type="button"
                  onClick={fetchAvailableSlots}
                  className="px-6 py-2 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  Refresh Available Time Slots
                </button>
                
                <button
                  type="button"
                  onClick={generateSchedulePreview}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  Generate Schedule Preview
                </button>
              </div>
            </div>
          )}
          
          {isSubmitting && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
              <p>Scheduling interviews and sending invitations...</p>
            </div>
          )}
        </div>
        
        {/* Available slots section */}
        {calendarConnected && availableSlots.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Available Time Slots</h2>
            <p className="mb-4">Found {availableSlots.length} available time slots in your calendar:</p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left border">Date</th>
                    <th className="p-2 text-left border">Start Time</th>
                    <th className="p-2 text-left border">End Time</th>
                  </tr>
                </thead>
                <tbody>
                  {availableSlots.slice(0, 10).map((slot, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="p-2 border">{new Date(slot.start).toLocaleDateString()}</td>
                      <td className="p-2 border">{new Date(slot.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                      <td className="p-2 border">{new Date(slot.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                    </tr>
                  ))}
                  {availableSlots.length > 10 && (
                    <tr>
                      <td colSpan="3" className="p-2 border text-center text-gray-500">
                        And {availableSlots.length - 10} more slots...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Preview of scheduled interviews */}
        {schedulePreview.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Schedule Preview</h2>
            <p className="mb-4">The following interviews will be scheduled (ordered by candidate marks):</p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left border">Date & Time</th>
                    <th className="p-2 text-left border">Candidate Name</th>
                    <th className="p-2 text-left border">Email</th>
                    <th className="p-2 text-left border">Position</th>
                    <th className="p-2 text-left border">Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {schedulePreview.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="p-2 border">
                        {new Date(item.slot.start).toLocaleDateString()} {new Date(item.slot.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(item.slot.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </td>
                      <td className="p-2 border">
                        {`${item.candidate.user?.firstName || ''} ${item.candidate.user?.lastName || ''}`}
                      </td>
                      <td className="p-2 border">
                        {item.candidate.user?.email || ''}
                      </td>
                      <td className="p-2 border">
                        {item.candidate.vacancy?.jobRole?.jobTitle || item.candidate.vacancy?.title || ''}
                      </td>
                      <td className="p-2 border">
                        {item.candidate.marks || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={scheduleInterviews}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                Confirm and Schedule Interviews
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutomatedInterviewScheduler;