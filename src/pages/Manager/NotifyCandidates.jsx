import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ManagerTopbar from '../../components/ManagerTopbar';
import { useNavigate } from 'react-router-dom';

// Add: For vacancy search/filter
const fetchAllVacancies = async () => {
  try {
    const response = await axios.get('http://localhost:5190/api/Vacancy');
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch vacancies:', error);
    return [];
  }
};

const NotifyCandidates = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('Longlist'); // Default tab is Longlist
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
  
  // Vacancy search/filter state
  const [vacancies, setVacancies] = useState([]);
  const [selectedVacancy, setSelectedVacancy] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Selection state - only selectAll needed now
  const [selectAll, setSelectAll] = useState(false);

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

  // Fetch all vacancies on mount
  useEffect(() => {
    fetchAllVacancies().then(data => {
      // Normalize vacancy title
      setVacancies(
        data.map(v => ({
          id: v.vacancyId || v.id,
          title: v.vacancyName || v.title || v.name,
        }))
      );
    });
  }, []);

  // Filtered vacancies for search suggestions
  const filteredVacancies = searchTerm
    ? vacancies.filter(v => v.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : vacancies;

  // Filter candidates by selected vacancy
  const filterByVacancy = (candidates) => {
    if (!selectedVacancy) return candidates;
    return candidates.filter(c => {
      const candidateVacancy =
        c.vacancy?.vacancyName ||
        c.vacancy?.name ||
        c.vacancy?.title ||
        c.jobRole?.jobTitle ||
        c.jobRole?.title ||
        c.jobTitle ||
        c.vacancyName ||
        '';
      return candidateVacancy.toLowerCase() === selectedVacancy.toLowerCase();
    });
  };

  // Set up auto-refresh polling (every 30 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Auto-refreshing candidate data...');
      fetchCandidates();
    }, 30000); // 30 seconds

    // Clean up on component unmount
    return () => clearInterval(intervalId);
  }, [fetchCandidates]);

  // Add sendSingleEmail function
  const sendSingleEmail = async (candidateId, fullName) => {
    if (!subject || !message) {
      setNotification({
        show: true,
        message: 'Please fill subject and message fields before sending.',
        type: 'error'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
      return;
    }
    try {
      setLoading(true);
      const notificationData = {
        subject,
        message,
        type,
        time: new Date().toISOString(),
        candidateIds: [candidateId],
        status: 'Manager'
      };
      await axios.post('http://localhost:5190/api/ManagerNotification', notificationData);
      setNotification({
        show: true,
        message: `Notification sent to ${fullName}!`,
        type: 'success'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    } catch (error) {
      setNotification({
        show: true,
        message: `Failed to send notification: ${error.response?.data?.message || error.message}`,
        type: 'error'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Add sendBulkNotification function
  const sendBulkNotification = async () => {
    if (!subject || !message) {
      setNotification({
        show: true,
        message: 'Please fill all fields before sending.',
        type: 'error'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
      return;
    }
    const candidateIds = candidates.map(c => c.applicationId);
    if (candidateIds.length === 0) {
      setNotification({
        show: true,
        message: 'No candidates to notify in this tab.',
        type: 'error'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
      return;
    }
    try {
      setLoading(true);
      const notificationData = {
        subject,
        message,
        type,
        time: new Date().toISOString(),
        candidateIds,
        status: 'Manager'
      };
      await axios.post('http://localhost:5190/api/ManagerNotification', notificationData);
      setNotification({
        show: true,
        message: 'Notification sent successfully!',
        type: 'success'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
      setSubject('');
      setMessage('');
      // Refresh candidates after successful notification
      fetchCandidates();
    } catch (error) {
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

  // Filter candidates by selected vacancy
  const candidates = filterByVacancy(candidatesByStatus[selectedTab] || []);

  // Pagination logic for candidates
  const totalPages = Math.ceil(candidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCandidates = candidates.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle select all - now selects ALL candidates in current tab, not just current page
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  // Reset selectAll when tab changes
  useEffect(() => {
    setSelectAll(false);
  }, [selectedTab, selectedVacancy]);

  // Handle Next button click
  const handleNext = () => {
    if (!selectAll) {
      setNotification({
        show: true,
        message: 'Please select candidates to proceed.',
        type: 'error'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
      return;
    }

    // Navigate to ManagerSystemNotification with ALL candidates from current tab
    navigate('/manager/ManagerSystemNotification', { 
      state: { 
        selectedCandidates: candidates, // Send all candidates from current filtered tab
        selectedTab: selectedTab 
      } 
    });
  };

  // Pagination controls (like LongList)
  const PaginationControls = () => {
    if (totalPages <= 1) return null;
    const getVisiblePages = () => {
      const pages = [];
      const maxVisible = 3;
      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        if (currentPage <= 2) {
          for (let i = 1; i <= Math.min(maxVisible, totalPages); i++) pages.push(i);
        } else if (currentPage >= totalPages - 1) {
          for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) pages.push(i);
        } else {
          pages.push(currentPage - 1);
          pages.push(currentPage);
          pages.push(currentPage + 1);
        }
      }
      return pages;
    };
    return (
      <div className="flex justify-center items-center mt-6 space-x-1">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 font-medium transition-colors min-w-[80px] ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Prev
        </button>
        {getVisiblePages().map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-10 h-10 rounded-full font-medium transition-colors ${
              currentPage === page
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 font-medium transition-colors min-w-[80px] ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  // Toggle candidate details view
  const toggleCandidateDetails = (applicationId) => {
    setExpandedCandidate(expandedCandidate === applicationId ? null : applicationId);
  };

  // UI: Vacancy dropdown selection
  const renderVacancyDropdown = () => (
    <div className="mb-6">
      <label className="block mb-2 font-medium text-gray-700">Select Vacancy</label>
      <select
        className="w-full py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedVacancy}
        onChange={e => setSelectedVacancy(e.target.value)}
      >
        <option value="">View All Candidates</option>
        {vacancies.map(vacancy => (
          <option key={vacancy.id} value={vacancy.title}>{vacancy.title}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="bg-blue-50 flex-auto min-h-screen">
      <ManagerTopbar />
      {/* Vacancy Dropdown UI */}
      <div className="max-w-4xl mx-auto">
        {renderVacancyDropdown()}
      </div>
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
              <div className="text-gray-700">Select all candidates to send notifications</div>
              <div className="flex items-center space-x-4">
                {/* Single Select All Checkbox */}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-600">
                    Select All ({candidates.length} candidates)
                  </span>
                </label>
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

            {/* Candidate List - No checkboxes, just display */}
            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                </div>
              ) : currentCandidates.length === 0 ? (
                <p className="text-center py-4 text-gray-500">No candidates found</p>
              ) : (
                currentCandidates.map(candidate => {
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
                    <div key={candidate.applicationId} className={`border rounded-lg hover:border-blue-300 transition ${
                      selectAll ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                    }`}>
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {/* Selection indicator */}
                          {selectAll && (
                            <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                          )}
                          <div>
                            <h3 className="font-medium text-gray-800">{fullName}</h3>
                            <p className="text-gray-500 text-sm">{vacancyName}</p>
                            <div className="flex space-x-4 mt-1">
                              <span className="text-xs text-gray-500">
                                CV Score: <span className={`font-medium ${cvMark >= cvThreshold ? 'text-green-600' : 'text-red-600'}`}>{cvMark}% / {cvThreshold}%</span>
                              </span>
                              <span className="text-xs text-gray-500">
                                Prescreening: <span className={`font-medium ${preScreenMark >= preScreenThreshold ? 'text-green-600' : 'text-red-600'}`}>{preScreenMark}% / {preScreenThreshold}%</span>
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

          {/* Pagination Controls */}
          <PaginationControls />

          {/* Next Button and Selected Count */}
          <div className="flex justify-between items-center mt-10">
            <div className="text-sm text-gray-600">
              {selectAll ? `All ${candidates.length} candidates selected` : 'No candidates selected'}
            </div>
            <button
              onClick={handleNext}
              disabled={!selectAll}
              className={`px-8 py-3 rounded-lg font-semibold transition ${
                !selectAll
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Next {selectAll ? `(${candidates.length})` : '(0)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotifyCandidates;