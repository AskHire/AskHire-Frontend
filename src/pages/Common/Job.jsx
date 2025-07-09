import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import JobCard from '../../components/CandidateComponants/JobCard';
import Pagination from '../../components/CandidateComponants/PaginationJob';

const JobPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  // A single state to handle all filter types for simplicity
  const [activeFilter, setActiveFilter] = useState('latest'); 
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        // Use URLSearchParams to build the query string cleanly
        const params = new URLSearchParams({
          pageNumber: currentPage,
          search: searchTerm,
        });

        if (activeFilter === 'demanded') {
          params.append('isDemanded', true);
        } else if (activeFilter === 'latest') {
          params.append('isLatest', true);
        } else if (activeFilter === 'a-z' || activeFilter === 'z-a') {
          params.append('sortOrder', activeFilter);
        }
        
        const res = await fetch(
          `http://localhost:5190/api/CandidateVacancy/JobWiseVacancies?${params.toString()}`
        );
        
        if (!res.ok) throw new Error(`Status ${res.status}`);

        const data = await res.json();

        const transformed = data.items.map((job) => ({
          id: job.vacancyId,
          title: job.vacancyName,
          location: job.workLocation,
          type: job.workType,
          description: job.description,
          endDate: job.endDate,
          instructions: job.instructions,
        }));

        setJobs(transformed);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, searchTerm, activeFilter]); // 👈 Added activeFilter to dependency array

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to the first page when filter changes
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Style for the buttons to highlight the active one
  const getButtonClass = (filter) => {
    return activeFilter === filter
      ? 'bg-blue-600 text-white px-4 py-2 rounded-full'
      : 'bg-blue-100 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-200';
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      {/* Search */}
      <div className="max-w-4xl mx-auto flex items-center bg-white p-3 rounded-full shadow m-4">
        <Search className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search jobs by title or location..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full outline-none bg-transparent"
        />
      </div>

      {/* Header and Filter */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Job Listings</h2>
        
        {/* 👇 All filter/sort buttons in one container */}
        <div className="flex items-center space-x-2 flex-wrap">
          <button
            onClick={() => handleFilterChange('latest')}
            className={getButtonClass('latest')}
          >
            Latest Jobs
          </button>
          <button
            onClick={() => handleFilterChange('demanded')}
            className={getButtonClass('demanded')}
          >
            Demanded Jobs
          </button>
          <button
            onClick={() => handleFilterChange('a-z')}
            className={getButtonClass('a-z')}
          >
            Sort A-Z
          </button>
          <button
            onClick={() => handleFilterChange('z-a')}
            className={getButtonClass('z-a')}
          >
            Sort Z-A
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && <p className="text-center text-blue-500">Loading jobs...</p>}

      {/* Error */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Job Cards */}
      {!loading && jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      )}

      {/* No Jobs */}
      {!loading && jobs.length === 0 && (
        <p className="text-center text-gray-500">No jobs found.</p>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default JobPage;