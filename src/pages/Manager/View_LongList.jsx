import React, { useState, useEffect, useCallback, useMemo } from "react";
import ManagerTopbar from "../../components/ManagerTopbar";
import { Link, useNavigate, useLocation } from "react-router-dom";

const View_LongList = () => {
  const [vacancies, setVacancies] = useState([]);
  const [selectedVacancy, setSelectedVacancy] = useState("");
  const [candidatesData, setCandidatesData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewAll, setViewAll] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [notification, setNotification] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Pagination state - 5 items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Constants for better maintainability
  const API_BASE_URL = "http://localhost:5190/api";
  const LONGLIST_STATUS = "longlist";

  // Memoize filtered vacancies to avoid unnecessary re-calculations
  const filteredVacancies = useMemo(() => {
    if (!searchTerm) return vacancies;
    
    return vacancies.filter(vacancy => 
      vacancy.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [vacancies, searchTerm]);

  // FIXED: Calculate pagination correctly - only paginate the displayed data
  // Remove this old calculation:
  // const totalPages = Math.ceil(candidatesData.length / itemsPerPage);
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  // const currentCandidates = candidatesData.slice(startIndex, endIndex);

  // New: Calculate pagination after candidatesData is ready
  const totalPages = Math.ceil(candidatesData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCandidates = useMemo(() => {
    return candidatesData.slice(startIndex, endIndex);
  }, [candidatesData, startIndex, endIndex]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of the table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper function to create cache-busted URLs
  const createCacheBustedUrl = useCallback((baseUrl) => {
    const timestamp = Date.now();
    return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}t=${timestamp}`;
  }, []);

  // Helper function to handle API errors
  const handleApiError = useCallback((error, context) => {
    console.error(`Error in ${context}:`, error);
    setError(`Failed to ${context}: ${error.message}`);
  }, []);

  // Check for notification parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const message = params.get('message');
    
    if (message) {
      setNotification(decodeURIComponent(message));
      
      // Clean up URL and set timeout for notification
      const cleanupUrl = setTimeout(() => {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }, 100);

      const hideNotification = setTimeout(() => {
        setNotification(null);
      }, 5000);

      return () => {
        clearTimeout(cleanupUrl);
        clearTimeout(hideNotification);
      };
    }
  }, [location.search]);

  // Initialize from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const vacancyFromUrl = params.get('vacancy');
    const viewAllParam = params.get('view');
    
    if (vacancyFromUrl) {
      setSelectedVacancy(vacancyFromUrl);
      setViewAll(false);
    } else if (viewAllParam === 'all') {
      setViewAll(true);
      setSelectedVacancy("");
    } else {
      setViewAll(false);
      setSelectedVacancy("");
    }
  }, [location.search]);

  // Reset to first page when candidates data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [candidatesData]);

  // Fetch vacancies using the same endpoint as LongList.js
  const fetchVacancies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/Vacancy`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch vacancies`);
      }
      
      const data = await response.json();
      
      // Map vacancy data to consistent format
      const formattedVacancies = data.map(vacancy => ({
        id: vacancy.vacancyId || vacancy.id,
        title: vacancy.vacancyName || vacancy.title || vacancy.name,
        description: vacancy.description,
        department: vacancy.department,
        location: vacancy.location,
        createdDate: vacancy.createdDate
      }));
      
      setVacancies(formattedVacancies);
      
    } catch (error) {
      handleApiError(error, 'fetch vacancies');
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError]);

  // Fetch interview details for a specific candidate
  const fetchInterviewForCandidate = useCallback(async (applicationId) => {
    try {
      const url = createCacheBustedUrl(`${API_BASE_URL}/ManagerInterview/application/${applicationId}`);
      const response = await fetch(url);
      
      if (response.ok) {
        return await response.json();
      } else if (response.status === 404) {
        return null; // No interview scheduled
      } else {
        console.warn(`Unexpected response ${response.status} for interview data of candidate ${applicationId}`);
        return null;
      }
    } catch (error) {
      console.error(`Network error fetching interview for candidate ${applicationId}:`, error);
      return null;
    }
  }, [createCacheBustedUrl]);

  // Improved candidate fetching with proper vacancy filtering and duplicate removal
  const fetchCandidates = useCallback(async () => {
    if (!viewAll && !selectedVacancy) {
      setCandidatesData([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const url = `${API_BASE_URL}/ManagerCandidates`;
      let response;
      try {
        response = await fetch(createCacheBustedUrl(url));
      } catch (networkError) {
        setError("Network error: Could not connect to the server.");
        setCandidatesData([]);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        setError(`Server error: ${response.status} ${response.statusText}`);
        setCandidatesData([]);
        setIsLoading(false);
        return;
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        setError("Server returned invalid data. Please contact support.");
        setCandidatesData([]);
        setIsLoading(false);
        return;
      }

      // Filter candidates based on longlist status and vacancy selection
      data = data.filter(candidate => {
        // First check if candidate has longlist status
        const status = (candidate.status || candidate.Status || "").toLowerCase();
        if (status !== LONGLIST_STATUS) {
          return false;
        }
        // If viewing all, return all longlist candidates
        if (viewAll) {
          return true;
        }
        // If specific vacancy is selected, filter by vacancy
        if (selectedVacancy) {
          // Try multiple fields to find the vacancy/job title
          const candidateVacancy = (
            candidate.vacancy?.vacancyName ||
            candidate.vacancy?.name ||
            candidate.vacancy?.title ||
            candidate.jobRole?.jobTitle ||
            candidate.jobRole?.title ||
            candidate.jobTitle ||
            candidate.vacancyName ||
            ""
          ).toLowerCase().trim();
          const selectedVacancyLower = selectedVacancy.toLowerCase().trim();
          // Check for exact match
          if (candidateVacancy === selectedVacancyLower) {
            return true;
          }
          // Check for partial match (in case of slight differences)
          if (candidateVacancy.includes(selectedVacancyLower) || 
              selectedVacancyLower.includes(candidateVacancy)) {
            return true;
          }
          return false;
        }
        return true;
      });

      // Remove duplicates based on applicationId - THIS IS THE KEY FIX
      const uniqueCandidates = new Map();
      data.forEach(candidate => {
        if (candidate.applicationId && !uniqueCandidates.has(candidate.applicationId)) {
          uniqueCandidates.set(candidate.applicationId, candidate);
        }
      });
      const uniqueCandidatesArray = Array.from(uniqueCandidates.values());

      // Fetch interview data for each candidate
      const candidatesWithInterviews = await Promise.all(
        uniqueCandidatesArray.map(async (candidate) => {
          const interview = candidate.applicationId 
            ? await fetchInterviewForCandidate(candidate.applicationId)
            : null;
          return { ...candidate, interview };
        })
      );

      // After fetching and preparing candidatesWithInterviews, calculate totalMark and sort by it
      // Add this before setCandidatesData(candidatesWithInterviews);
      // Calculate totalMark for each candidate
      const candidatesWithTotalMark = candidatesWithInterviews.map(candidate => {
        // Try to get CV and prescreen marks from possible fields
        const cvMark = Number(candidate.cvMark || candidate.cV_Mark || 0);
        const prescreenMark = Number(
          candidate.pre_Screen_PassMark ||
          candidate.Pre_Screen_PassMark ||
          candidate.prescreenMark ||
          candidate.prescreenTestMark ||
          candidate.prescreen ||
          0
        );
        const totalMark = (cvMark * 0.5) + (prescreenMark * 0.5);
        
        return { ...candidate, totalMark, cvMark, prescreenMark };
      });
      // Sort by totalMark descending
      candidatesWithTotalMark.sort((a, b) => b.totalMark - a.totalMark);
      setCandidatesData(candidatesWithTotalMark);

      // After setting candidatesWithInterviews, add a fallback redirect if no candidates and vacancy param is present
      if (!viewAll && selectedVacancy && candidatesWithInterviews.length === 0) {
        // Redirect to View All Candidates if no candidates found for the selected vacancy
        navigate('/manager/View_LongList?view=all', { replace: true });
        return;
      }
    } catch (error) {
      handleApiError(error, 'fetch candidates');
      setCandidatesData([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedVacancy, viewAll, refreshTrigger, createCacheBustedUrl, fetchInterviewForCandidate, handleApiError, navigate]);

  // Load data on component mount and when dependencies change
  useEffect(() => {
    fetchVacancies();
  }, [fetchVacancies]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  // Handle search term changes
  useEffect(() => {
    setShowSuggestions(!!searchTerm);
  }, [searchTerm]);

  // Event handlers
  const handleSelectVacancy = useCallback((vacancy) => {
    if (!vacancy) return;
    
    setSelectedVacancy(vacancy.title);
    setSearchTerm("");
    setShowSuggestions(false);
    setViewAll(false);
    
    navigate(`/manager/View_LongList?vacancy=${encodeURIComponent(vacancy.title)}`, { replace: true });
  }, [navigate]);

  const handleViewAll = useCallback(() => {
    setSelectedVacancy("");
    setViewAll(true);
    setSearchTerm("");
    setShowSuggestions(false);
    
    navigate('/manager/View_LongList?view=all', { replace: true });
  }, [navigate]);

  const handleClearSelection = useCallback(() => {
    setSelectedVacancy("");
    setViewAll(false);
    setSearchTerm("");
    setShowSuggestions(false);
    
    navigate('/manager/View_LongList', { replace: true });
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleScheduleBulkInterviews = useCallback(() => {
    if (selectedVacancy) {
      navigate(`/manager/LongListInterviewSheduler?vacancy=${encodeURIComponent(selectedVacancy)}`);
    } else if (viewAll) {
      navigate('/manager/LongListInterviewScheduler');
    } else {
      setError("No vacancy selected. Please select a vacancy to schedule interviews.");
    }
  }, [selectedVacancy, viewAll, navigate]);

  // Format date and time for display
  const formatDateTime = useCallback((dateStr, timeStr) => {
    if (!dateStr) return 'N/A';
    
    try {
      const date = new Date(dateStr);
      
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();
      const formattedDate = `${month}/${day}/${year}`;
      
      if (timeStr) {
        const [hours, minutes] = timeStr.split(':').map(part => parseInt(part, 10));
        const period = hours >= 12 ? 'pm' : 'am';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes.toString().padStart(2, '0');
        
        return `(${formattedDate} ${formattedHours}:${formattedMinutes}${period})`;
      }
      
      return `(${formattedDate})`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid Date';
    }
  }, []);

  // Pagination component
  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
      const pages = [];
      const maxVisible = 3; // Show max 3 page numbers
      
      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 2) {
          for (let i = 1; i <= Math.min(maxVisible, totalPages); i++) {
            pages.push(i);
          }
        } else if (currentPage >= totalPages - 1) {
          for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
            pages.push(i);
          }
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
        {/* Previous Button */}
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

        {/* Page Numbers */}
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

        {/* Next Button */}
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

  // Render methods for better organization
  const renderNotification = () => {
    if (!notification) return null;
    
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
        <span>{notification}</span>
        <button 
          onClick={() => setNotification(null)}
          className="text-green-700 hover:text-green-900"
          aria-label="Close notification"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    );
  };

  const renderError = () => {
    if (!error) return null;
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
        <span>{error}</span>
        <div className="flex items-center">
          <button 
            onClick={handleRefresh}
            className="ml-2 bg-red-200 hover:bg-red-300 text-red-800 py-1 px-3 rounded"
          >
            Retry
          </button>
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-700 hover:text-red-900"
            aria-label="Close error"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const renderSearchSuggestions = () => {
    if (!showSuggestions || !searchTerm) return null;
    
    return (
      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
        {filteredVacancies.length > 0 ? (
          filteredVacancies.map(vacancy => (
            <div 
              key={vacancy.id} 
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleSelectVacancy(vacancy)}
            >
              {vacancy.title}
            </div>
          ))
        ) : (
          <div className="px-4 py-2 text-gray-500">No matching vacancies found</div>
        )}
      </div>
    );
  };

  const renderEmptyState = (message) => (
    <div className="text-center py-8 text-gray-500">
      <svg className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p>{message}</p>
    </div>
  );

  const renderLoadingState = () => (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-2 text-gray-600">Loading long-list candidates...</p>
    </div>
  );

  // FIXED: Render candidate row - uses correct index calculation for pagination
  const renderCandidateRow = (candidate, index) => (
    <tr key={candidate.applicationId} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{startIndex + index + 1}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-800 font-medium">
          {candidate.user?.firstName?.charAt(0) || '?'}{candidate.user?.lastName?.charAt(0) || '?'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {candidate.user ? `${candidate.user.firstName} ${candidate.user.lastName}` : 'Unknown User'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {candidate.vacancy?.vacancyName || 
         candidate.vacancy?.name || 
         candidate.jobRole?.jobTitle || 
         candidate.jobTitle || 
         candidate.vacancyName || 
         'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {candidate.cvMark || candidate.cV_Mark || 0}%
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          {candidate.pre_Screen_PassMark || candidate.Pre_Screen_PassMark || candidate.prescreenMark || candidate.prescreenTestMark || candidate.prescreen || 0}%
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {candidate.totalMark ? candidate.totalMark.toFixed(2) : 'N/A'}%
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <Link to={`/manager/ViewDetails/${candidate.applicationId}`}>
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors">
            View Details
          </button>
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {(candidate.interview?.date || candidate.interviewDate) ? (
          <div className="flex flex-col space-y-2">
            <div className="text-gray-600 font-medium bg-green-50 py-2 px-3 rounded border border-green-200">
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Interview Scheduled
              </div>
              <div className="text-gray-500 text-sm mt-1">
                {formatDateTime(
                  candidate.interview?.date || candidate.interviewDate,
                  candidate.interview?.time || candidate.interviewTime
                )}
              </div>
            </div>
            <Link to={`/manager/InterviewScheduler/${candidate.applicationId}?edit=true&vacancy=${encodeURIComponent(selectedVacancy)}`}>
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded flex items-center justify-center w-full transition-colors">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0015.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                Edit
              </button>
            </Link>
          </div>
        ) : (
          <Link to={`/manager/InterviewScheduler/${candidate.applicationId}?vacancy=${encodeURIComponent(selectedVacancy)}`}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full transition-colors">
              Schedule Interview
            </button>
          </Link>
        )}
      </td>
    </tr>
  );

  return (
    <div className="bg-blue-50 min-h-screen">
      <ManagerTopbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Candidate Long-List</h1>
          
          <div className="flex space-x-2">
            {/* Clear Selection Button */}
            {(selectedVacancy || viewAll) && (
              <button 
                onClick={handleClearSelection}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded flex items-center transition-colors"
                aria-label="Clear selection"
              >
                <svg className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Clear
              </button>
            )}
            
            {/* Refresh button */}
            <button 
              onClick={handleRefresh}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded flex items-center transition-colors"
              aria-label="Refresh data"
            >
              <svg className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {renderNotification()}

        {/* Select Long-List Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Select Long-List</h2>
          
          {/* View All Button and Current Selection */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <button
              onClick={handleViewAll}
              className={`py-2 px-4 rounded transition-colors ${
                viewAll 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              View All Candidates
            </button>
            
            {selectedVacancy && (
              <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                <span className="text-sm">
                  Selected: <strong>{selectedVacancy}</strong>
                </span>
              </div>
            )}
          </div>
          
          
          
          {/* Search Input */}
          <div className="relative">
            <div className="flex items-center border rounded-lg bg-white shadow-sm">
              <div className="absolute left-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for vacancy..."
                className="w-full py-3 pl-10 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="pr-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {renderSearchSuggestions()}
          </div>
        </div>

        {/* Candidates Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {selectedVacancy ? `${selectedVacancy} Long-List` : viewAll ? "All Long-List Candidates" : "Select a vacancy to view candidates"}
            </h2>
            <div className="text-sm text-gray-600">
              {candidatesData.length} candidate{candidatesData.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {/* Loading indicator */}
          {isLoading && renderLoadingState()}

          {/* Error message */}
          {renderError()}

          {/* Show message when no vacancy is selected */}
          {!isLoading && !error && !viewAll && !selectedVacancy && 
            renderEmptyState("Please select a vacancy to view candidates or click \"View All Candidates\" to see all long-list candidates.")
          }

          {/* Candidates table */}
          {!isLoading && !error && (viewAll || selectedVacancy) && (
            <>
              {candidatesData.length === 0 ? (
                renderEmptyState(
                  selectedVacancy 
                    ? "No long-list candidates found for this vacancy."
                    : "No long-list candidates found."
                )
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CV Mark</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prescreen Mark</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Marks</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View Details</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interview</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentCandidates.map((candidate, index) => 
                        renderCandidateRow(candidate, index)
                      )}
                    </tbody>
                  </table>
                  {/* Pagination Controls */}
          <PaginationControls />
                </div>
              )}
            </>
          )}

          
          
          {/* Schedule Long-List Interviews button */}
          {candidatesData.length > 0 && (
            <div className="mt-6 text-center">
              <button 
                onClick={handleScheduleBulkInterviews}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-md w-full max-w-lg transition-colors"
              >
                Schedule Long-List Interviews
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default View_LongList;