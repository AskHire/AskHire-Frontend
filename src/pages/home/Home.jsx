import React, { useEffect, useState } from 'react';
import Banner from '../../components/banner';
import ProcessOverview from '../../components/ProcessOverview';
import JobSlider from '../../components/JobSlider';

const Home = () => {
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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


  // Get jobs to display - use API data if available, otherwise use sample data
  const getDisplayJobs = () => {
    if (jobListings && jobListings.length > 0) {
      return jobListings;
    }
    return;
  };

  return (
    <div className="max-w-full mx-auto">

      <div>
        <Banner />
      </div>


      <div className='max-w-6xl mx-auto px-4'>
        {loading && (
          <div className="text-center py-8">
            <p>Loading job listings...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-red-500 text-center py-8">
            <p>{error}</p>
          </div>
        )}

        <JobSlider
          title="Featured Jobs"
          jobs={getDisplayJobs()}
          viewAllLink="/jobs"
        />

        <JobSlider
          title="Featured Jobs"
          jobs={getDisplayJobs()}
          viewAllLink="/jobs"
        />


        <ProcessOverview />
      </div>


    </div>
  );
};

export default Home;