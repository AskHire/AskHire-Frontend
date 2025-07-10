import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ManagerTopbar from '../../components/ManagerTopbar';

const NotifyCandidates = () => {
  const [selectedTab, setSelectedTab] = useState('Longlist'); // Default tab is Longlist
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [candidatesByStatus, setCandidatesByStatus] = useState({ Longlist: [], Rejected: [], Pending: [] });
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('Normal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCandidate, setExpandedCandidate] = useState(null);
  const [statistics, setStatistics] = useState({ Longlist: 0, Rejected: 0, Pending: 0, Total: 0 });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // Define CV qualification threshold
  const CV_QUALIFICATION_THRESHOLD = 70; // Minimum CV mark to be qualified
  
  // Fetch statistics from the API
  const fetchStatistics = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5190/api/ManagerCandidates/statistics');
      console.log('Statistics data:', response.data);
      
      // Convert API response keys to match our frontend naming convention
      setStatistics({
        Longlist: response.data.longlist || 0,
        Rejected: response.data.rejected || 0,
        Pending: response.data.pending || 0,
        Total: response.data.total || 0
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      return { longlist: 0, rejected: 0, pending: 0, total: 0 };
    }
  }, []);

  // Fetch candidates by status using the API endpoint
  const fetchCandidatesByStatus = useCallback(async (status) => {
    try {
      const normalizedStatus = status.toLowerCase();
      const response = await axios.get(`http://localhost:5190/api/ManagerCandidates/status/${normalizedStatus}`);
      console.log(`Fetched ${status} candidates:`, response.data);
      return response.data || [];
    } catch (error) {
      console.error(`Failed to fetch candidates with status ${status}:`, error);
      return [];
    }
  }, []);

  // Fetch all candidates and categorize them by status
  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // First fetch statistics to get the counts
      await fetchStatistics();
      
      // Use the backend API to fetch candidates by status
      const longlistCandidates = await fetchCandidatesByStatus('longlist');
      const rejectedCandidates = await fetchCandidatesByStatus('rejected');
      const pendingCandidates = await fetchCandidatesByStatus('pending');
      
      // Set the categorized candidates
      setCandidatesByStatus({
        Longlist: longlistCandidates,
        Rejected: rejectedCandidates,
        Pending: pendingCandidates
      });
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
      setError('Failed to fetch candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [fetchCandidatesByStatus, fetchStatistics]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

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
  
  // Handle select all candidates in current tab
  const handleSelectAll = () => {
    const currentTabCandidates = candidatesByStatus[selectedTab] || [];
    
    // If all candidates are already selected, unselect all
    const allSelected = currentTabCandidates.every(candidate => 
      selectedCandidates.includes(candidate.applicationId)
    );
    
    if (allSelected) {
      // Remove all current tab candidates from selection
      setSelectedCandidates(prev => 
        prev.filter(id => !currentTabCandidates.some(c => c.applicationId === id))
      );
    } else {
      // Add all current tab candidates to selection
      const newSelectedIds = currentTabCandidates
        .map(candidate => candidate.applicationId)
        .filter(id => !selectedCandidates.includes(id));
      
      setSelectedCandidates(prev => [...prev, ...newSelectedIds]);
    }
  };

  const handleNotify = async () => {
    if (!subject || !message || selectedCandidates.length === 0) {
      setNotification({
        show: true,
        message: 'Please fill all fields and select at least one candidate.',
        type: 'error'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
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
        candidateIds: selectedCandidates,
        status: 'Manager' // Ensure status is set to Manager for DB
      };

      console.log('Sending notification with data:', notificationData);
      
      // Send the notification with the proper structure
      const response = await axios.post('http://localhost:5190/api/ManagerNotification', notificationData);
      
      console.log('Notification created successfully:', response.data);
      
      // Show success message in the page
      setNotification({
        show: true,
        message: 'Notification sent successfully!',
        type: 'success'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);

      // Reset form
      setSubject('');
      setMessage('');
      setSelectedCandidates([]);
      
      // Refresh candidates after successful notification
      fetchCandidates();
    } catch (error) {
      console.error('Notification error:', error);
      setNotification({
        show: true,
        message: `Failed to send notification: ${error.response?.data?.message || error.message}`,
        type: 'error'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'Longlist', label: 'Qualified', icon: '✓', count: statistics.Longlist },
    { id: 'Rejected', label: 'Rejected', icon: '✕', count: statistics.Rejected },
    { id: 'Pending', label: 'Pending', icon: '⌛', count: statistics.Pending }
  ];

  const candidates = candidatesByStatus[selectedTab] || [];

  // No more manual refresh button

  // Toggle candidate details view
  const toggleCandidateDetails = (applicationId) => {
    setExpandedCandidate(expandedCandidate === applicationId ? null : applicationId);
  };

  return (
    <div className="bg-gray-100 flex-auto min-h-screen">
      <ManagerTopbar />
      <div className="bg-blue-50 min-h-screen p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Notify Candidates</h1>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {/* In-page notification */}
          {notification.show && (
            <div className={`${
              notification.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 
              'bg-red-100 border-red-400 text-red-700'
            } border px-4 py-3 rounded mb-4 flex justify-between items-center`}>
              <span>{notification.message}</span>
              <button onClick={() => setNotification({ show: false, message: '', type: '' })} className="text-gray-500 hover:text-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          )}

          <div className="bg-white border border-blue-200 rounded-lg shadow-sm p-5 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-gray-700">Select candidates to send notifications</div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSelectAll}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {candidatesByStatus[selectedTab]?.every(c => 
                    selectedCandidates.includes(c.applicationId)
                  ) ? 'Unselect All' : 'Select All'}
                </button>
                <div className="text-gray-500 text-sm">{selectedCandidates.length} selected</div>
              </div>
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
                  // Get CV mark - handle different property names
                  const cvMark = candidate.cvMark || candidate.cV_Mark || 0;
                  // Get prescreening mark
                  const preScreenMark = candidate.pre_Screen_PassMark || candidate.preScreenPassMark || 0;
                  // Get threshold values
                  const cvThreshold = candidate.vacancy?.cVPassMark || CV_QUALIFICATION_THRESHOLD;
                  const preScreenThreshold = candidate.vacancy?.preScreenPassMark || 0;
                  
                  // Get user information with fallbacks
                  const firstName = candidate.user?.firstName || 'Unknown';
                  const lastName = candidate.user?.lastName || '';
                  const fullName = `${firstName} ${lastName}`.trim();
                  
                  // Get vacancy name with fallbacks
                  const vacancyName = 
                    candidate.vacancy?.vacancyName || 
                    candidate.vacancy?.jobRole?.jobTitle || 
                    'No position';
                  
                  return (
                    <div key={candidate.applicationId} className="border border-gray-200 rounded-lg hover:border-blue-300 transition">
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            className="h-5 w-5 text-blue-600 rounded border-gray-300"
                            checked={selectedCandidates.includes(candidate.applicationId)}
                            onChange={() => handleCandidateSelect(candidate.applicationId)}
                          />
                          <div>
                            <h3 className="font-medium text-gray-800">{fullName}</h3>
                            <p className="text-gray-500 text-sm">{vacancyName}</p>
                            <div className="flex space-x-4 mt-1">
                              <span className="text-xs text-gray-500">
                                CV Score: <span className={`font-medium ${cvMark >= cvThreshold ? 'text-green-600' : 'text-red-600'}`}>
                                  {cvMark}% / {cvThreshold}%
                                </span>
                              </span>
                              <span className="text-xs text-gray-500">
                                Prescreening: <span className={`font-medium ${preScreenMark >= preScreenThreshold ? 'text-green-600' : 'text-red-600'}`}>
                                  {preScreenMark}% / {preScreenThreshold}%
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
                          selectedTab === 'Longlist' ? 'bg-green-100 text-green-800' :
                          selectedTab === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedTab === 'Longlist' ? 'Qualified' : selectedTab}
                        </div>
                      </div>
                      
                      {/* Expanded Candidate Details */}
                      {expandedCandidate === candidate.applicationId && (
                        <div className="border-t border-gray-100 p-4 bg-gray-50">
                          <h4 className="font-medium text-gray-700 mb-2">Candidate Details</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Vacancy:</p>
                              <p className="font-medium">{vacancyName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Status:</p>
                              <p className="font-medium">
                                {candidate.status === 'Longlist' ? 'Qualified' : candidate.status || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Email:</p>
                              <p className="font-medium">{candidate.user?.email || 'N/A'}</p>
                            </div>

                            <div>
                              <p className="text-sm text-gray-500">CV Score:</p>
                              <p className="font-medium">
                                <span className={cvMark >= cvThreshold ? 'text-green-600' : 'text-red-600'}>
                                  {cvMark}%
                                </span>
                                {' '}/{' '}
                                {cvThreshold}% required
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Pre-screening Score:</p>
                              <p className="font-medium">
                                <span className={preScreenMark >= preScreenThreshold ? 'text-green-600' : 'text-red-600'}>
                                  {preScreenMark}%
                                </span>
                                {' '}/{' '}
                                {preScreenThreshold}% required
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