import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaMicrophone, FaClock, FaQuestionCircle, FaBriefcase } from 'react-icons/fa';

const Prescreen = () => {
  const [testInfo, setTestInfo] = useState(null);
  const navigate = useNavigate();

  const applicationId = "73D61C62-DFD2-4485-8D45-34832F612B0E"; 

  useEffect(() => {
    const fetchTestInfo = async () => {
      try {
        const response = await fetch(`http://localhost:5190/api/PreScreenTest/${applicationId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch test info");
        }
        const data = await response.json();
        setTestInfo(data);
      } catch (error) {
        console.error("Error fetching pre-screen info:", error);
      }
    };

    fetchTestInfo();
  }, [applicationId]);

  const renderIntroScreen = () => (
    <div className="bg-white shadow-lg rounded-lg p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">
        {testInfo?.vacancyName ? `${testInfo.vacancyName} Pre-Screening Assessment` : 'Pre-Screening Assessment'}
      </h1>
      <p className="text-gray-600 mb-8">
        This assessment helps us understand your qualifications for the position.
        You'll have <strong>{testInfo?.duration ?? '...'} minutes</strong> to complete <strong>{testInfo?.questionCount ?? '...'} questions</strong>.
      </p>
      <div className="flex justify-center space-x-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg flex items-center">
          <FaClock className="mr-2 text-blue-600" />
          <span>Time Limit: {testInfo?.duration ?? '...'} minutes</span>
        </div>
        <div className="bg-green-50 p-4 rounded-lg flex items-center">
          <FaQuestionCircle className="mr-2 text-green-600" />
          <span>Number of Questions: {testInfo?.questionCount ?? '...'} Questions</span>
        </div>
        {/* <div className="bg-yellow-50 p-4 rounded-lg flex items-center">
          <FaBriefcase className="mr-2 text-yellow-600" />
          <span>Job Role: {testInfo?.vacancyName ?? '...'}</span>
        </div> */}
      </div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => navigate(`/TextAssessment/${applicationId}`)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center"
        >
          <FaPlay className="mr-2" /> Start Text Assessment
        </button>
        <button
          onClick={() => navigate(`/VoiceAssessment/${applicationId}`)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center"
        >
          <FaMicrophone className="mr-2" /> Start Voice Assessment
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-fit flex items-center justify-center p-9">
      <div className="w-full max-w-2xl">
        {testInfo ? renderIntroScreen() : <p className="text-center">Loading...</p>}
      </div>
    </div>
  );
};

export default Prescreen;
