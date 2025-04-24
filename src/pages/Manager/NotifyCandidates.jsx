import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ManagerTopbar from '../../components/ManagerTopbar';

const NotifyCandidates = () => {
  const [selectedTab, setSelectedTab] = useState('qualified');
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [candidatesByStatus, setCandidatesByStatus] = useState({ qualified: [], rejected: [], pending: [] });
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('Normal');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      // Fetch all statuses in parallel
      const [qualifiedRes, rejectedRes, pendingRes] = await Promise.all([
        axios.get('https://localhost:7256/api/Candidates/status/qualified'),
        axios.get('https://localhost:7256/api/Candidates/status/rejected'),
        axios.get('https://localhost:7256/api/Candidates/status/pending')
      ]);

      const candidatesData = {
        qualified: qualifiedRes.data || [],
        rejected: rejectedRes.data || [],
        pending: pendingRes.data || []
      };
      
      setCandidatesByStatus(candidatesData);
      console.log('Fetched candidates:', candidatesData);
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
    }
  };

  const handleCandidateSelect = (applicationId) => {
    setSelectedCandidates(prev =>
      prev.includes(applicationId) ? prev.filter(id => id !== applicationId) : [...prev, applicationId]
    );
  };

  const handleNotify = async () => {
    if (!subject || !message || selectedCandidates.length === 0) {
      alert('Please fill all fields and select at least one candidate.');
      return;
    }

    try {
      const response = await axios.post('https://localhost:7256/api/Notification', {
        subject,
        message,
        type
      });

      console.log('Notification sent:', response.data);
      alert('Notification sent successfully!');

      // Reset form
      setSubject('');
      setMessage('');
      setSelectedCandidates([]);
    } catch (error) {
      console.error('Notification error:', error);
      alert('Failed to send notification.');
    }
  };

  // Calculate counts from the actual data we have
  const counts = {
    qualified: Array.isArray(candidatesByStatus.qualified) ? candidatesByStatus.qualified.length : 0,
    rejected: Array.isArray(candidatesByStatus.rejected) ? candidatesByStatus.rejected.length : 0,
    pending: Array.isArray(candidatesByStatus.pending) ? candidatesByStatus.pending.length : 0
  };

  const tabs = [
    { id: 'qualified', label: 'Qualified', icon: '✓', count: counts.qualified },
    { id: 'rejected', label: 'Rejected', icon: '✕', count: counts.rejected },
    { id: 'pending', label: 'Pending', icon: '⌛', count: counts.pending }
  ];

  const candidates = candidatesByStatus[selectedTab] || [];

  return (
    <div className="bg-gray-100 flex-auto min-h-screen">
      <ManagerTopbar />
      <div className="bg-blue-50 min-h-screen p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Notify Candidates</h1>

          <div className="bg-white border border-blue-800 rounded-lg shadow-sm p-5 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-gray-700">Select candidates to send notifications</div>
              <div className="text-gray-500 text-sm">{selectedCandidates.length} selected</div>
            </div>

            {/* Tabs */}
            <div className="bg-gray-300 rounded-full p-1 flex mb-5 gap-x-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`flex items-center justify-center space-x-1 flex-1 py-2 px-3 rounded-md text-sm font-medium transition ${
                    selectedTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedTab(tab.id)}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label} ({tab.count})</span>
                </button>
              ))}
            </div>

            {/* Candidate List */}
            <div className="space-y-3">
              {candidates.length === 0 ? (
                <p className="text-center py-4 text-gray-500">No candidates found</p>
              ) : (
                candidates.map(candidate => (
                  <div
                    key={candidate.applicationId}
                    className="border border-gray-100 rounded-lg p-4 flex items-center justify-between hover:border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="h-5 w-5 text-blue-600 rounded border-gray-300"
                        checked={selectedCandidates.includes(candidate.applicationId)}
                        onChange={() => handleCandidateSelect(candidate.applicationId)}
                      />
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {candidate.user?.firstName} {candidate.user?.lastName}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {candidate.vacancy?.jobRole?.jobTitle || 'No position'}
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      (candidate.cV_Mark || 0) >= 90 ? 'bg-green-100 text-green-800' :
                      (candidate.cV_Mark || 0) >= 80 ? 'bg-green-100 text-green-700' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {candidate.cV_Mark || 0}%
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Notification Form */}
          <div className="bg-white border border-blue-700 rounded-lg shadow-sm p-5">
            <div className="mb-4">
              <label htmlFor="subject" className="block mb-2 font-medium text-gray-700">Subject</label>
              <input
                type="text"
                id="subject"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="message" className="block mb-2 font-medium text-gray-700">Message</label>
              <textarea
                id="message"
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium text-gray-700">Type</label>
              <div className="flex space-x-6">
                {['Normal', 'Important'].map(t => (
                  <div key={t} className="flex items-center">
                    <input
                      id={t}
                      name="notification-type"
                      type="radio"
                      value={t}
                      checked={type === t}
                      onChange={(e) => setType(e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor={t} className="ml-2 text-gray-700">{t}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNotify}
                disabled={selectedCandidates.length === 0 || !subject || !message}
                className={`${
                  selectedCandidates.length > 0 && subject && message
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-300 cursor-not-allowed'
                } text-white py-2 px-6 rounded-full font-medium`}
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