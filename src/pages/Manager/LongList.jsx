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

  // Fetch vacancies from backend
  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        console.log("Fetching vacancies for LongList page");
        const response = await fetch("http://localhost:5190/api/Vacancy");
        if (!response.ok) throw new Error("Failed to fetch vacancies");
        
        const data = await response.json();
        console.log("Vacancies fetched:", data);
        
        // Map vacancy data to the format needed for the component
        const formattedVacancies = data.map(vacancy => ({
          id: vacancy.vacancyId || vacancy.id,
          title: (vacancy.vacancyName || vacancy.title || vacancy.name || "").trim(),
          description: vacancy.description,
          department: vacancy.department,
          location: vacancy.location,
          createdDate: vacancy.createdDate
        }));
        
        // Remove any duplicates by title
        const uniqueVacancies = formattedVacancies.reduce((acc, current) => {
          const x = acc.find(item => item.title.toLowerCase() === current.title.toLowerCase());
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        
        console.log("Formatted vacancies:", uniqueVacancies);
        setVacancies(uniqueVacancies);
        
      } catch (error) {
        console.error("Error fetching vacancies:", error);
      }
    };

    fetchVacancies();
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
        if (sortedList[0]?.createdDate) {
          sortedList.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        } else {
          sortedList.sort((a, b) => b.id - a.id);
        }
        break;
      case 'Oldest':
        if (sortedList[0]?.createdDate) {
          sortedList.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
        } else {
          sortedList.sort((a, b) => a.id - b.id);
        }
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

  // Handle view long-list navigation - FIXED
  const handleViewLongList = (vacancyTitle) => {
    console.log("Navigating to View_LongList with vacancy:", vacancyTitle);
    if (!vacancyTitle) {
      console.error("No vacancy title provided");
      return;
    }
    // Ensure the vacancy title is properly encoded and navigate
    const encodedTitle = encodeURIComponent(vacancyTitle.trim());
    navigate(`/manager/View_LongList?vacancy=${encodedTitle}`);
  };

  // Handle delete functionality
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vacancy?")) {
      try {
        const response = await fetch(`http://localhost:5190/api/Vacancy/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          const updatedVacancies = vacancies.filter(vacancy => vacancy.id !== id);
          setVacancies(updatedVacancies);
          console.log("Vacancy deleted successfully");
        } else {
          console.error("Failed to delete vacancy");
          alert("Failed to delete vacancy. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting vacancy:", error);
        alert("Error deleting vacancy. Please try again.");
      }
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
            <h3 className="text-xl font-bold mb-4 lg:mb-0">Available Vacancies</h3>
            <div className="flex flex-col sm:flex-row items-center w-full lg:w-auto space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search vacancies..."
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
                        className="p-2 bg-red-100 text-red-600 rounded-full"
                        onClick={() => handleDelete(vacancy.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <h4 className="text-md font-bold text-gray-900 mb-3">{vacancy.title}</h4>
                    <div className="space-y-2">
                      <button 
                        onClick={() => handleViewLongList(vacancy.title)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full shadow-md w-full"
                      >
                        View Long-List
                      </button>
                      {/* FIXED: Corrected the URL path and spelling */}
                      <Link to={`/manager/LongListInterviewScheduler?vacancy=${encodeURIComponent(vacancy.title)}`} className="block">
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
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">#</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vacancy Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View Long-List</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule Interview</th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center w-16">Delete</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVacancies.length > 0 ? (
                    filteredVacancies.map((vacancy, index) => (
                      <tr key={vacancy.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{vacancy.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleViewLongList(vacancy.title)}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full shadow-md"
                          >
                            View Long-List
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {/* FIXED: Corrected the URL path and spelling */}
                          <Link to={`/manager/LongListInterviewSheduler?vacancy=${encodeURIComponent(vacancy.title)}`}>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full shadow-md">
                              Schedule Long-List Interviews
                            </button>
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleDelete(vacancy.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors mx-auto"
                            aria-label="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No matching vacancies found</td>
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