import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CheckCircle,
  BarChart2
} from 'lucide-react';

const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [activeTab] = useState('applications');

  const userId = 'DB36F830-1A06-4FCB-884C-710FD32BA095'; // Replace with dynamic if needed

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`http://localhost:5190/api/CandidateDashboard/${userId}`);
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching candidate dashboard:", error);
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
    const steps = ['Applied', 'Pre-Screening', 'Interview']; // Removed 'Longlist'
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Applications</h1>
        </div>

        {['Applied', 'Pre-Screening', 'Interview'].map((status) => ( // Removed 'Longlist'
          <div key={status}>
            {groupedApplications[status] && (
              <>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">{status} Applications</h2>
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

                    <div className="flex items-center space-x-4 mb-4">
                      {getProgressSteps(app.dashboardStatus).map((step, index, arr) => (
                        <div key={step.label} className="flex items-center">
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
                          className="bg-red-50 text-red-600 px-4 py-2 rounded-lg"
                          onClick={() => handleWithdraw(app.applicationId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        ))}

        {activeTab === 'recommendations' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Job Recommendations</h1>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
                <BarChart2 className="mr-2" /> Personalize Recommendations
              </button>
            </div>
            {/* Add recommendation UI here if needed */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
