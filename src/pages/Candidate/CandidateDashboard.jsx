import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  CheckCircle,
  BarChart2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Update path as needed
import JobSlider from '../../components/CandidateComponants/JobSlider';

const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [latestJobs, setLatestJobs] = useState([]);
  const [mostAppliedJobs, setMostAppliedJobs] = useState([]);
  const [activeTab] = useState('applications');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

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
    }
  }, [currentUser]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:5190/api/CandidateDashboard/${currentUser.id}`
      );
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching candidate dashboard:", error);
      setApplications([]);
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
      
      // Use the transformData function before setting state
      setLatestJobs(transformData(latestJobsResponse.data));
      setMostAppliedJobs(transformData(mostAppliedJobsResponse.data));

    } catch (error) {
      console.error("Error fetching job lists:", error);
    }
  };

  const handleWithdraw = async (applicationId) => {
    const confirmDelete = window.confirm("Are you sure you want to withdraw this application?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5190/api/CandidateDashboard/${applicationId}`);
      setApplications(prev => prev.filter(app => app.applicationId !== applicationId));
    } catch (error) {
      console.error("Error withdrawing application:", error);
      alert("Could not withdraw application. Please try again.");
    }
  };

  const getProgressSteps = (status) => {
    const steps = ['Applied', 'Pre-Screening', 'Interview'];
    return steps.map((step) => ({
      label: step,
      completed: steps.indexOf(step) <= steps.indexOf(status)
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchApplications}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Applications</h1>
        </div>

        {applications.length > 0 && ['Applied', 'Pre-Screening', 'Interview'].map((status) => (
          <div key={status}>
            {groupedApplications[status] && (
              <>
                <h2 className="text-xl font-semibold text-gray-700 my-4">{status} Applications</h2>
                {groupedApplications[status].map((app) => (
                  <div key={app.applicationId} className="bg-white shadow-md rounded-lg p-6 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h2 className="text-xl font-semibold">{app.vacancyName}</h2>
                        <p className="text-gray-600">{app.jobRoleDescription}</p>
                      </div>
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-medium
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
                    <div className="flex justify-between items-center">
                      <p className="text-gray-500">Deadline: {new Date(app.endDate).toLocaleDateString()}</p>
                      <div className="space-x-2">
                        <button
                          className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100"
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
        ))}
        
        {/* CORRECTED JSX STRUCTURE */}
        {applications.length === 0 && !loading && (
          <>
            {/* Message Card */}
            <div className="bg-white shadow-md rounded-lg p-48 text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No Applications Yet</h2>
              <p className="text-gray-600 mb-6">You haven't applied for any jobs. Find your next opportunity below!</p>
            </div>

            {/* Job Sliders - now outside the padded card */}
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
          </>
        )}

        {activeTab === 'recommendations' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Job Recommendations</h1>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700">
                <BarChart2 className="mr-2" /> Personalize Recommendations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;