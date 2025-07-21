import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, BarChart2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
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

  // Define the core application lifecycle statuses
  const CORE_APPLICATION_STAGES = ['Applied', 'Pre-Screening', 'Interview'];
  // The full set of statuses including 'Rejected' for display grouping
  const DISPLAY_STATUSES = [...CORE_APPLICATION_STAGES, 'Rejected'];

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
    }
  }, [currentUser]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:5190/api/CandidateDashboard/${currentUser.id}`
      );
      const transformedApplications = response.data.map(app => ({
        ...app,
        // Map backend 'Application Closed' to 'Rejected' for frontend display
        dashboardStatus: app.dashboardStatus === 'Application Closed' ? 'Rejected' : app.dashboardStatus
      }));

      const filteredApplications = transformedApplications.filter((app) =>
        DISPLAY_STATUSES.includes(app.dashboardStatus)
      );
      setApplications(filteredApplications);
    } catch (err) {
      console.error('Error fetching candidate dashboard:', err);
      setApplications([]);
      setError('Failed to load your applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchJobLists = async () => {
    try {
      const [latestJobsResponse, mostAppliedJobsResponse] = await Promise.all([
        axios.get('http://localhost:5190/api/CandidateVacancy/Latest'),
        axios.get('http://localhost:5190/api/CandidateVacancy/MostApplied'),
      ]);

      setLatestJobs(transformData(latestJobsResponse.data));
      setMostAppliedJobs(transformData(mostAppliedJobsResponse.data));
    } catch (err) {
      console.error('Error fetching job lists:', err);
    }
  };

  const handleWithdraw = async (applicationId) => {
    const confirmWithdraw = window.confirm('Are you sure you want to withdraw this application?');
    if (!confirmWithdraw) return;

    try {
      await axios.delete(`http://localhost:5190/api/CandidateDashboard/${applicationId}`);
      fetchApplications();
    } catch (err) {
      console.error('Error withdrawing application:', err);
      alert('Could not withdraw application. Please try again.');
    }
  };

  const handleStartPreScreen = (applicationId) => {
    navigate('/candidate/prescreen', { state: { applicationId } });
  };

  const handleViewInterview = () => {
    navigate('/candidate/interview');
  };

  // UPDATED: getProgressSteps function logic
  const getProgressSteps = (currentStatus, lastSuccessfulStage) => {
    let stepsToDisplay = [];

    // If application is Rejected, show progress up to the lastSuccessfulStage + Rejected
    if (currentStatus === 'Rejected') {
      const lastStageIndex = CORE_APPLICATION_STAGES.indexOf(lastSuccessfulStage);
      if (lastStageIndex === -1) { // Fallback if lastSuccessfulStage is not recognized
        stepsToDisplay = ['Applied', 'Rejected'];
      } else {
        stepsToDisplay = CORE_APPLICATION_STAGES.slice(0, lastStageIndex + 1);
        stepsToDisplay.push('Rejected'); // Add Rejected at the end
      }
    } else {
      // For active applications, show all core stages
      stepsToDisplay = CORE_APPLICATION_STAGES;
    }

    return stepsToDisplay.map((step) => ({
      label: step,
      // A step is completed if it's before or at the current active status,
      // or if it's 'Rejected' and the application is indeed Rejected.
      completed: (currentStatus !== 'Rejected' && CORE_APPLICATION_STAGES.indexOf(step) <= CORE_APPLICATION_STAGES.indexOf(currentStatus)) ||
                 (currentStatus === 'Rejected' && step === 'Rejected') ||
                 (currentStatus === 'Rejected' && CORE_APPLICATION_STAGES.indexOf(step) <= CORE_APPLICATION_STAGES.indexOf(lastSuccessfulStage))
    }));
  };

  const groupedApplications = applications.reduce((acc, app) => {
    if (!acc[app.dashboardStatus]) {
      acc[app.dashboardStatus] = [];
    }
    acc[app.dashboardStatus].push(app);
    return acc;
  }, {});

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

  const hasDisplayableApplications = applications.length > 0;

  // NEW: Create a Set of applied job IDs for efficient lookup
  const appliedJobIds = new Set(applications.map(app => app.vacancyId));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Applications</h1>
        </div>

        {hasDisplayableApplications ? (
          DISPLAY_STATUSES.map((status) => (
            <div key={status}>
              {groupedApplications[status] && groupedApplications[status].length > 0 && (
                <>
                  <h2 className="text-xl font-semibold text-gray-700 my-4">{status} Applications</h2>
                  {groupedApplications[status].map((app) => (
                    <div
                      key={app.applicationId}
                      className={`bg-white shadow-md rounded-lg p-6 mb-4
                        ${status === 'Rejected' ? 'border-l-4 border-red-500 bg-red-50' : ''}
                      `}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                        <div>
                          <h2 className="text-xl font-semibold">{app.vacancyName}</h2>
                          <p className="text-gray-600">{app.jobRoleDescription}</p>
                        </div>
                        <span
                          className={`
                            mt-2 sm:mt-0 px-3 py-1 rounded-full text-xs font-medium
                            ${status === 'Applied' ? 'bg-green-100 text-green-800' :
                              status === 'Pre-Screening' ? 'bg-yellow-100 text-yellow-800' :
                              status === 'Interview' ? 'bg-blue-100 text-blue-800' :
                              status === 'Rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'}
                          `}
                        >
                          {status}
                        </span>
                      </div>

                      {/* Rejected message with dynamic stage */}
                      {status === 'Rejected' && (
                        <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded-md mb-4 flex items-center">
                          <CheckCircle size={20} className="mr-2 rotate-180 text-red-600" />
                          <span>
                            This application was rejected after the {' '}
                            <span className="font-semibold">{app.lastSuccessfulStage || 'Applied'}</span> stage.
                          </span>
                        </div>
                      )}

                      <div className="flex items-center space-x-4 mb-4 overflow-x-auto pb-2">
                        {/* Pass app.lastSuccessfulStage to getProgressSteps */}
                        {getProgressSteps(app.dashboardStatus, app.lastSuccessfulStage).map((step, index, arr) => (
                          <div key={step.label} className="flex items-center flex-shrink-0">
                            <div
                              className={`
                                w-6 h-6 rounded-full mr-2 flex justify-center items-center
                                ${step.completed && step.label !== 'Rejected' ? 'bg-green-500' : // Green for completed active stages
                                  step.label === 'Rejected' && status === 'Rejected' ? 'bg-red-500' : // Red for Rejected step
                                  'bg-gray-300'}
                              `}
                            >
                              {step.completed && step.label !== 'Rejected' && <CheckCircle className="text-white" size={16} />}
                              {step.label === 'Rejected' && status === 'Rejected' && <CheckCircle className="text-white rotate-180" size={16} />}
                            </div>
                            <span
                              className={`text-sm ${
                                step.completed && step.label !== 'Rejected' ? 'text-green-600' :
                                step.label === 'Rejected' && status === 'Rejected' ? 'text-red-600' :
                                'text-gray-500'
                              }`}
                            >
                              {step.label}
                            </span>
                            {/* Don't render line after 'Rejected' step or if it's the last step in the trimmed array */}
                            {index < arr.length - 1 && (
                              <div
                                className={`h-1 w-8 mx-2 ${
                                  step.completed && step.label !== 'Rejected' ? 'bg-green-500' :
                                  (step.label === 'Rejected' || status === 'Rejected') ? 'bg-red-300' : // Red line for rejected path
                                  'bg-gray-300'
                                }`}
                              />
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <p className="text-gray-500 mb-2 sm:mb-0">
                          Deadline: {new Date(app.endDate).toLocaleDateString()}
                        </p>
                        <div className="flex space-x-2">
                          {status === 'Applied' && (
                            <button
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                              onClick={() => handleStartPreScreen(app.applicationId)}
                            >
                              Start Pre-Screen Test
                            </button>
                          )}

                          {status === 'Interview' && (
                            <button
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                              onClick={handleViewInterview}
                            >
                              View Interviews
                            </button>
                          )}

                          {/* Only show withdraw if not 'Rejected' */}
                          {status !== 'Rejected' && (
                            <button
                              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                              onClick={() => handleWithdraw(app.applicationId)}
                            >
                              Withdraw
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          ))
        ) : (
          <div className="mt-8">
            <div className="bg-white shadow-md rounded-lg p-8 md:p-12 lg:p-16 text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">No Applications Yet</h2>
              <p className="text-gray-600 mb-8">
                You haven't applied for any jobs. Find your next opportunity below!
              </p>
            </div>

            {/* Pass appliedJobIds to JobSlider */}
            <JobSlider title="Latest Jobs" jobs={latestJobs} viewAllLink="/jobs" appliedJobIds={appliedJobIds} />
            <JobSlider title="Demanded Jobs" jobs={mostAppliedJobs} viewAllLink="/jobs" appliedJobIds={appliedJobIds} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;