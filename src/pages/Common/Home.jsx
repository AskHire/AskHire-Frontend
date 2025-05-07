import React, { useEffect, useState } from 'react';
import Banner from '../../components/banner';
import ProcessOverview from '../../components/ProcessOverview';
import JobSlider from '../../components/JobSlider';

const Home = () => {
  const [mostAppliedJobs, setMostAppliedJobs] = useState([]);
  const [latestJobs, setLatestJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const transformData = (data) =>
    data.map((job) => ({
      id: job.vacancyId,
      title: job.vacancyName,
      location: job.workLocation,
      type: job.workType,
      description: job.description,
      endDate: job.endDate,
      instructions: job.instructions,
    }));

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const [mostAppliedRes, latestRes] = await Promise.all([
          fetch('http://localhost:5190/api/CandidateVacancy/MostApplied'),
          fetch('http://localhost:5190/api/CandidateVacancy/Latest'),
        ]);

        if (!mostAppliedRes.ok || !latestRes.ok) {
          throw new Error('Failed to fetch job listings.');
        }

        const [mostAppliedData, latestData] = await Promise.all([
          mostAppliedRes.json(),
          latestRes.json(),
        ]);

        setMostAppliedJobs(transformData(mostAppliedData));
        setLatestJobs(transformData(latestData));
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load job listings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="max-w-full mx-auto">
      <Banner />

      <div className="max-w-6xl mx-auto px-4">
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

        {!loading && !error && (
          <>
            <JobSlider
              title="Demanded Jobs"
              jobs={mostAppliedJobs}
              viewAllLink="/jobs"
            />

            <JobSlider
              title="Featured Jobs"
              jobs={latestJobs}
              viewAllLink="/jobs"
            />
          </>
        )}

        <ProcessOverview />
      </div>
    </div>
  );
};

export default Home;
