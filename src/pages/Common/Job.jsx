import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import JobCard from '../../components/jobCard';

const JobPage = () => {
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('none');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  const jobsPerPage = 9;

  // Fetch job data from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5190/api/Vacancy/JobWiseVacancies');
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform API data to match our component structure
        const transformedData = data.map(job => ({
          id: job.vacancyId,
          title: job.vacancyName,
          location: job.workLocation,
          type: job.workType,
          description: job.description,
          endDate: job.endDate,
          instructions: job.instructions
        }));
        
        setJobListings(transformedData);
        setError(null);
      } catch (err) {
        setError('Failed to load job listings. Please try again later.');
        console.error('Error fetching job data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search term
  const filteredJobs = jobListings.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort jobs based on selected order
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortOrder === 'a-z') {
      return a.title.localeCompare(b.title);
    } else if (sortOrder === 'z-a') {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
  
  // Reset to first page when search changes
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Get current jobs
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = sortedJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Handle filter selection
  const handleFilterSelect = (order) => {
    setSortOrder(order);
    setShowFilterDropdown(false);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 flex-auto min-h-screen">
      {/* Search bar */}
      <div className="relative mb-6">
        <div className="flex items-center p-4 bg-white rounded-full shadow-md">
          <Search className="text-gray-400 mr-2" size={20} />
          <input 
            type="text" 
            placeholder="Search jobs" 
            className="w-full outline-none"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button className="text-blue-500">
            <svg viewBox="0 0 24 24" width="24" height="24" className="fill-current">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"></path>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Jobs header with filter */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <div className="relative">
          <button 
            className="flex items-center bg-blue-100 text-blue-600 px-4 py-2 rounded-full"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <Filter size={18} className="mr-1" />
            Filter
            <ChevronDown size={16} className="ml-1" />
          </button>
          
          {/* Filter dropdown */}
          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-100">
              <ul className="py-1">
                <li 
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${sortOrder === 'a-z' ? 'bg-blue-50 text-blue-600' : ''}`}
                  onClick={() => handleFilterSelect('a-z')}
                >
                  Sort A-Z
                </li>
                <li 
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${sortOrder === 'z-a' ? 'bg-blue-50 text-blue-600' : ''}`}
                  onClick={() => handleFilterSelect('z-a')}
                >
                  Sort Z-A
                </li>
                {sortOrder !== 'none' && (
                  <li 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-600"
                    onClick={() => handleFilterSelect('none')}
                  >
                    Clear Filter
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Job cards grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentJobs.length > 0 ? (
            currentJobs.map(job => (
              <JobCard 
                key={job.id}
                id={job.id}
                title={job.title} 
                location={job.location} 
                type={job.type} 
                description={job.description}
                endDate={job.endDate}
                instructions={job.instructions}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">
              No jobs found matching your search criteria
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 0 && (
        <div className="flex justify-center mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 mx-1 rounded-full flex items-center justify-center ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobPage;