import React, { useState, useEffect } from "react";
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
  const [filteredVacancies, setFilteredVacancies] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [notification, setNotification] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // For forcing refresh
  const navigate = useNavigate();
  const location = useLocation();

  // Check for notification parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const message = params.get('message');
    if (message) {
      setNotification(decodeURIComponent(message));
      
      // Clear notification from URL after displaying it
      setTimeout(() => {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        
        // Clear notification after 5 seconds
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      }, 100);
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
    }
  }, [location.search]);

  // Fetch all vacancies
  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5190/api/JobRole");
        if (!response.ok) throw new Error("Failed to fetch job roles");
        
        const data = await response.json();
        
        // Group jobs by title and keep only the first occurrence of each title
        const uniqueJobs = [];
        const uniqueTitles = new Set();
        
        data.forEach(job => {
          if (!uniqueTitles.has(job.jobTitle)) {
            uniqueTitles.add(job.jobTitle);
            uniqueJobs.push({
              id: job.jobId,
              title: job.jobTitle
            });
          }
        });
        
        setVacancies(uniqueJobs);
        setFilteredVacancies(uniqueJobs);

        // If no vacancy is selected yet and we have vacancies, select the first one
        if (!selectedVacancy && uniqueJobs.length > 0 && !viewAll) {
          const vacancyParam = new URLSearchParams(location.search).get('vacancy');
          if (vacancyParam) {
            setSelectedVacancy(vacancyParam);
          } else {
            setSelectedVacancy(uniqueJobs[0].title);
            navigate(`/manager/View_LongList?vacancy=${encodeURIComponent(uniqueJobs[0].title)}`, { replace: true });
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching job roles:", error);
        setError("Failed to fetch vacancies. Please try again later.");
        setIsLoading(false);
      }
    };
    
    fetchVacancies();
  }, [location.search, navigate, selectedVacancy, viewAll]);

  // Apply filters when search term changes
  useEffect(() => {
    if (vacancies.length > 0) {
      let filtered = vacancies;
      
      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(vacancy => 
          vacancy.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
      
      setFilteredVacancies(filtered);
    }
  }, [searchTerm, vacancies]);

  // Fetch candidates based on selected vacancy
  useEffect(() => {
    const fetchCandidates = async () => {
      // Return early if we have neither a selected vacancy nor viewAll is true
      if (!selectedVacancy && !viewAll) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        let url;
        if (viewAll) {
          // Use the endpoint that returns all LongList status candidates
          url = "http://localhost:5190/api/ManagerCandidates";
        } else {
          // Use the endpoint for candidates by vacancy, which should filter for LongList status
          const encoded = encodeURIComponent(selectedVacancy.trim());
          url = `http://localhost:5190/api/ManagerCandidates/vacancy/${encoded}`;
        }
        
        // Add cache-busting parameter to URL
        const timestamp = new Date().getTime();
        url = `${url}${url.includes('?') ? '&' : '?'}_=${timestamp}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        
        let data = await response.json();
        
        // Filter candidates to only include those with LongList status
        // This is a safety check in case the API doesn't filter correctly
        data = data.filter(candidate => {
          const status = candidate.status || candidate.Status || "";
          return status.toLowerCase() === "longlist";
        });
        
        // First, deduplicate candidates by applicationId
        const uniqueApplicationIds = new Set();
        data = data.filter(candidate => {
          if (uniqueApplicationIds.has(candidate.applicationId)) {
            return false;
          }
          uniqueApplicationIds.add(candidate.applicationId);
          return true;
        });
        
        // Now fetch interview data for each unique candidate
        const candidatesWithInterviews = await Promise.all(
          data.map(async (candidate) => {
            if (candidate.applicationId) {
              try {
                const interviewData = await fetchInterviewForCandidate(candidate.applicationId);
                if (interviewData) {
                  return {
                    ...candidate,
                    interview: interviewData
                  };
                }
              } catch (err) {
                console.error(`Error fetching interview for candidate ${candidate.applicationId}:`, err);
              }
            }
            return candidate;
          })
        );
        
        // Update state with deduplicated candidates with interview data
        setCandidatesData(candidatesWithInterviews);
        setIsLoading(false);
      } catch (err) {
        console.error("Error in fetchCandidates:", err);
        setError(`Failed to fetch candidates: ${err.message}`);
        setCandidatesData([]);
        setIsLoading(false);
      }
    };
    
    fetchCandidates();
  }, [selectedVacancy, viewAll, refreshTrigger]);
  
  // Fetch interview details for a specific candidate
  const fetchInterviewForCandidate = async (applicationId) => {
    try {
      // Use cache-busting parameter to avoid browser caching
      const timestamp = new Date().getTime();
      const response = await fetch(`http://localhost:5190/api/ManagerInterview/application/${applicationId}?_=${timestamp}`);
      
      if (response.ok) {
        const interviewData = await response.json();
        return interviewData;
      }
    } catch (error) {
      console.error(`Error fetching interview for candidate ${applicationId}:`, error);
    }
    return null;
  };

  // Handle vacancy selection from search results
  const handleSelectVacancy = (vacancy) => {
    if (!vacancy) return;
    
    // Update the selected vacancy
    setSelectedVacancy(vacancy.title);
    setSearchTerm("");
    setShowSuggestions(false);
    setViewAll(false);
    
    // Navigate to update URL, which will trigger the useEffect for fetching candidates
    navigate(`/manager/View_LongList?vacancy=${encodeURIComponent(vacancy.title)}`, { replace: true });
  };

  // Format date and time for display in the format shown in the image
  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr) return 'N/A';
    
    try {
      // Parse the date
      const date = new Date(dateStr);
      
      // Format date as MM/DD/YYYY
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();
      const formattedDate = `${month}/${day}/${year}`;
      
      // Format time if available
      if (timeStr) {
        // Convert time to 12-hour format with AM/PM
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
  };

  // Handle refresh button click
  const handleRefresh = () => {
    // Force a refresh by incrementing the refreshTrigger
    setRefreshTrigger(prev => prev + 1);
  };

  // Schedule bulk interviews - CORRECTED HANDLER
  const handleScheduleBulkInterviews = () => {
    // Check if a vacancy is selected
    if (selectedVacancy) {
      // Navigate to the LongListInterviewScheduler page with the selected vacancy
      navigate(`/manager/LongListInterviewScheduler?vacancy=${encodeURIComponent(selectedVacancy)}`);
    } else if (viewAll) {
      // If viewing all candidates, show an error or prompt to select a specific vacancy
      setError("Please select a specific vacancy before scheduling bulk interviews");
    } else {
      // This case should not happen if the UI logic is consistent
      setError("No vacancy selected. Please select a vacancy to schedule interviews.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <ManagerTopbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Candidate Long-List</h2>
          
          {/* Refresh button */}
          <button 
            onClick={handleRefresh}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Notification */}
        {notification && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
            <span>{notification}</span>
            <button 
              onClick={() => setNotification(null)}
              className="text-green-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Select Long-List Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Select Long-List</h3>
          
          <div className="relative">
            <div className="flex items-center border rounded-lg bg-white shadow-sm">
              <div className="absolute left-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for vacancy..."
                className="w-full py-3 pl-10 pr-4 text-gray-700 focus:outline-none"
              />
              <div className="pr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Dropdown suggestions */}
            {showSuggestions && searchTerm && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                {filteredVacancies.map(vacancy => (
                  <div 
                    key={vacancy.id} 
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    onClick={() => handleSelectVacancy(vacancy)}
                  >
                    {vacancy.title}
                  </div>
                ))}
                {filteredVacancies.length === 0 && (
                  <div className="px-4 py-2 text-gray-500">No matching vacancies found</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Candidates Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">
              {selectedVacancy ? `${selectedVacancy} Long-List` : "All Long-List Candidates"}
            </h3>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading long-list candidates...</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <span>{error}</span>
            </div>
          )}

          {/* Candidates table */}
          {!isLoading && !error && (
            <>
              {candidatesData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No long-list candidates found for this vacancy.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Marks</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View Details</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interview</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {candidatesData.map((candidate, index) => (
                        <tr key={candidate.applicationId} className="border-b border-gray-100">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-800">
                              {candidate.user?.firstName?.charAt(0) || '?'}{candidate.user?.lastName?.charAt(0) || '?'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {candidate.user ? `${candidate.user.firstName} ${candidate.user.lastName}` : 'Unknown User'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {candidate.cvMark || candidate.cV_Mark || 'N/A'}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Link to={`/manager/ViewDetails/${candidate.applicationId}`}>
                              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                                View Details
                              </button>
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {/* Check for interview data */}
                            {(candidate.interview?.date || candidate.interviewDate) ? (
                              <div className="flex flex-col space-y-2">
                                <div className="text-gray-600 font-medium bg-gray-50 py-2 px-3 rounded">
                                  Interview Scheduled
                                  <div className="text-gray-500 text-sm">
                                    {formatDateTime(
                                      candidate.interview?.date || candidate.interviewDate,
                                      candidate.interview?.time || candidate.interviewTime
                                    )}
                                  </div>
                                </div>
                                <Link to={`/manager/InterviewScheduler/${candidate.applicationId}?edit=true`}>
                                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded flex items-center justify-center w-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                    Edit
                                  </button>
                                </Link>
                              </div>
                            ) : (
                              <Link to={`/manager/InterviewScheduler/${candidate.applicationId}`}>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full">
                                  Schedule Interview
                                </button>
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
          
          {/* Schedule Long-List Interviews button */}
          {candidatesData.length > 0 && (
            <div className="mt-6 text-center">
              <Link to={selectedVacancy ? `/manager/LongListInterviewSheduler?vacancy=${encodeURIComponent(selectedVacancy)}` : "/manager/LongListInterviewSheduler"}>
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-md w-full max-w-lg"
                >
                  Schedule Long-List Interviews
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
 
export default View_LongList;