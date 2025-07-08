import React, { useEffect, useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import JobCard from '../../components/CandidateComponants/JobCard';
import Pagination from '../../components/CandidateComponants/PaginationJob';

const JobPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('none');
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5190/api/CandidateVacancy/JobWiseVacancies?pageNumber=${currentPage}&search=${encodeURIComponent(
            searchTerm
          )}&sortOrder=${sortOrder}`
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
  }, [currentPage, searchTerm, sortOrder]);

  const handleSort = (order) => {
    setSortOrder(order);
    setShowFilters(false);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handler for the pagination component
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      {/* Search */}
      <div className="max-w-4xl mx-auto flex items-center bg-white p-3 rounded-full shadow m-4">
        <Search className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full outline-none bg-transparent" // Added bg-transparent
        />
      </div>

      {/* Header and Filter */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Job Listings</h2>
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full flex items-center"
          >
            <Filter size={16} className="mr-1" />
            Filter
            <ChevronDown size={16} className="ml-1" />
          </button>

          {showFilters && (
            <ul className="absolute right-0 mt-2 bg-white shadow rounded-md border w-40 z-10">
              <li
                onClick={() => handleSort('a-z')}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Sort A-Z
              </li>
              <li
                onClick={() => handleSort('z-a')}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Sort Z-A
              </li>
              {sortOrder !== 'none' && (
                <li
                  onClick={() => handleSort('none')}
                  className="px-4 py-2 text-gray-500 hover:bg-gray-100 cursor-pointer"
                >
                  Clear
                </li>
              )}
            </ul>
          )}
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