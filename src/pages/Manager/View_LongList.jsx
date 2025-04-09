import React, { useState, useEffect, useRef } from "react";
import ManagerTopbar from "../../components/ManagerTopbar";
import { Link, useNavigate, useLocation } from "react-router-dom";

const View_LongList = () => {
  const [vacancies, setVacancies] = useState([]);
  const [selectedVacancy, setSelectedVacancy] = useState("");
  const [candidatesData, setCandidatesData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVacancies, setFilteredVacancies] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [allCandidates, setAllCandidates] = useState([]);
  const [allCandidatesFetched, setAllCandidatesFetched] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Initialize from URL parameters
  useEffect(() => {
    const vacancyFromUrl = new URLSearchParams(location.search).get('vacancy');
    const viewFromUrl = new URLSearchParams(location.search).get('view');
    if (vacancyFromUrl) {
      setSelectedVacancy(vacancyFromUrl);
      setViewAll(false);
    } else if (viewFromUrl === 'all') {
      setViewAll(true);
      setSelectedVacancy("");
    }
  }, [location.search]);

  // Fetch all vacancies
  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://localhost:7256/api/Candidates/vacancies");
        if (!response.ok) throw new Error("Failed to fetch vacancies");

        const data = await response.json();
        
        // Extract vacancy titles and create a proper list
        const validVacancies = data.map(v => {
          // Try to extract job titles from different possible paths in the data
          let title = null;
          if (v.jobRole && v.jobRole.jobTitle) {
            title = v.jobRole.jobTitle;
          } else if (v.title) {
            title = v.title;
          } else if (v.jobTitle) {
            title = v.jobTitle;
          }
          
          return {
            id: v.vacancyId || v.id,
            title: title || "Unnamed Vacancy",
            vacancyId: v.vacancyId || v.id
          };
        }).filter(v => v.title); // Filter out any without title
        
        // This is for testing purposes based on your example - remove in production
        if (!validVacancies.some(v => v.title === "Software Engineer")) {
          validVacancies.push({
            id: "software-engineer",
            title: "Software Engineer",
            vacancyId: "software-engineer"
          });
        }
        if (!validVacancies.some(v => v.title === "Web Developer")) {
          validVacancies.push({
            id: "web-developer",
            title: "Web Developer",
            vacancyId: "web-developer"
          });
        }
        
        setVacancies(validVacancies);
        setFilteredVacancies(validVacancies);

        const vacancyParam = new URLSearchParams(location.search).get('vacancy');
        const viewParam = new URLSearchParams(location.search).get('view');

        if (!selectedVacancy && !viewAll) {
          if (vacancyParam) setSelectedVacancy(vacancyParam);
          else if (viewParam === 'all') setViewAll(true);
          else if (validVacancies.length > 0) setSelectedVacancy(validVacancies[0].title);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching vacancies:", error);
        setError("Failed to fetch vacancies. Please try again later.");
        setIsLoading(false);
      }
    };
    fetchVacancies();
  }, []);

  // Add event listener for clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) && 
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter vacancies based on search term - triggers after just 1-2 characters
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredVacancies(vacancies);
      // Only show dropdown when input is clicked
      // setShowDropdown(false);
    } else {
      const filtered = vacancies.filter(v => 
        v && v.title && v.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVacancies(filtered);
      // Show dropdown as soon as we have at least one character
      setShowDropdown(true);
    }
  }, [searchTerm, vacancies]);

  // Fetch all candidates across all vacancies
  const fetchAllCandidates = async () => {
    if (allCandidatesFetched && allCandidates.length > 0) {
      setCandidatesData(allCandidates);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // First attempt: Try to get all candidates directly if the endpoint exists
      try {
        const allResponse = await fetch("https://localhost:7256/api/Candidates");
        if (allResponse.ok) {
          const allData = await allResponse.json();
          setAllCandidates(allData);
          setCandidatesData(allData);
          setAllCandidatesFetched(true);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        // Silently fail and try the next approach
        console.log("Direct candidates fetch failed, trying alternative approach");
      }
      
      // Second approach: Fetch candidates for each vacancy and combine
      const fetchPromises = vacancies
        .filter(v => v && v.title)
        .map(v =>
          fetch(`https://localhost:7256/api/Candidates/vacancy/${encodeURIComponent(v.title.trim())}`)
            .then(res => {
              if (!res.ok) {
                console.log(`Failed to fetch for vacancy ${v.title}: ${res.status}`);
                return [];
              }
              return res.json();
            })
            .then(data => {
              if (Array.isArray(data)) {
                return data.map(c => ({ 
                  ...c, 
                  vacancyTitle: v.title 
                }));
              }
              return [];
            })
            .catch(err => {
              console.error(`Error fetching for ${v.title}:`, err);
              return [];
            })
        );
      
      const results = await Promise.all(fetchPromises);
      const all = results.flat();
      console.log(`Fetched ${all.length} candidates across all vacancies`);
      
      setAllCandidates(all);
      setCandidatesData(all);
      setAllCandidatesFetched(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching all candidates:", error);
      setError("Failed to fetch all candidates. Please try again later.");
      setCandidatesData([]);
      setIsLoading(false);
    }
  };

  // Fetch candidates based on selected vacancy or view all
  useEffect(() => {
    const fetchCandidates = async () => {
      if (!selectedVacancy && !viewAll) return;
      
      try {
        if (viewAll) {
          await fetchAllCandidates();
        } else if (selectedVacancy) {
          setIsLoading(true);
          setError(null);
          
          console.log(`Fetching candidates for vacancy: "${selectedVacancy}"`);
          const encoded = encodeURIComponent(selectedVacancy.trim());
          const url = `https://localhost:7256/api/Candidates/vacancy/${encoded}`;
          console.log("Fetching from URL:", url);
          
          const res = await fetch(url);
          if (!res.ok) {
            console.error(`API response error: ${res.status}`);
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
          }
          
          const data = await res.json();
          console.log(`Fetched ${data.length} candidates for ${selectedVacancy}`);
          
          // Add vacancyTitle to each candidate for consistency
          const candidatesWithVacancy = data.map(c => ({
            ...c,
            vacancyTitle: selectedVacancy
          }));
          
          setCandidatesData(candidatesWithVacancy);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error in fetchCandidates:", err);
        setError(`Failed to fetch candidates: ${err.message}`);
        setCandidatesData([]);
        setIsLoading(false);
      }
    };
    
    fetchCandidates();
  }, [selectedVacancy, viewAll]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Show dropdown as soon as user starts typing, even with just 1-2 characters
    if (e.target.value.trim().length > 0) {
      setShowDropdown(true);
    } else {
      // When search is cleared, still show all vacancies in dropdown
      setShowDropdown(false);
    }
  };

  // Handle search input focus
  const handleSearchFocus = () => {
    // Show all vacancies in dropdown when input is focused (clicked)
    if (vacancies.length > 0) {
      setFilteredVacancies(vacancies);
      setShowDropdown(true);
    }
  };

  // Handle search form submission (Enter key)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "" && filteredVacancies.length > 0) {
      handleSelectVacancy(filteredVacancies[0].title);
    } else if (filteredVacancies.length > 0) {
      // If empty search but dropdown is showing, select first item
      handleSelectVacancy(filteredVacancies[0].title);
    }
  };

  // Handle vacancy selection from search dropdown
  const handleSelectVacancy = (title) => {
    if (!title) return;
    console.log(`Selected vacancy: ${title}`);
    setCandidatesData([]);
    setSelectedVacancy(title);
    setSearchTerm("");
    setShowDropdown(false);
    setViewAll(false);
    navigate(`/manager/View_LongList?vacancy=${encodeURIComponent(title)}`, { replace: true });
  };

  // Handle View All button click
  const handleViewAll = () => {
    console.log("View All clicked");
    setCandidatesData([]);
    setViewAll(true);
    setSelectedVacancy("");
    setSearchTerm("");
    setShowDropdown(false);
    navigate("/manager/View_LongList?view=all", { replace: true });
  };

  // Handle Back to Selected button click
  const handleBackToSelected = () => {
    setViewAll(false);
    if (!selectedVacancy && vacancies.length > 0) {
      const first = vacancies[0].title;
      if (first) {
        setSelectedVacancy(first);
        navigate(`/manager/View_LongList?vacancy=${encodeURIComponent(first)}`, { replace: true });
      }
    } else if (selectedVacancy) {
      navigate(`/manager/View_LongList?vacancy=${encodeURIComponent(selectedVacancy)}`, { replace: true });
    }
  };

  // Handle interview scheduler click
  const handleInterviewClick = (applicationId, interview) => {
    if (interview) {
      // If interview exists, navigate to edit mode
      navigate(`/manager/InterviewScheduler/${applicationId}?edit=true`);
    } else {
      // If no interview, navigate to schedule mode
      navigate(`/manager/InterviewScheduler/${applicationId}`);
    }
  };

  // Format date and time for display
  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr) return '';
    
    const date = new Date(dateStr);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    
    // Format time if available
    if (timeStr) {
      return `${formattedDate} ${timeStr}`;
    }
    
    return formattedDate;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <ManagerTopbar />
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="bg-blue-100 text-blue-800 p-2 rounded mb-4 text-center">
          <strong>Currently viewing:</strong> {viewAll ? "All Candidates" : (selectedVacancy || "No vacancy selected")}
        </div>
        <div className="bg-white rounded-xl shadow-md mb-4 border border-blue-500">
          <div className="p-4">
            <h3 className="text-xl font-bold mb-4">Select Vacancy</h3>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search vacancies..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                className="w-full border border-gray-600 rounded-full px-5 py-2"
                disabled={isLoading}
                autoComplete="off"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setShowDropdown(false);
                  }}
                  className="absolute right-16 top-2.5 text-gray-500 hover:text-gray-700"
                >✕</button>
              )}
              <button
                type="submit"
                className="absolute right-4 top-2 text-blue-600 hover:text-blue-800"
                aria-label="Search"
              >
                🔍
              </button>
              {showDropdown && (
                <div 
                  ref={dropdownRef} 
                  className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg"
                >
                  {filteredVacancies.length > 0 ? (
                    <ul className="max-h-60 overflow-auto">
                      {filteredVacancies.map((v, index) => (
                        <li
                          key={v.id || index}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                          onClick={() => handleSelectVacancy(v.title)}
                        >{v.title}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-2 text-gray-500">No matching vacancies found</div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <span>{error}</span>
          </div>
        )}
        <div className="bg-white rounded-xl shadow-md border border-blue-500">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {viewAll ? "All Candidates" : (selectedVacancy || "No vacancy selected")}
              </h2>
              <button 
                onClick={viewAll ? handleBackToSelected : handleViewAll} 
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                {viewAll ? "Back to Selected" : "View All"}
              </button>
            </div>
            {!isLoading && candidatesData.length === 0 && !error ? (
              <div className="text-center py-8 text-gray-500">
                No candidates found {viewAll ? "across all vacancies" : "for this vacancy"}.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="hidden md:grid grid-cols-12 mb-2 px-4 font-semibold">
                  <div className="col-span-1">#</div>
                  <div className="col-span-1">Profile</div>
                  <div className="col-span-3">{viewAll ? "Name / Vacancy" : "Name"}</div>
                  <div className="col-span-2">Test Marks</div>
                  <div className="col-span-2">View Details</div>
                  <div className="col-span-3">Schedule Interview</div>
                </div>
                {candidatesData.map((c, i) => (
                  <div key={c.applicationId || i} className="grid grid-cols-1 md:grid-cols-12 items-center border rounded mb-2 px-4 py-2">
                    <div className="col-span-1">{i + 1}</div>
                    <div className="col-span-1">
                      <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                        {c.user?.firstName?.charAt(0) || '?'}{c.user?.lastName?.charAt(0) || '?'}
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div>{c.user ? `${c.user.firstName || ''} ${c.user.lastName || ''}` : 'Unknown User'}</div>
                      {viewAll && c.vacancyTitle && (
                        <div className="text-blue-600 cursor-pointer" onClick={() => handleSelectVacancy(c.vacancyTitle)}>
                          {c.vacancyTitle}
                        </div>
                      )}
                    </div>
                    <div className="col-span-2">
                      {c.cV_Mark !== undefined ? `${c.cV_Mark}%` : 
                       (c.cvMark !== undefined ? `${c.cvMark}%` : 'N/A')}
                    </div>
                    <div className="col-span-2">
                      <Link to={`/manager/ViewDetails/${c.applicationId}`} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">View Details</Link>
                    </div>
                    <div className="col-span-3">
                      {c.interview ? (
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                          <div className="text-green-600 font-medium whitespace-nowrap">
                            Interview Scheduled
                            <div className="text-gray-600 text-sm">
                              {formatDateTime(c.interview.date, c.interview.time)}
                            </div>
                          </div>
                          <button
                            onClick={() => handleInterviewClick(c.applicationId, c.interview)}
                            className="text-blue-600 p-1 rounded-full hover:bg-blue-50"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleInterviewClick(c.applicationId)}
                          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                        >
                          Schedule Interview
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default View_LongList;