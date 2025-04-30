import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ManagerTopbar from '../../components/ManagerTopbar';

const NotifyCandidates = () => {
  const [selectedTab, setSelectedTab] = useState('qualified');
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [candidatesByStatus, setCandidatesByStatus] = useState({ qualified: [], rejected: [], pending: [] });
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('Normal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preScreenDetails, setPreScreenDetails] = useState({});
  
  // Define CV qualification threshold
  const CV_QUALIFICATION_THRESHOLD = 70; // Minimum CV mark to be qualified
  
  // Function to determine candidate status based on marks and vacancy threshold
  const determineStatus = (candidate) => {
    const cvMark = candidate.cV_Mark || 0;
    // Use the Pre_Screen_PassMark directly from the application
    const preScreenMark = candidate.pre_Screen_PassMark || 0;
    const requiredCvMark = candidate.vacancy?.cVPassMark || CV_QUALIFICATION_THRESHOLD;
    const requiredPreScreenMark = candidate.vacancy?.preScreenPassMark || 0;
    
    // Check if the candidate meets both thresholds for qualification
    if (cvMark >= requiredCvMark && (preScreenMark >= requiredPreScreenMark || requiredPreScreenMark === 0)) {
      return 'qualified';
    } 
    // Check if the candidate has been evaluated (has marks) but doesn't meet thresholds
    else if (cvMark > 0 || preScreenMark > 0) {
      return 'rejected';
    } 
    // If the candidate hasn't been fully evaluated yet
    else {
      return 'pending';
    }
  };

  // Function to update candidate status in the backend
  const updateCandidateStatus = async (applicationId, newStatus) => {
    try {
      await axios.get(`http://localhost:5190/api/Candidates/status/${newStatus}`, {
        params: { applicationId }
      });
      console.log(`Updated candidate ${applicationId} status to ${newStatus}`);
      return true;
    } catch (error) {
      console.error(`Failed to update candidate ${applicationId} status:`, error);
      return false;
    }
  };

  // Function to fetch prescreening test details for a candidate
  const fetchPreScreeningDetails = async (applicationId) => {
    try {
      const response = await axios.get(`http://localhost:5190/api/PreScreenTest/${applicationId}`);
      if (response.data) {
        // Store the prescreen details in our state map with applicationId as key
        setPreScreenDetails(prev => ({
          ...prev,
          [applicationId]: response.data
        }));
        // Return the actual mark from the response
        return response.data.mark || 0;
      }
      return 0;
    } catch (error) {
      console.error(`Failed to fetch prescreening details for candidate ${applicationId}:`, error);
      return 0;
    }
  };

  // Fetch candidates and categorize them
  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // First, fetch all candidates
      const response = await axios.get('http://localhost:5190/api/Candidates');
      let allCandidates = response.data || [];
      
      // For each candidate, fetch their prescreening details
      const candidatesWithMarks = allCandidates.map(candidate => {
        // No need to fetch prescreening details separately, use the data from application
        return {
          ...candidate,
          // Ensure we use the correct property name as per the Application entity
          pre_Screen_PassMark: candidate.pre_Screen_PassMark || 0
        };
      });
      
      // Categorize candidates based on CV and prescreening marks
      const categorizedCandidates = {
        qualified: [],
        rejected: [],
        pending: []
      };
      
      // Process each candidate
      for (const candidate of candidatesWithMarks) {
        const status = determineStatus(candidate);
        
        // Use the existing status if available, or fall back to calculated status
        const currentStatus = candidate.status || status;
        
        // Add to appropriate category based on current status
        if (categorizedCandidates[currentStatus]) {
          categorizedCandidates[currentStatus].push(candidate);
        } else {
          // If status is something unexpected, use the calculated status instead
          categorizedCandidates[status].push(candidate);
        }
      }
      
      setCandidatesByStatus(categorizedCandidates);
      console.log('Categorized candidates:', categorizedCandidates);
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
      setError('Failed to fetch candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch candidate statistics
  const fetchCandidateStatistics = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5190/api/Candidates/statistics');
      console.log('Candidate statistics:', response.data);
      // You can use the statistics data if needed
    } catch (error) {
      console.error('Failed to fetch candidate statistics:', error);
    }
  }, []);

  // Separate function to handle status updates after categorization
  const updateCandidateStatuses = useCallback(async () => {
    try {
      // Process each category
      for (const status in candidatesByStatus) {
        for (const candidate of candidatesByStatus[status]) {
          const calculatedStatus = determineStatus(candidate);
          
          // Only update if current status differs from calculated status
          if (candidate.status !== calculatedStatus) {
            await updateCandidateStatus(candidate.applicationId, calculatedStatus);
          }
        }
      }
      // Refresh candidates after updates
      fetchCandidates();
      // Also refresh statistics
      fetchCandidateStatistics();
    } catch (error) {
      console.error('Failed to update candidate statuses:', error);
    }
  }, [candidatesByStatus, fetchCandidates, fetchCandidateStatistics]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchCandidates();
    fetchCandidateStatistics();
  }, [fetchCandidates, fetchCandidateStatistics]);

  // Set up auto-refresh polling (every 30 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Auto-refreshing candidate data...');
      fetchCandidates();
    }, 30000); // 30 seconds

    // Clean up on component unmount
    return () => clearInterval(intervalId);
  }, [fetchCandidates]);

  const handleCandidateSelect = (applicationId) => {
    setSelectedCandidates(prev =>
      prev.includes(applicationId) ? prev.filter(id => id !== applicationId) : [...prev, applicationId]
    );
  };

  const handleNotify = async () => {
    if (!subject || !message || selectedCandidates.length === 0) {
      alert('Please fill all fields and select at least one candidate.');
      return;
    }

    try {
      setLoading(true);
      
      // Create notification with proper format for the API
      const notificationData = {
        subject,
        message,
        type,
        time: new Date().toISOString(),
        candidateIds: selectedCandidates // Include the candidateIds directly in the notification object
      };

      console.log('Sending notification with data:', notificationData);
      
      // Send the notification with the proper structure
      const response = await axios.post('http://localhost:5190/api/Notification', notificationData);
      
      console.log('Notification created successfully:', response.data);
      
      alert('Notification sent successfully!');

      // Reset form
      setSubject('');
      setMessage('');
      setSelectedCandidates([]);
      
      // Refresh candidates after successful notification
      fetchCandidates();
    } catch (error) {
      console.error('Notification error:', error);
      alert(`Failed to send notification: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Calculate counts from the actual data we have
  const counts = {
    qualified: Array.isArray(candidatesByStatus.qualified) ? candidatesByStatus.qualified.length : 0,
    rejected: Array.isArray(candidatesByStatus.rejected) ? candidatesByStatus.rejected.length : 0,
    pending: Array.isArray(candidatesByStatus.pending) ? candidatesByStatus.pending.length : 0
  };

  const tabs = [
    { id: 'qualified', label: 'Qualified', icon: '✓', count: counts.qualified },
    { id: 'rejected', label: 'Rejected', icon: '✕', count: counts.rejected },
    { id: 'pending', label: 'Pending', icon: '⌛', count: counts.pending }
  ];

  const candidates = candidatesByStatus[selectedTab] || [];

  // Add a manual refresh button and loading indicator
  const handleManualRefresh = () => {
    fetchCandidates();
    fetchCandidateStatistics();
  };

  // Add a function to manually update all candidate statuses
  const handleUpdateStatuses = () => {
    updateCandidateStatuses();
  };

  // Function to show pre-screening details in a modal or expanded view
  const [expandedCandidate, setExpandedCandidate] = useState(null);

  const toggleCandidateDetails = (applicationId) => {
    if (expandedCandidate === applicationId) {
      setExpandedCandidate(null);
    } else {
      setExpandedCandidate(applicationId);
    }
  };

  return (
    <div className="bg-gray-100 flex-auto min-h-screen">
      <ManagerTopbar />
      <div className="bg-blue-50 min-h-screen p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Notify Candidates</h1>
            <div className="flex space-x-2">
              <button 
                onClick={handleUpdateStatuses}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Update Statuses
              </button>
              <button 
                onClick={handleManualRefresh}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <svg className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="bg-white border border-blue-200 rounded-lg shadow-sm p-5 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-gray-700">Select candidates to send notifications</div>
              <div className="text-gray-500 text-sm">{selectedCandidates.length} selected</div>
            </div>

            {/* Tabs */}
            <div className="bg-gray-100 rounded-full p-1 flex mb-5 gap-x-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`flex items-center justify-center space-x-1 flex-1 py-2 px-3 rounded-full text-sm font-medium transition ${
                    selectedTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedTab(tab.id)}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label} ({tab.count})</span>
                </button>
              ))}
            </div>

            {/* Candidate List */}
            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                </div>
              ) : candidates.length === 0 ? (
                <p className="text-center py-4 text-gray-500">No candidates found</p>
              ) : (
                candidates.map(candidate => {
                  // Get prescreening mark directly from the application data
                  const preScreenMark = candidate.pre_Screen_PassMark || 0;
                  
                  return (
                    <div key={candidate.applicationId} className="border border-gray-200 rounded-lg hover:border-blue-300 transition">
                      <div
                        className="p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            className="h-5 w-5 text-blue-600 rounded border-gray-300"
                            checked={selectedCandidates.includes(candidate.applicationId)}
                            onChange={() => handleCandidateSelect(candidate.applicationId)}
                          />
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {candidate.user?.firstName} {candidate.user?.lastName}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              {candidate.vacancy?.vacancyName || candidate.vacancy?.jobRole?.jobTitle || 'No position'}
                            </p>
                            <div className="flex space-x-4 mt-1">
                              <span className="text-xs text-gray-500">
                                CV Score: <span className={`font-medium ${candidate.cV_Mark >= (candidate.vacancy?.cVPassMark || CV_QUALIFICATION_THRESHOLD) ? 'text-green-600' : 'text-red-600'}`}>
                                  {candidate.cV_Mark || 0}% / {candidate.vacancy?.cVPassMark || CV_QUALIFICATION_THRESHOLD}%
                                </span>
                              </span>
                              <span className="text-xs text-gray-500">
                                Prescreening: <span className={`font-medium ${preScreenMark >= (candidate.vacancy?.preScreenPassMark || 0) ? 'text-green-600' : 'text-red-600'}`}>
                                  {preScreenMark}% / {candidate.vacancy?.preScreenPassMark || 0}%
                                </span>
                              </span>
                              <button 
                                onClick={() => toggleCandidateDetails(candidate.applicationId)}
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                {expandedCandidate === candidate.applicationId ? 'Hide Details' : 'Show Details'}
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedTab === 'qualified' ? 'bg-green-100 text-green-800' :
                          selectedTab === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedTab === 'qualified' ? 'Qualified' :
                           selectedTab === 'rejected' ? 'Rejected' : 'Pending'}
                        </div>
                      </div>
                      
                      {/* Expanded Candidate Details (without test questions) */}
                      {expandedCandidate === candidate.applicationId && (
                        <div className="border-t border-gray-100 p-4 bg-gray-50">
                          <h4 className="font-medium text-gray-700 mb-2">Candidate Details</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Vacancy:</p>
                              <p className="font-medium">{candidate.vacancy?.vacancyName || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Status:</p>
                              <p className="font-medium">{candidate.status || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Email:</p>
                              <p className="font-medium">{candidate.user?.email || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Application Date:</p>
                              <p className="font-medium">{new Date(candidate.applicationDate || Date.now()).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">CV Score:</p>
                              <p className="font-medium">
                                <span className={candidate.cV_Mark >= (candidate.vacancy?.cVPassMark || CV_QUALIFICATION_THRESHOLD) ? 'text-green-600' : 'text-red-600'}>
                                  {candidate.cV_Mark || 0}%
                                </span>
                                {' '}/{' '}
                                {candidate.vacancy?.cVPassMark || CV_QUALIFICATION_THRESHOLD}% required
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Pre-screening Score:</p>
                              <p className="font-medium">
                                <span className={preScreenMark >= (candidate.vacancy?.preScreenPassMark || 0) ? 'text-green-600' : 'text-red-600'}>
                                  {preScreenMark}%
                                </span>
                                {' '}/{' '}
                                {candidate.vacancy?.preScreenPassMark || 0}% required
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Notification Form */}
          <div className="bg-white border border-blue-200 rounded-lg shadow-sm p-5">
            <div className="mb-4">
              <label htmlFor="subject" className="block mb-2 font-medium text-gray-700">Subject</label>
              <input
                type="text"
                id="subject"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter notification subject"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="message" className="block mb-2 font-medium text-gray-700">Message</label>
              <textarea
                id="message"
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message to the selected candidates"
              ></textarea>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium text-gray-700">Type</label>
              <div className="flex space-x-6">
                {['Normal', 'Important'].map(t => (
                  <div key={t} className="flex items-center">
                    <input
                      id={t}
                      name="notification-type"
                      type="radio"
                      value={t}
                      checked={type === t}
                      onChange={(e) => setType(e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor={t} className="ml-2 text-gray-700">{t}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNotify}
                disabled={selectedCandidates.length === 0 || !subject || !message || loading}
                className={`${
                  selectedCandidates.length > 0 && subject && message && !loading
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-300 cursor-not-allowed'
                } text-white py-2 px-6 rounded-full font-medium`}
              >
                {loading ? 'Processing...' : `Notify ${selectedCandidates.length} Candidate${selectedCandidates.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotifyCandidates;