import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlay, 
  FaMicrophone, 
  FaClock, 
  FaQuestionCircle 
} from 'react-icons/fa';

const Prescreen = () => {
  const [testStarted, setTestStarted] = useState(false);
  const navigate = useNavigate();

  const questions = [
    { id: 1, question: "Do you have 3+ years of professional software development experience?", type: "boolean" },
    { id: 2, question: "Which programming languages are you proficient in?", type: "multi-select" },
    { id: 3, question: "What is your highest level of education?", type: "single-select" }
  ];

  const renderIntroScreen = () => (
    <div className="bg-white shadow-lg rounded-lg p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Pre-Screening Assessment</h1>
      <p className="text-gray-600 mb-8">
        This assessment helps us understand your qualifications for the position. 
        You'll have 10 minutes to complete {questions.length} questions.
      </p>
      <div className="flex justify-center space-x-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg flex items-center">
          <FaClock className="mr-2 text-blue-600" />
          <span>Time Limit: 10 minutes</span>
        </div>
        <div className="bg-green-50 p-4 rounded-lg flex items-center">
          <FaQuestionCircle className="mr-2 text-green-600" />
          <span>{questions.length} Questions</span>
        </div>
      </div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => navigate('/textPrescreen')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center"
        >
          <FaPlay className="mr-2" /> Start Text Assessment
        </button>
        <button
          onClick={() => navigate('/VoicePrescreen')}
          className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center"
        >
          <FaMicrophone className="mr-2" /> Start Voice Assessment
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-fit bg-gray-50 flex items-center justify-center p-9">
      <div className="w-full max-w-2xl">
        {!testStarted ? renderIntroScreen() : <p>Render Questions Here</p>}
      </div>
    </div>
  );
};

export default Prescreen;
