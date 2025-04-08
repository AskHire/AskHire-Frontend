import React, { useState } from 'react';
import ManagerTopbar from '../../components/ManagerTopbar';

const NotifyCandidates = () => {
  const [selectedTab, setSelectedTab] = useState('qualified');
  const [selectedCandidates, setSelectedCandidates] = useState(['john']);
  
  const tabs = [
    { id: 'qualified', label: 'Qualified', count: 3, icon: '✓' },
    { id: 'rejected', label: 'Rejected', count: 9, icon: '✕' },
    { id: 'pending', label: 'Pending', count: 3, icon: '⌛' }
  ];
  
  const candidates = [
    { id: 'john', name: 'John Smith', position: 'Frontend Developer', score: 70 },
    { id: 'will', name: 'Will Jacks', position: 'Frontend Developer', score: 85 },
    { id: 'mick', name: 'Mick Tyson', position: 'Frontend Developer', score: 90 }
  ];
  
  const handleCandidateSelect = (candidateId) => {
    if (selectedCandidates.includes(candidateId)) {
      setSelectedCandidates(selectedCandidates.filter(id => id !== candidateId));
    } else {
      setSelectedCandidates([...selectedCandidates, candidateId]);
    }
  };
  
  return (

    <div className="bg-gray-100 flex-auto min-h-screen">
      <ManagerTopbar />
    <div className="bg-blue-50 min-h-screen p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Notify Candidates</h1>
        
        {/* Candidates Selection Card */}
        <div className="bg-white border border-blue-800 rounded-lg shadow-sm p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-gray-700">Select one or more candidates to send notifications</div>
            <div className="text-gray-500 text-sm">{selectedCandidates.length} selected</div>
          </div>
          
          {/* Tabs */}
          <div className="bg-gray-300 rounded-full p-1 flex mb-5 gap-x-2">
  {tabs.map(tab => (
    <button
      key={tab.id}
      className={`flex items-center justify-center space-x-1 flex-1 py-2 px-3 rounded-md text-sm font-medium transition
        ${selectedTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
      onClick={() => setSelectedTab(tab.id)}
    >
      <span>{tab.icon}</span>
      <span>{tab.label} ({tab.count})</span>
    </button>
  ))}
</div>


          
          {/* Candidates List */}
          <div className="space-y-3">
            {candidates.map(candidate => (
              <div 
                key={candidate.id} 
                className="border border-gray-100 rounded-lg p-4 flex items-center justify-between hover:border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    checked={selectedCandidates.includes(candidate.id)}
                    onChange={() => handleCandidateSelect(candidate.id)}
                  />
                  <div>
                    <h3 className="font-medium text-gray-800">{candidate.name}</h3>
                    <p className="text-gray-500 text-sm">{candidate.position}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium
                  ${candidate.score >= 90 ? 'bg-green-100 text-green-800' : 
                    candidate.score >= 80 ? 'bg-green-100 text-green-700' : 
                    'bg-green-100 text-green-600'}`}
                >
                  {candidate.score}%
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Notification Form Card */}
        <div className="bg-white border border-blue-700 rounded-lg shadow-sm p-5">
          <div className="mb-4">
            <label htmlFor="subject" className="block mb-2 font-medium text-gray-700">Subject</label>
            <input
              type="text"
              id="subject"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="message" className="block mb-2 font-medium text-gray-700">Message</label>
            <textarea
              id="message"
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">Type</label>
            <div className="flex space-x-6">
              <div className="flex items-center">
                <input
                  id="normal"
                  name="notification-type"
                  type="radio"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="normal" className="ml-2 text-gray-700">Normal</label>
              </div>
              <div className="flex items-center">
                <input
                  id="important"
                  name="notification-type"
                  type="radio"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="important" className="ml-2 text-gray-700">Important</label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-blue-600 text-white py-2 px-6 rounded-full font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Notify
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default NotifyCandidates;
