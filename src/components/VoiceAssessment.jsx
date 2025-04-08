import React, { useState, useEffect, useRef } from 'react';
import { 
  FaMicrophone, 
  FaStopCircle, 
  FaPlay, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaRedo, 
  FaExclamationCircle,
  FaChevronLeft,
  FaChevronRight,
  FaVolumeUp,
  FaMedal,
  FaFileAlt,
  FaClock
} from 'react-icons/fa';

const VoiceAssessment = () => {
  // Voice assessment prompts
  const [prompts, setPrompts] = useState([
    {
      id: 1,
      type: 'pronunciation',
      text: "Pronounce the word 'Technology'",
      expectedPronunciation: "tek-nol-uh-jee",
      audioUrl: null,
      recordedAudio: null,
      score: null,
      feedback: null
    },
    {
      id: 2,
      type: 'sentence-reading',
      text: "Read: 'The quick brown fox jumps over the lazy dog'",
      expectedPronunciation: null,
      audioUrl: null,
      recordedAudio: null,
      score: null,
      feedback: null
    },
    {
      id: 3,
      type: 'fluency',
      text: "Describe your favorite hobby for 30 seconds",
      expectedPronunciation: null,
      audioUrl: null,
      recordedAudio: null,
      score: null,
      feedback: null
    },
    {
      id: 4,
      type: 'pronunciation',
      text: "Pronounce the word 'Entrepreneurship'",
      expectedPronunciation: "on-truh-pruh-nur-ship",
      audioUrl: null,
      recordedAudio: null,
      score: null,
      feedback: null
    },
    {
      id: 5,
      type: 'intonation',
      text: "Read with proper intonation: 'Is that your final answer?'",
      expectedPronunciation: null,
      audioUrl: null,
      recordedAudio: null,
      score: null,
      feedback: null
    }
  ]);

  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [testCompleted, setTestCompleted] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [micPermission, setMicPermission] = useState(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const recordingTimerRef = useRef(null);

  // Request microphone access
  useEffect(() => {
    async function setupMicrophone() {
      try {
        setLoading(true);
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);

        recorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          
          const updatedPrompts = [...prompts];
          updatedPrompts[currentPromptIndex].recordedAudio = audioUrl;
          setPrompts(updatedPrompts);

          audioChunksRef.current = [];
        };

        setMediaRecorder(recorder);
        setMicPermission(true);
        setLoading(false);
      } catch (error) {
        console.error('Microphone access error:', error);
        setError('Please grant microphone access to continue the assessment.');
        setMicPermission(false);
        setLoading(false);
      }
    }

    setupMicrophone();
    
    // Cleanup function
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (timeRemaining > 0 && !testCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmitTest();
    }
  }, [timeRemaining, testCompleted]);

  // Start recording
  const startRecording = () => {
    if (mediaRecorder) {
      setRecordingTime(0);
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start recording timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      
      // Clear recording timer
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  // Play recorded audio
  const playRecordedAudio = (audioUrl) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };

  // Delete recorded audio
  const deleteRecordedAudio = () => {
    const updatedPrompts = [...prompts];
    updatedPrompts[currentPromptIndex].recordedAudio = null;
    updatedPrompts[currentPromptIndex].score = null;
    updatedPrompts[currentPromptIndex].feedback = null;
    setPrompts(updatedPrompts);
  };

  // Mock scoring function (would be replaced with actual AI/ML assessment)
  const assessRecording = (prompt) => {
    setLoading(true);
    
    // Simulated API call with timeout to mimic processing
    setTimeout(() => {
      // Generate random score
      const randomScore = Math.floor(Math.random() * 100);
      
      // Generate feedback based on score
      let feedback;
      if (randomScore >= 80) {
        feedback = "Excellent pronunciation and clarity. Well done!";
      } else if (randomScore >= 60) {
        feedback = "Good pronunciation with minor areas for improvement.";
      } else if (randomScore >= 40) {
        feedback = "Average pronunciation. Focus on stress patterns and clarity.";
      } else {
        feedback = "Needs significant improvement. Practice the sounds more carefully.";
      }
      
      const updatedPrompts = [...prompts];
      updatedPrompts[currentPromptIndex].score = randomScore;
      updatedPrompts[currentPromptIndex].feedback = feedback;
      setPrompts(updatedPrompts);
      setLoading(false);
    }, 1500);
  };

  // Navigate between prompts
  const handleNextPrompt = () => {
    if (currentPromptIndex < prompts.length - 1) {
      setCurrentPromptIndex(prev => prev + 1);
    }
  };

  const handlePreviousPrompt = () => {
    if (currentPromptIndex > 0) {
      setCurrentPromptIndex(prev => prev - 1);
    }
  };

  // Submit test
  const handleSubmitTest = () => {
    // Check if any recordings exist
    const hasAnyRecordings = prompts.some(p => p.recordedAudio !== null);
    
    if (!hasAnyRecordings) {
      setError("Please complete at least one prompt before submitting.");
      return;
    }
    
    // Auto-assess any recorded but not assessed prompts
    const updatedPrompts = [...prompts];
    let needsAssessment = false;
    
    updatedPrompts.forEach((prompt, index) => {
      if (prompt.recordedAudio && prompt.score === null) {
        needsAssessment = true;
      }
    });
    
    if (needsAssessment) {
      setLoading(true);
      // Simulate batch processing
      setTimeout(() => {
        const finalPrompts = updatedPrompts.map(prompt => {
          if (prompt.recordedAudio && prompt.score === null) {
            const score = Math.floor(Math.random() * 100);
            let feedback;
            if (score >= 80) {
              feedback = "Excellent pronunciation and clarity. Well done!";
            } else if (score >= 60) {
              feedback = "Good pronunciation with minor areas for improvement.";
            } else if (score >= 40) {
              feedback = "Average pronunciation. Focus on stress patterns and clarity.";
            } else {
              feedback = "Needs significant improvement. Practice the sounds more carefully.";
            }
            return {...prompt, score, feedback};
          }
          return prompt;
        });
        
        setPrompts(finalPrompts);
        setLoading(false);
        setTestCompleted(true);
      }, 2000);
    } else {
      setTestCompleted(true);
    }
  };

  // Format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Calculate test results
  const calculateResults = () => {
    const completedPrompts = prompts.filter(p => p.score !== null).length;
    const totalScore = prompts.reduce((sum, p) => sum + (p.score || 0), 0);
    const averageScore = completedPrompts > 0 ? totalScore / completedPrompts : 0;
    
    // Calculate proficiency level
    let proficiencyLevel;
    if (averageScore >= 90) {
      proficiencyLevel = "Advanced";
    } else if (averageScore >= 75) {
      proficiencyLevel = "Upper Intermediate";
    } else if (averageScore >= 60) {
      proficiencyLevel = "Intermediate";
    } else if (averageScore >= 40) {
      proficiencyLevel = "Lower Intermediate";
    } else {
      proficiencyLevel = "Beginner";
    }

    return {
      totalPrompts: prompts.length,
      completedPrompts,
      averageScore: averageScore.toFixed(2),
      proficiencyLevel
    };
  };

  // Show loading spinner
  const renderLoading = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg flex flex-col items-center">
        <FaRedo className="animate-spin text-blue-600 w-10 h-10 mb-4" />
        <p className="text-lg font-medium">Processing...</p>
      </div>
    </div>
  );

  // Show error dialog
  const renderError = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg flex flex-col items-center max-w-md">
        <FaExclamationCircle className="text-red-600 w-10 h-10 mb-4" />
        <p className="text-lg font-medium text-center mb-4">{error}</p>
        <button 
          onClick={() => setError(null)}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </div>
  );

  // Render microphone permission request
  const renderMicrophoneRequest = () => (
    <div className="bg-white shadow-lg rounded-lg p-8 text-center">
      <FaMicrophone className="w-16 h-16 text-blue-600 mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-4">Microphone Access Required</h1>
      <p className="mb-6">This assessment requires microphone access to record your voice. Please grant permission when prompted.</p>
      <button 
        onClick={() => window.location.reload()}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Request Access
      </button>
    </div>
  );

  // Render current voice prompt
  const renderCurrentPrompt = () => {
    const currentPrompt = prompts[currentPromptIndex];

    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Prompt {currentPromptIndex + 1} of {prompts.length}
          </h2>
          <div className="flex items-center">
            <FaClock className="mr-2 text-yellow-500" />
            <span className="font-bold text-red-500">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mb-3">
            {currentPrompt.type.charAt(0).toUpperCase() + currentPrompt.type.slice(1)}
          </div>
          <p className="text-lg font-medium mb-4">{currentPrompt.text}</p>
          {currentPrompt.type === 'pronunciation' && currentPrompt.expectedPronunciation && (
            <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded inline-block">
              <FaVolumeUp className="inline-block mr-1 w-4 h-4" />
              Expected Pronunciation: {currentPrompt.expectedPronunciation}
            </p>
          )}
        </div>

        {currentPrompt.score !== null && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2">
              <FaMedal className={`mr-2 ${
                currentPrompt.score >= 70 ? 'text-green-600' : 
                currentPrompt.score >= 50 ? 'text-yellow-600' : 'text-red-600'
              }`} />
              <h3 className="font-semibold">Your Score: <span className={
                currentPrompt.score >= 70 ? 'text-green-600' : 
                currentPrompt.score >= 50 ? 'text-yellow-600' : 'text-red-600'
              }>{currentPrompt.score}%</span></h3>
            </div>
            <p className="text-gray-700">{currentPrompt.feedback}</p>
          </div>
        )}

        <div className="flex flex-col items-center space-y-4">
          {!currentPrompt.recordedAudio ? (
            <div className="w-full max-w-md">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`
                  flex items-center justify-center w-full py-4 rounded-lg text-white
                  ${isRecording 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-blue-600 hover:bg-blue-700'}
                `}
                disabled={loading}
              >
                {isRecording ? (
                  <>
                    <FaStopCircle className="mr-2" /> Stop Recording ({formatTime(recordingTime)})
                  </>
                ) : (
                  <>
                    <FaMicrophone className="mr-2" /> Start Recording
                  </>
                )}
              </button>
              {isRecording && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-red-500 h-2.5 rounded-full animate-pulse" style={{ width: `${Math.min(recordingTime / 30 * 100, 100)}%` }}></div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => playRecordedAudio(currentPrompt.recordedAudio)}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 flex items-center"
                disabled={loading}
              >
                <FaPlay className="mr-2" /> Play
              </button>
              <button
                onClick={() => assessRecording(currentPrompt)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center"
                disabled={loading || currentPrompt.score !== null}
              >
                <FaCheckCircle className="mr-2" /> Assess
              </button>
              <button
                onClick={deleteRecordedAudio}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center"
                disabled={loading}
              >
                <FaTimesCircle className="mr-2" /> Delete
              </button>
            </div>
          )}
        </div>

        <audio ref={audioRef} className="hidden" controls />

        <div className="flex justify-between mt-6">
          <button
            onClick={handlePreviousPrompt}
            disabled={currentPromptIndex === 0 || loading}
            className={`
              px-6 py-3 rounded-lg flex items-center
              ${currentPromptIndex === 0 || loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}
            `}
          >
            <FaChevronLeft className="mr-1" /> Previous
          </button>
          <button
            onClick={handleNextPrompt}
            disabled={currentPromptIndex === prompts.length - 1 || loading}
            className={`
              px-6 py-3 rounded-lg flex items-center
              ${currentPromptIndex === prompts.length - 1 || loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'}
            `}
          >
            Next <FaChevronRight className="ml-1" />
          </button>
        </div>
      </div>
    );
  };

  // Render prompt progress
  const renderPromptProgress = () => {
    return (
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Assessment Progress</h3>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {prompts.map((prompt, index) => (
            <button
              key={prompt.id}
              onClick={() => setCurrentPromptIndex(index)}
              disabled={loading}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${currentPromptIndex === index 
                  ? 'bg-blue-600 text-white' 
                  : prompt.recordedAudio 
                    ? (prompt.score !== null 
                      ? 'bg-green-500 text-white' 
                      : 'bg-yellow-500 text-white')
                    : 'bg-gray-200 text-gray-600'}
              `}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${(prompts.filter(p => p.score !== null).length / prompts.length) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-3 h-3 bg-gray-200 rounded-full mr-2"></div>
            <p>Not Started: {prompts.filter(p => !p.recordedAudio).length}</p>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <p>Recorded: {prompts.filter(p => p.recordedAudio && p.score === null).length}</p>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <p>Assessed: {prompts.filter(p => p.score !== null).length}</p>
          </div>
        </div>
        <button 
          onClick={handleSubmitTest}
          disabled={loading}
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center"
        >
          <FaCheckCircle className="mr-2" /> Submit Assessment
        </button>
      </div>
    );
  };

  // Render test results
  const renderTestResults = () => {
    const results = calculateResults();

    return (
      <div className="bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-6 text-green-600">Assessment Completed</h1>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="mb-2">
              <FaFileAlt className="w-6 h-6 mx-auto text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">Total Prompts</h3>
            <p className="text-2xl font-bold">{results.totalPrompts}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="mb-2">
              <FaCheckCircle className="w-6 h-6 mx-auto text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">Completed</h3>
            <p className="text-2xl font-bold text-green-600">{results.completedPrompts}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="mb-2">
              <FaMedal className="w-6 h-6 mx-auto text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold">Average Score</h3>
            <p className="text-2xl font-bold text-yellow-600">{results.averageScore}%</p>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-2">Proficiency Level</h3>
          <p className="text-3xl font-bold text-blue-700">{results.proficiencyLevel}</p>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
            <div 
              className={`h-4 rounded-full ${
                parseFloat(results.averageScore) >= 75 ? 'bg-green-600' :
                parseFloat(results.averageScore) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${results.averageScore}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm mt-1 text-gray-600">
            <span>Beginner</span>
            <span>Intermediate</span>
            <span>Advanced</span>
          </div>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4">Detailed Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {prompts.map((prompt, index) => (
              <div key={prompt.id} className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold mb-2">Prompt {index + 1}</h4>
                <p className="text-sm mb-2 text-gray-600">{prompt.type}</p>
                <p className="text-xs mb-3 truncate">{prompt.text}</p>
                {prompt.score !== null ? (
                  <>
                    <div className={`
                      inline-block px-3 py-1 rounded-full text-white text-sm font-bold
                      ${prompt.score >= 70 
                        ? 'bg-green-600' 
                        : prompt.score >= 50 
                          ? 'bg-yellow-500' 
                          : 'bg-red-500'}
                    `}>
                      {prompt.score}%
                    </div>
                    {prompt.recordedAudio && (
                      <button
                        onClick={() => playRecordedAudio(prompt.recordedAudio)}
                        className="ml-2 p-1 bg-gray-100 rounded-full"
                      >
                        <FaPlay className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                  </>
                ) : (
                  <div className="text-gray-500 text-sm">Not assessed</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FaRedo className="mr-2" /> Retake Assessment
          </button>
          <button 
            onClick={() => window.print()}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 flex items-center"
          >
            <FaFileAlt className="mr-2" /> Save Results
          </button>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      {loading && renderLoading()}
      {error && renderError()}
      
      {micPermission === false ? (
        <div className="max-w-md mx-auto">
          {renderMicrophoneRequest()}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-blue-700">Voice Pronunciation Assessment</h1>
            <p className="text-gray-600">Complete the speaking prompts to assess your pronunciation skills</p>
          </header>
          
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="w-full md:w-3/4 mb-6 md:mb-0">
              {!testCompleted 
                ? renderCurrentPrompt() 
                : renderTestResults()}
            </div>
            <div className="w-full md:w-1/4">
              {!testCompleted && renderPromptProgress()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAssessment;