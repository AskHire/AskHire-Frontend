import React from 'react';
import { FileText, Search, Clock, Bell } from 'lucide-react';

export default function ProcessOverview() {
  const steps = [
    {
      icon: <FileText size={48} className="text-blue-600" />,
      title: "Create Profile",
      description: "Build a comprehensive profile showcasing your skills and experience"
    },
    {
      icon: <Search size={48} className="text-blue-600" />,
      title: "Find Jobs",
      description: "Explore personalized job recommendations tailored to your profile"
    },
    {
      icon: <Clock size={48} className="text-blue-600" />,
      title: "Apply & Track",
      description: "Apply to jobs and track your application status in real-time"
    },
    {
      icon: <Bell size={48} className="text-blue-600" />,
      title: "Get Notified",
      description: "Get instant updates on job alerts, interviews, and application progress"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12">How Our Recruitment Platform Works</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className="border border-blue-200 rounded-lg p-8 flex flex-col items-center text-center shadow-md"
          >
            <div className="mb-4">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}