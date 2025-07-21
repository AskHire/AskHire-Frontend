import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import JobCard from '../../components/CandidateComponants/JobCard';
import Pagination from '../../components/CandidateComponants/PaginationJob';

const JobPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  // Separate states for each filter/sort category
  const [sortOrder, setSortOrder] = useState('latest'); // 'latest', 'demanded', 'a-z', 'z-a', or '' for none
  const [workLocationFilter, setWorkLocationFilter] = useState(''); // 'Remote', 'Physical', or '' for none
  const [workTypeFilter, setWorkTypeFilter] = useState(''); // 'Full-Time', 'Part-Time', or '' for none

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          pageNumber: currentPage,
          search: searchTerm,
        });

        // Add sorting parameters
        if (sortOrder === 'demanded') {
          params.append('isDemanded', true);
        } else if (sortOrder === 'latest') {
          params.append('isLatest', true);
        } else if (sortOrder === 'a-z' || sortOrder === 'z-a') {
          params.append('sortOrder', sortOrder);
        }

        // Add work location filter
        if (workLocationFilter !== '') {
          params.append('workLocation', workLocationFilter);
        }

        // Add work type filter
        if (workTypeFilter !== '') {
          params.append('workType', workTypeFilter);
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

    // Include all relevant filter states in the dependency array
    fetchJobs();
  }, [currentPage, searchTerm, sortOrder, workLocationFilter, workTypeFilter]);

  const handleSortChange = (newSortOrder) => {
    // Toggle the sort order. If the same sort is clicked, unset it.
    setSortOrder(currentSortOrder => currentSortOrder === newSortOrder ? '' : newSortOrder);
    setCurrentPage(1); // Reset to the first page when sorting changes
  };

  const handleWorkLocationChange = (location) => {
    // Toggle work location filter
    setWorkLocationFilter(currentLocation => currentLocation === location ? '' : location);
    setCurrentPage(1);
  };

  const handleWorkTypeChange = (type) => {
    // Toggle work type filter
    setWorkTypeFilter(currentType => currentType === type ? '' : type);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Helper function to determine button class based on active filters
  const getButtonClass = (filterCategory, filterValue) => {
    let isActive = false;
    if (filterCategory === 'sort') {
      isActive = sortOrder === filterValue;
    } else if (filterCategory === 'workLocation') {
      isActive = workLocationFilter === filterValue;
    } else if (filterCategory === 'workType') {
      isActive = workTypeFilter === filterValue;
    }

    return isActive
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

        <div className="flex items-center space-x-2 flex-wrap">
          {/* Sort Buttons */}
          <button
            onClick={() => handleSortChange('latest')}
            className={getButtonClass('sort', 'latest')}
          >
            Latest Jobs
          </button>
          <button
            onClick={() => handleSortChange('demanded')}
            className={getButtonClass('sort', 'demanded')}
          >
            Demanded Jobs
          </button>
          <button
            onClick={() => handleSortChange('a-z')}
            className={getButtonClass('sort', 'a-z')}
          >
            Sort A-Z
          </button>
          <button
            onClick={() => handleSortChange('z-a')}
            className={getButtonClass('sort', 'z-a')}
          >
            Sort Z-A
          </button>

          {/* Divider */}
          <span className="text-gray-400 px-2 select-none">|</span>

          {/* Work Location Filters */}
          <button
            onClick={() => handleWorkLocationChange('Remote')}
            className={getButtonClass('workLocation', 'Remote')}
          >
            Remote
          </button>
          <button
            onClick={() => handleWorkLocationChange('Physical')}
            className={getButtonClass('workLocation', 'Physical')}
          >
            Physical
          </button>

          {/* Divider */}
          <span className="text-gray-400 px-2 select-none">|</span>

          {/* Work Type Filters */}
          <button
            onClick={() => handleWorkTypeChange('Full-Time')}
            className={getButtonClass('workType', 'Full-Time')}
          >
            Full-Time
          </button>
          <button
            onClick={() => handleWorkTypeChange('Part-Time')}
            className={getButtonClass('workType', 'Part-Time')}
          >
            Part-Time
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