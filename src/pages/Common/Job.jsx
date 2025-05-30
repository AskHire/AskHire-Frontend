import React, { useEffect, useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import JobCard from '../../components/JobCard';

const JobPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('none');
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;

  // Load jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5190/api/CandidateVacancy/JobWiseVacancies');
        if (!res.ok) throw new Error(`Status ${res.status}`);

        const data = await res.json();
        const transformed = data.map(job => ({
          id: job.vacancyId,
          title: job.vacancyName,
          location: job.workLocation,
          type: job.workType,
          description: job.description,
          endDate: job.endDate,
          instructions: job.instructions,
        }));

        setJobs(transformed);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter by search term
  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortOrder === 'a-z') return a.title.localeCompare(b.title);
    if (sortOrder === 'z-a') return b.title.localeCompare(a.title);
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
  const currentJobs = sortedJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  const handleSort = (order) => {
    setSortOrder(order);
    setShowFilters(false);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 min-h-screen">
      {/* Search */}
      <div className="flex items-center bg-white p-3 rounded-full shadow mb-6">
        <Search className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full outline-none"
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
              <li onClick={() => handleSort('a-z')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Sort A-Z</li>
              <li onClick={() => handleSort('z-a')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Sort Z-A</li>
              {sortOrder !== 'none' && (
                <li onClick={() => handleSort('none')} className="px-4 py-2 text-gray-500 hover:bg-gray-100 cursor-pointer">Clear</li>
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
      {!loading && currentJobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentJobs.map(job => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      )}

      {/* No Jobs */}
      {!loading && currentJobs.length === 0 && (
        <p className="text-center text-gray-500">No jobs found.</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`mx-1 px-3 py-1 rounded-full ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
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
