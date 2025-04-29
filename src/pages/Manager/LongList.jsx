import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import ManagerTopbar from '../../components/ManagerTopbar';

const LongList = () => {
  const [sortBy, setSortBy] = useState('Newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVacancy, setSelectedVacancy] = useState('');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [vacancies, setVacancies] = useState([]);
  const [filteredVacancies, setFilteredVacancies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch job roles from backend
  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        console.log("Fetching job roles for LongList page");
        const response = await fetch("http://localhost:5190/api/JobRole");
        if (!response.ok) throw new Error("Failed to fetch job roles");
        
        const data = await response.json();
        console.log("Job roles fetched:", data);
        
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
        
        // Set the vacancies state with the unique data
        setVacancies(uniqueJobs);
        
      } catch (error) {
        console.error("Error fetching job roles:", error);
      }
    };

    fetchJobRoles();
  }, []);

  // Apply filters (both search and vacancy selection)
  useEffect(() => {
    let filtered = vacancies;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(vacancy => 
        vacancy.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply vacancy selection filter
    if (selectedVacancy) {
      filtered = filtered.filter(vacancy => 
        vacancy.title === selectedVacancy
      );
    }
    
    // Apply sorting to filtered results
    let sortedList = [...filtered];
    
    switch (sortBy) {
      case 'Newest':
        sortedList.sort((a, b) => b.id - a.id);
        break;
      case 'Oldest':
        sortedList.sort((a, b) => a.id - b.id);
        break;
      case 'A-Z':
        sortedList.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'Z-A':
        sortedList.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    
    setFilteredVacancies(sortedList);
  }, [searchTerm, selectedVacancy, vacancies, sortBy]);

  // Handle view long-list navigation
  const handleViewLongList = (vacancyTitle) => {
    console.log("Navigating to View_LongList with vacancy:", vacancyTitle);
    window.location.href = `/manager/View_LongList?vacancy=${encodeURIComponent(vacancyTitle)}`;
  };

  // Handle delete functionality
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this vacancy?")) {
      const updatedVacancies = vacancies.filter(vacancy => vacancy.id !== id);
      setVacancies(updatedVacancies);
    }
  };

  // Reset all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedVacancy('');
  };

  return (
    <div className="bg-gray-100 flex-auto min-h-screen">
      <ManagerTopbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">Candidate Long-List</h2>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-blue-600 flex flex-col py-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 w-full">
            <h3 className="text-xl font-bold mb-4 lg:mb-0">Available Long-Lists</h3>
            <div className="flex flex-col sm:flex-row items-center w-full lg:w-auto space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Body search input */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search by keyword"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Sort dropdown */}
              <div className="flex items-center w-full sm:w-auto">
                <span className="mr-2 text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
                <select
                  className="border border-gray-300 rounded-md py-2 px-4 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option>Newest</option>
                  <option>Oldest</option>
                  <option>A-Z</option>
                  <option>Z-A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter status and clear button */}
          {(searchTerm) && (
            <div className="flex items-center justify-between mb-4 bg-blue-50 p-3 rounded-md">
              <div className="text-sm text-blue-700">
                {filteredVacancies.length > 0 ? (
                  <span>Showing {filteredVacancies.length} filtered results</span>
                ) : (
                  <span>No results match your filters</span>
                )}
              </div>
              <button 
                onClick={handleClearFilters}
                className="text-sm text-blue-700 hover:text-blue-900 font-medium flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Clear Filters
              </button>
            </div>
          )}

          {isMobileView ? (
            <div className="space-y-4">
              {filteredVacancies.length > 0 ? (
                filteredVacancies.map((vacancy, index) => (
                  <div key={vacancy.id} className="bg-white shadow-md border border-gray-300 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700">#{index + 1}</span>
                      <button 
                        className="bg-red-500 text-white p-2 rounded-full shadow-md h-8 w-8 flex items-center justify-center"
                        onClick={() => handleDelete(vacancy.id)}
                      >
                        🗑️
                      </button>
                    </div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">{vacancy.title}</h4>
                    <div className="space-y-2">
                      <button 
                        onClick={() => handleViewLongList(vacancy.title)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full shadow-md w-full"
                      >
                        View Long-List
                      </button>
                      <Link to={`/manager/LongListInterviewSheduler?vacancy=${encodeURIComponent(vacancy.title)}`} className="block">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full shadow-md w-full">
                          Schedule Long-List Interviews
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">No matching vacancies found</div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead>
                  <tr>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">#</th>
                    <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Vacancy Name</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">View Long-List</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                      Schedule Interview
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVacancies.length > 0 ? (
                    filteredVacancies.map((vacancy, index) => (
                      <tr key={vacancy.id} className="my-2">
                        <td colSpan="5" className="p-0">
                          <div className="bg-white shadow-md border border-gray-300 rounded-lg grid grid-cols-12 items-center p-4 gap-2">
                            <span className="col-span-1 text-sm font-medium text-gray-700">{index + 1}</span>
                            <span className="col-span-3 text-sm font-medium text-gray-900">{vacancy.title}</span>
                            <div className="col-span-3">
                              <button
                                onClick={() => handleViewLongList(vacancy.title)}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full shadow-md w-full"
                              >
                                View Long-List
                              </button>
                            </div>
                            <div className="col-span-4">
                              <Link to={`/manager/LongListInterviewSheduler?vacancy=${encodeURIComponent(vacancy.title)}`}>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full shadow-md w-full">
                                  Schedule Long-List Interviews
                                </button>
                              </Link>
                            </div>
                            <div className="col-span-1 flex justify-center">
                              <button 
                                className="bg-red-500 text-white p-2 rounded-full shadow-md h-8 w-8 flex items-center justify-center"
                                onClick={() => handleDelete(vacancy.id)}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500">No matching vacancies found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LongList;