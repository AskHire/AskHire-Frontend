import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Bell, 
  User, 
  CheckCircle, 
  Clock, 
  X, 
  RefreshCw,
  Filter,
  BarChart2
} from 'lucide-react';

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('applications');

  // Mock data for applications
  const applications = [
    {
      id: 1,
      jobTitle: "Software Engineer",
      company: "Tech Innovations Inc.",
      status: "Pre-Screening",
      appliedDate: "2024-01-15",
      progressSteps: [
        { label: "Applied", completed: true },
        { label: "Pre-Screening", completed: false },
        { label: "Interview", completed: false },
        { label: "Offer", completed: false }
      ]
    },
    {
      id: 2,
      jobTitle: "Product Manager",
      company: "Global Solutions",
      status: "Interview",
      appliedDate: "2024-02-01",
      progressSteps: [
        { label: "Applied", completed: true },
        { label: "Pre-Screening", completed: true },
        { label: "Interview", completed: false },
        { label: "Offer", completed: false }
      ]
    }
  ];

  // Mock recommended jobs
  const recommendedJobs = [
    {
      title: "Senior Data Scientist",
      company: "Analytics Corp",
      location: "Remote",
      salary: "$120,000 - $150,000"
    },
    {
      title: "UX Research Lead",
      company: "Design Dynamics",
      location: "San Francisco, CA",
      salary: "$110,000 - $140,000"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'applications' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">My Applications</h1>
              <div className="flex space-x-2">
                <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg flex items-center">
                  <Filter className="mr-2" /> Filter
                </button>
                <button className="bg-green-50 text-green-600 px-4 py-2 rounded-lg flex items-center">
                  <RefreshCw className="mr-2" /> Refresh
                </button>
              </div>
            </div>

            {applications.map((app) => (
              <div key={app.id} className="bg-white shadow-md rounded-lg p-6 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{app.jobTitle}</h2>
                    <p className="text-gray-600">{app.company}</p>
                  </div>
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${app.status === 'Pre-Screening' ? 'bg-yellow-100 text-yellow-800' : 
                      app.status === 'Interview' ? 'bg-blue-100 text-blue-800' : 
                      'bg-green-100 text-green-800'}
                  `}>
                    {app.status}
                  </span>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  {app.progressSteps.map((step, index) => (
                    <div key={step.label} className="flex items-center">
                      <div className={`
                        w-6 h-6 rounded-full mr-2 
                        ${step.completed ? 'bg-green-500' : 'bg-gray-300'}
                      `}>
                        {step.completed && <CheckCircle className="text-white" size={24} />}
                      </div>
                      <span className={`
                        text-sm 
                        ${step.completed ? 'text-green-600' : 'text-gray-500'}
                      `}>
                        {step.label}
                      </span>
                      {index < app.progressSteps.length - 1 && (
                        <div className={`
                          h-1 w-8 mx-2 
                          ${step.completed ? 'bg-green-500' : 'bg-gray-300'}
                        `} />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-gray-500">Applied on: {app.appliedDate}</p>
                  <div className="space-x-2">
                    <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg">
                      View Details
                    </button>
                    <button className="bg-red-50 text-red-600 px-4 py-2 rounded-lg">
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Job Recommendations</h1>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
                <BarChart2 className="mr-2" /> Personalize Recommendations
              </button>
            </div>

            {recommendedJobs.map((job, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-6 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{job.title}</h2>
                    <p className="text-gray-600">{job.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-medium">{job.salary}</p>
                    <p className="text-gray-500">{job.location}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                    View Job
                  </button>
                  <button className="bg-green-50 text-green-600 px-4 py-2 rounded-lg">
                    Quick Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;