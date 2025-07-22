import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  CheckCircle,
  BarChart2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Update path as needed
import JobSlider from '../../components/CandidateComponants/JobSlider';
import { useNavigate } from 'react-router-dom';

const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [latestJobs, setLatestJobs] = useState([]);
  const [mostAppliedJobs, setMostAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Define the statuses we want to display
  const DISPLAY_STATUSES = ['Applied', 'Pre-Screening', 'Interview'];

  // Transformation function to match the data structure required by JobSlider
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
    if (currentUser?.id) {
      fetchApplications();
      fetchJobLists();
    } else {
      setLoading(false);
      // Optionally set an error if user ID is expected but missing
      // setError("User not logged in or ID not available.");
    }
  }, [currentUser]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:5190/api/CandidateDashboard/${currentUser.id}`
      );
      // Filter applications to include only the desired statuses
      const filteredApplications = response.data.filter(app =>
        DISPLAY_STATUSES.includes(app.dashboardStatus)
      );
      setApplications(filteredApplications);
    } catch (err) {
      console.error("Error fetching candidate dashboard:", err);
      setApplications([]);
      // This will now only trigger for actual errors (like network issues, or if the backend returns a true 404 for a missing user, not just no applications)
      setError("Failed to load your applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobLists = async () => {
    try {
      const [latestJobsResponse, mostAppliedJobsResponse] = await Promise.all([
        axios.get('http://localhost:5190/api/CandidateVacancy/Latest'),
        axios.get('http://localhost:5190/api/CandidateVacancy/MostApplied')
      ]);

      setLatestJobs(transformData(latestJobsResponse.data));
      setMostAppliedJobs(transformData(mostAppliedJobsResponse.data));

    } catch (err) {
      console.error("Error fetching job lists:", err);
    }
  };

  const handleWithdraw = async (applicationId) => {
    const confirmWithdraw = window.confirm("Are you sure you want to withdraw this application?");
    if (!confirmWithdraw) return;

    try {
      await axios.delete(`http://localhost:5190/api/CandidateDashboard/${applicationId}`);
      // After withdrawal, refetch applications to ensure accurate state
      fetchApplications();
    } catch (err) {
      console.error("Error withdrawing application:", err);
      alert("Could not withdraw application. Please try again.");
    }
  };

  const handleStartPreScreen = (applicationId) => {
    navigate('/candidate/prescreen', { state: { applicationId } });
  };

  const getProgressSteps = (status) => {
    const steps = DISPLAY_STATUSES; // Use the defined display statuses for progress steps
    return steps.map((step) => ({
      label: step,
      completed: steps.indexOf(step) <= steps.indexOf(status)
    }));
  };

  // Group filtered applications by their dashboard status
  const groupedApplications = applications.reduce((acc, app) => {
    if (!acc[app.dashboardStatus]) {
      acc[app.dashboardStatus] = [];
    }
    acc[app.dashboardStatus].push(app);
    return acc;
  }, {});

  // --- Render Logic ---

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center w-full">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Error Loading Data</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={fetchApplications}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Loading Applications
          </button>
        </div>
      </div>
    );
  }

  // Determine if there are any applications to display after filtering
  const hasDisplayableApplications = applications.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Applications</h1>
        </div>

        {hasDisplayableApplications ? (
          // Display applications if there are any that match the desired statuses
          DISPLAY_STATUSES.map((status) => (
            <div key={status}>
              {groupedApplications[status] && groupedApplications[status].length > 0 && (
                <>
                  <h2 className="text-xl font-semibold text-gray-700 my-4">{status} Applications</h2>
                  {groupedApplications[status].map((app) => (
                    <div key={app.applicationId} className="bg-white shadow-md rounded-lg p-6 mb-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                        <div>
                          <h2 className="text-xl font-semibold">{app.vacancyName}</h2>
                          <p className="text-gray-600">{app.jobRoleDescription}</p>
                        </div>
                        <span className={`
                          mt-2 sm:mt-0 px-3 py-1 rounded-full text-xs font-medium
                          ${status === 'Applied' ? 'bg-green-100 text-green-800' :
                            status === 'Pre-Screening' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'}
                        `}>
                          {status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mb-4 overflow-x-auto pb-2">
                        {getProgressSteps(app.dashboardStatus).map((step, index, arr) => (
                          <div key={step.label} className="flex items-center flex-shrink-0">
                            <div className={`
                              w-6 h-6 rounded-full mr-2 flex justify-center items-center
                              ${step.completed ? 'bg-green-500' : 'bg-gray-300'}
                            `}>
                              {step.completed && <CheckCircle className="text-white" size={16} />}
                            </div>
                            <span className={`text-sm ${step.completed ? 'text-green-600' : 'text-gray-500'}`}>
                              {step.label}
                            </span>
                            {index < arr.length - 1 && (
                              <div className={`h-1 w-8 mx-2 ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <p className="text-gray-500 mb-2 sm:mb-0">Deadline: {new Date(app.endDate).toLocaleDateString()}</p>
                        <div className="flex space-x-2">
                          {status === 'Applied' && (
                            <button
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                              onClick={() => handleStartPreScreen(app.applicationId)}
                            >
                              Start Pre-Screen Test
                            </button>
                          )}
                          <button
                            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                            onClick={() => handleWithdraw(app.applicationId)}
                          >
                            Withdraw
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          ))
        ) : (
          // Display empty state and job sliders if no applications match the desired statuses
          <div className="mt-8">
            <div className="bg-white shadow-md rounded-lg p-8 md:p-12 lg:p-16 text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">No Applications Yet</h2>
              <p className="text-gray-600 mb-8">You haven't applied for any jobs. Find your next opportunity below!</p>
            </div>

            <JobSlider
              title="Latest Jobs"
              jobs={latestJobs}
              viewAllLink="/jobs"
            />
            <JobSlider
              title="Demanded Jobs"
              jobs={mostAppliedJobs}
              viewAllLink="/jobs"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;