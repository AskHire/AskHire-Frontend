// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import { FiClock } from 'react-icons/fi';
// import CongratulationsCard from '../../components/CongratulationsCard';
// import { useParams } from 'react-router-dom';

// const VoiceAssessment = () => {
//   const { applicationId } = useParams();
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [listening, setListening] = useState(false);
//   const [recordedAnswer, setRecordedAnswer] = useState('');
//   const [awaitingApproval, setAwaitingApproval] = useState(false);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [duration, setDuration] = useState(600); // Default duration in seconds
//   const [timeRemaining, setTimeRemaining] = useState(600);

//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5190/api/CandidatePreScreenTest/Questions/${applicationId}`);
//         setQuestions(res.data.questions);
//         // Initialize answers array with the correct length
//         setAnswers(new Array(res.data.questions.length).fill(null));
        
//         // Set the duration from the API response
//         const totalDuration = res.data.duration * 60; // Convert minutes to seconds
//         setDuration(totalDuration);
//         setTimeRemaining(totalDuration);
        
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching questions:', err);
//       }
//     };
//     fetchQuestions();
//   }, []);

//   // Timer effect
//   useEffect(() => {
//     if (timeRemaining > 0 && !isSubmitted) {
//       const timer = setTimeout(() => setTimeRemaining(prev => prev - 1), 1000);
//       return () => clearTimeout(timer);
//     } else if (timeRemaining === 0 && !isSubmitted) {
//       handleSubmit(); // Auto-submit when time runs out
//     }
//   }, [timeRemaining, isSubmitted]);

//   const formatTimeRemaining = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
//   };

//   const startListening = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognitionRef.current = recognition;
//     setListening(true);
//     setRecordedAnswer('');
//     setAwaitingApproval(false);
//     recognition.start();

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript.trim().toLowerCase();
//       setRecordedAnswer(transcript);
//       setListening(false);
//       setAwaitingApproval(true);
//     };

//     recognition.onerror = (event) => {
//       console.error('Speech recognition error:', event.error);
//       setListening(false);
//     };
//   };

//   const mapTranscriptToOption = (transcript) => {
//     // Make sure we're checking for both word and number versions
//     if (transcript.includes('one') || transcript.includes('1') || transcript.includes('first')) 
//       return 'Option1';
//     if (transcript.includes('two') || transcript.includes('2') || transcript.includes('second')) 
//       return 'Option2';
//     if (transcript.includes('three') || transcript.includes('3') || transcript.includes('third')) 
//       return 'Option3';
//     if (transcript.includes('four') || transcript.includes('4') || transcript.includes('fourth')) 
//       return 'Option4';
    
//     // If no match is found, return Unknown
//     return 'Unknown';
//   };

//   const approveAnswer = () => {
//     const selectedOption = mapTranscriptToOption(recordedAnswer);
    
//     // Create a new copy of the answers array
//     const updatedAnswers = [...answers];
    
//     // Update the current answer
//     updatedAnswers[currentIndex] = {
//       QuestionId: questions[currentIndex].questionId,
//       Answer: selectedOption
//     };
    
//     console.log(`Setting answer for question ${currentIndex+1} to:`, selectedOption);
//     setAnswers(updatedAnswers);
    
//     setRecordedAnswer('');
//     setAwaitingApproval(false);
    
//     if (currentIndex < questions.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     }
//   };

//   const handleSubmit = async () => {
//     // Create a copy of answers and replace any null values with empty answers
//     const finalAnswers = answers.map((answer, index) => {
//       if (answer === null) {
//         return {
//           QuestionId: questions[index].questionId,
//           Answer: "Unknown" // Default value for unanswered questions
//         };
//       }
//       return answer;
//     });

//     // Log the complete data being sent
//     const submissionData = {
//       QuestionCount: questions.length,
//       Answers: finalAnswers
//     };
    
//     console.log('Submitting data:', JSON.stringify(submissionData, null, 2));

//     try {
//       const response = await axios.post(
//         `http://localhost:5190/api/CandidateAnswerCheck/mcq/${applicationId}`,
//         submissionData
//       );
//       console.log('Submission response:', response.data);
//       setResult(response.data);
//       setIsSubmitted(true);
//     } catch (err) {
//       console.error('Error submitting answers:', err);
//       alert('Submission failed. Check console for details.');
//     }
//   };

//   const goToNextQuestion = () => {
//     if (currentIndex < questions.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     }
//   };

//   const goToPreviousQuestion = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex(currentIndex - 1);
//     }
//   };

//   if (loading) return <div className="p-6">Loading questions...</div>;

//   if (result && isSubmitted) {
//     return (
//       <div className="flex justify-center">
//         <CongratulationsCard
//           totalQuestions={result.questionCount}
//           correctAnswers={result.correctAnswersCount}
//           passMark={result.pre_Screen_PassMark}
//           status={result.status}
//         />
//       </div>
//     );
//   }

//   const isLastQuestion = currentIndex === questions.length - 1;
//   const hasAnsweredCurrentQuestion = answers[currentIndex] !== null;

//   // Options mapping
//   const options = [
//     { id: 'Option1', text: questions[currentIndex]?.option1 },
//     { id: 'Option2', text: questions[currentIndex]?.option2 },
//     { id: 'Option3', text: questions[currentIndex]?.option3 },
//     { id: 'Option4', text: questions[currentIndex]?.option4 }
//   ];

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <div className="bg-white shadow-md rounded-lg p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">
//             Question {currentIndex + 1} of {questions.length}
//           </h2>
//           <span className="text-red-500 font-bold">
//             <FiClock className="inline mr-1" />
//             {formatTimeRemaining(timeRemaining)}
//           </span>
//         </div>

//         <p className="text-lg mb-4">{questions[currentIndex]?.questionName}</p>
        
//         <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
//           <p className="text-blue-700">Say the option number to select your answer. Eg: Option 2</p>
//         </div>
        
//         <div className="space-y-2 mb-6">
//           {options.map((option) => (
//             <button
//               key={option.id}
//               // onClick={() => handleOptionClick(option.id)}
//               className={`w-full text-left p-4 rounded-lg border ${
//                 answers[currentIndex]?.Answer === option.id 
//                 ? 'bg-green-100 border-green-600' 
//                 : 'bg-white border-gray-300'
//               }`}
//             >
//               {option.text}
//             </button>
//           ))}
//         </div>

//         {!awaitingApproval && (
//           <button
//             onClick={startListening}
//             className={`w-full py-3 rounded-lg font-medium mb-4 ${
//               listening 
//               ? 'bg-gray-300 cursor-not-allowed' 
//               : 'bg-blue-500 text-white hover:bg-blue-600'
//             }`}
//             disabled={listening}
//           >
//             {listening ? 'Listening...' : 'Answer via Voice'}
//           </button>
//         )}

//         {recordedAnswer && awaitingApproval && (
//           <div className="mt-4 p-4 bg-white shadow-md rounded-lg border border-gray-300 mb-4">
//             <div className="mb-3">
//               <p className="font-medium">You said:</p>
//               <p className="italic text-blue-700">"{recordedAnswer}"</p>
//             </div>
            
//             <div className="mb-3">
//               <p className="font-medium">Selected answer:</p>
//               <p className="text-green-700 font-bold text-lg">{mapTranscriptToOption(recordedAnswer)}</p>
//             </div>
            
//             <div className="flex gap-2">
//               <button
//                 onClick={approveAnswer}
//                 className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//               >
//                 Confirm Answer
//               </button>
//               <button
//                 onClick={startListening}
//                 className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//               >
//                 Try Again
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="flex justify-between mt-4">
//           {currentIndex > 0 && !listening && !awaitingApproval && (
//             <button
//               onClick={goToPreviousQuestion}
//               className="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400"
//             >
//               Previous
//             </button>
//           )}
//           {currentIndex === 0 && <div></div>}

//           {isLastQuestion && !listening && !awaitingApproval ? (
//             <button
//               onClick={handleSubmit}
//               className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//             >
//               Submit
//             </button>
//           ) : (
//             currentIndex < questions.length - 1 && !listening && !awaitingApproval && (
//               <button
//                 onClick={goToNextQuestion}
//                 className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Next
//               </button>
//             )
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VoiceAssessment;

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FiClock } from 'react-icons/fi';
import CongratulationsCard from '../../components/CongratulationsCard';
import { useParams } from 'react-router-dom';

const STORAGE_KEY_END_TIME = 'voiceAssessmentEndTime';

const VoiceAssessment = () => {
  const { applicationId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [recordedAnswer, setRecordedAnswer] = useState('');
  const [awaitingApproval, setAwaitingApproval] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [duration, setDuration] = useState(600); // default duration in seconds
  const [timeRemaining, setTimeRemaining] = useState(600);

  const recognitionRef = useRef(null);

  // Fetch questions and set duration
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`http://localhost:5190/api/CandidatePreScreenTest/Questions/${applicationId}`);
        setQuestions(res.data.questions);
        setAnswers(new Array(res.data.questions.length).fill(null));
        const totalDuration = res.data.duration * 60; // minutes to seconds
        setDuration(totalDuration);

        // Check localStorage for end time
        const storedEndTime = localStorage.getItem(STORAGE_KEY_END_TIME);
        const now = Date.now();

        if (storedEndTime) {
          const endTime = parseInt(storedEndTime, 10);
          const remaining = Math.floor((endTime - now) / 1000);
          if (remaining > 0) {
            setTimeRemaining(remaining);
          } else {
            setTimeRemaining(0);
            handleSubmit(); // Time is up already, submit immediately
          }
        } else {
          // No stored end time - set it now
          const newEndTime = now + totalDuration * 1000;
          localStorage.setItem(STORAGE_KEY_END_TIME, newEndTime.toString());
          setTimeRemaining(totalDuration);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching questions:', err);
      }
    };
    fetchQuestions();
  }, [applicationId]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeRemaining(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isSubmitted) {
      handleSubmit(); // Auto-submit when time runs out
    }
  }, [timeRemaining, isSubmitted]);

  // Format time display
  const formatTimeRemaining = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;
    setListening(true);
    setRecordedAnswer('');
    setAwaitingApproval(false);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim().toLowerCase();
      setRecordedAnswer(transcript);
      setListening(false);
      setAwaitingApproval(true);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setListening(false);
    };
  };

  const mapTranscriptToOption = (transcript) => {
    if (transcript.includes('one') || transcript.includes('1') || transcript.includes('first')) 
      return 'Option1';
    if (transcript.includes('two') || transcript.includes('2') || transcript.includes('second')) 
      return 'Option2';
    if (transcript.includes('three') || transcript.includes('3') || transcript.includes('third')) 
      return 'Option3';
    if (transcript.includes('four') || transcript.includes('4') || transcript.includes('fourth')) 
      return 'Option4';
    return 'Unknown';
  };

  const approveAnswer = () => {
    const selectedOption = mapTranscriptToOption(recordedAnswer);
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = {
      QuestionId: questions[currentIndex].questionId,
      Answer: selectedOption
    };

    console.log(`Setting answer for question ${currentIndex + 1} to:`, selectedOption);
    setAnswers(updatedAnswers);

    setRecordedAnswer('');
    setAwaitingApproval(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitted) return; // prevent multiple submits

    // Clear stored timer on submit
    localStorage.removeItem(STORAGE_KEY_END_TIME);

    const finalAnswers = answers.map((answer, index) => {
      if (answer === null) {
        return {
          QuestionId: questions[index].questionId,
          Answer: "Unknown"
        };
      }
      return answer;
    });

    const submissionData = {
      QuestionCount: questions.length,
      Answers: finalAnswers
    };

    console.log('Submitting data:', JSON.stringify(submissionData, null, 2));

    try {
      const response = await axios.post(
        `http://localhost:5190/api/CandidateAnswerCheck/mcq/${applicationId}`,
        submissionData
      );
      console.log('Submission response:', response.data);
      setResult(response.data);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting answers:', err);
      alert('Submission failed. Check console for details.');
    }
  };

  const goToNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading) return <div className="p-6">Loading questions...</div>;

  if (result && isSubmitted) {
    return (
      <div className="flex justify-center">
        <CongratulationsCard
          totalQuestions={result.questionCount}
          correctAnswers={result.correctAnswersCount}
          passMark={result.pre_Screen_PassMark}
          status={result.status}
        />
      </div>
    );
  }

  const isLastQuestion = currentIndex === questions.length - 1;

  // Options mapping
  const options = [
    { id: 'Option1', text: questions[currentIndex]?.option1 },
    { id: 'Option2', text: questions[currentIndex]?.option2 },
    { id: 'Option3', text: questions[currentIndex]?.option3 },
    { id: 'Option4', text: questions[currentIndex]?.option4 }
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Question {currentIndex + 1} of {questions.length}
          </h2>
          <span className="text-red-500 font-bold">
            <FiClock className="inline mr-1" />
            {formatTimeRemaining(timeRemaining)}
          </span>
        </div>

        <p className="text-lg mb-4">{questions[currentIndex]?.questionName}</p>

        <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
          <p className="text-blue-700">Say the option number to select your answer. Eg: Option 2</p>
        </div>

        <div className="space-y-2 mb-6">
          {options.map((option) => (
            <button
              key={option.id}
              className={`w-full text-left p-4 rounded-lg border ${
                answers[currentIndex]?.Answer === option.id
                  ? 'bg-green-100 border-green-600'
                  : 'bg-white border-gray-300'
              }`}
            >
              {option.text}
            </button>
          ))}
        </div>

        {!awaitingApproval && (
          <button
            onClick={startListening}
            disabled={listening}
            className={`w-full py-3 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition ${
              listening ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {listening ? 'Listening...' : 'Start Speaking'}
          </button>
        )}

        {awaitingApproval && (
          <div className="my-4 p-4 bg-yellow-50 border border-yellow-400 rounded text-yellow-800">
            <p>Detected answer: <strong>{recordedAnswer || '...'}</strong></p>
            <button
              onClick={approveAnswer}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Approve Answer
            </button>

            <p>Detected answer: <strong>{recordedAnswer || '...'}</strong></p>
            <button
              onClick={startListening}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Record Again
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {!isLastQuestion && (
            <button
              onClick={goToNextQuestion}
              className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500"
            >
              Next
            </button>
          )}

          {isLastQuestion && (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceAssessment;
