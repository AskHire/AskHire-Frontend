// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FiClock, FiCheckCircle } from 'react-icons/fi';
// import { useParams } from 'react-router-dom';
// import CongratulationsCard from '../../components/CongratulationsCard'; // Keep path relative to your project

// const TextAssessment = () => {
//   const { applicationId } = useParams();
//   const [questions, setQuestions] = useState([]);
//   const [duration, setDuration] = useState(600); // default fallback
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [timeRemaining, setTimeRemaining] = useState(600);
//   const [testCompleted, setTestCompleted] = useState(false);
//   const [resultData, setResultData] = useState(null);

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5190/api/CandidatePreScreenTest/Questions/${applicationId}`);
//         const loadedQuestions = res.data.questions.map((q) => ({
//           questionId: q.questionId,
//           question: q.questionName,
//           options: [
//             { id: 'Option1', text: q.option1 },
//             { id: 'Option2', text: q.option2 },
//             { id: 'Option3', text: q.option3 },
//             { id: 'Option4', text: q.option4 }
//           ],
//           selectedAnswer: null
//         }));
//         setQuestions(loadedQuestions);

//         const totalDuration = res.data.duration * 60;
//         setDuration(totalDuration);

//         const storedStartTime = localStorage.getItem(`testStartTime-${applicationId}`);
//         let startTime;

//         if (storedStartTime) {
//           startTime = new Date(parseInt(storedStartTime));
//         } else {
//           startTime = new Date();
//           localStorage.setItem(`testStartTime-${applicationId}`, startTime.getTime());
//         }

//         const now = new Date();
//         const elapsedSeconds = Math.floor((now - startTime) / 1000);
//         const remaining = totalDuration - elapsedSeconds;

//         setTimeRemaining(remaining > 0 ? remaining : 0);
//         if (remaining <= 0) {
//           handleSubmitTest();
//         }
//       } catch (err) {
//         console.error('Failed to fetch questions:', err);
//       }
//     };

//     fetchQuestions();
//   }, [applicationId]);

//   useEffect(() => {
//     if (timeRemaining > 0 && !testCompleted) {
//       const timer = setTimeout(() => setTimeRemaining(prev => prev - 1), 1000);
//       return () => clearTimeout(timer);
//     } else if (timeRemaining === 0 && !testCompleted) {
//       handleSubmitTest();
//     }
//   }, [timeRemaining, testCompleted]);

//   const handleSelectAnswer = (answerId) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[currentQuestionIndex].selectedAnswer = answerId;
//     setQuestions(updatedQuestions);
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(prev => prev - 1);
//     }
//   };

//   const handleSubmitTest = async () => {
//     setTestCompleted(true);
//     localStorage.removeItem(`testStartTime-${applicationId}`);

//     const answerData = questions.map((q) => ({
//       questionId: q.questionId,
//       answer: q.selectedAnswer || ""
//     }));

//     try {
//       const res = await axios.post(
//         `http://localhost:5190/api/CandidateAnswerCheck/mcq/${applicationId}`,
//         {
//           questionCount: questions.length,
//           answers: answerData,
//         }
//       );

//       setResultData(res.data);
//     } catch (err) {
//       console.error("Error submitting answers:", err);
//     }
//   };

//   const formatTime = (seconds) => {
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return `${m}:${s < 10 ? '0' : ''}${s}`;
//   };

//   if (questions.length === 0) return <div className="p-6">Loading questions...</div>;

//   const currentQuestion = questions[currentQuestionIndex];

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       {!testCompleted ? (
//         <div className="bg-white shadow-md rounded-lg p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold">
//               Question {currentQuestionIndex + 1} of {questions.length}
//             </h2>
//             <div className="flex items-center">
//               <FiClock className="text-red-500 mr-2" />
//               <span className="text-red-500 font-bold">{formatTime(timeRemaining)}</span>
//             </div>
//           </div>

//           <p className="text-lg mb-4">{currentQuestion.question}</p>

//           <div className="space-y-3">
//             {currentQuestion.options.map((option) => (
//               <button
//                 key={option.id}
//                 onClick={() => handleSelectAnswer(option.id)}
//                 className={`w-full text-left p-4 rounded-lg border transition
//                   ${currentQuestion.selectedAnswer === option.id
//                     ? 'bg-green-100 border-green-600 border-2 text-black'
//                     : 'bg-white border-gray-300 hover:border-blue-400'}`}
//               >
//                 <div className="flex justify-between items-center">
//                   <span>{option.text}</span>
//                   {currentQuestion.selectedAnswer === option.id && (
//                     <FiCheckCircle className="text-green-600" />
//                   )}
//                 </div>
//               </button>
//             ))}
//           </div>

//           <div className="flex justify-between mt-6">
//             <button
//               onClick={handlePrevious}
//               disabled={currentQuestionIndex === 0}
//               className="px-5 py-2 bg-gray-300 rounded disabled:opacity-50"
//             >
//               Previous
//             </button>

//             {currentQuestionIndex === questions.length - 1 ? (
//               <button
//                 onClick={handleSubmitTest}
//                 className="px-5 py-2 bg-green-600 text-white rounded"
//               >
//                 Submit
//               </button>
//             ) : (
//               <button
//                 onClick={handleNext}
//                 className="px-5 py-2 bg-blue-500 text-white rounded"
//               >
//                 Next
//               </button>
//             )}
//           </div>
//         </div>
//       ) : (
//         <div className="flex justify-center">
//           <CongratulationsCard
//             totalQuestions={resultData?.questionCount}
//             correctAnswers={resultData?.correctAnswersCount}
//             passMark={resultData?.pre_Screen_PassMark}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default TextAssessment;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FiClock, FiCheckCircle } from 'react-icons/fi';
// import { useParams } from 'react-router-dom';
// import CongratulationsCard from '../../components/CandidateComponants/CongratulationsCard'; 

// const TextAssessment = () => {
//   const { applicationId,useNavigate } = useParams();
//   const [questions, setQuestions] = useState([]);
//   const [duration, setDuration] = useState(600);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [timeRemaining, setTimeRemaining] = useState(600);
//   const [testCompleted, setTestCompleted] = useState(false);
//   const [resultData, setResultData] = useState(null);
//   const [alreadyAttempted, setAlreadyAttempted] = useState(false);

 
//   const handleContinue = () => {
//     navigate('/candidate/interview');
//   };

//   const handleBackHome = () => {
//     navigate('/');
//   };

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5190/api/CandidatePreScreenTest/Questions/${applicationId}`);
        
//         // Check if user already attempted
//         if (res.data.status === "Longlist" || res.data.status === "Rejected") {
//           setAlreadyAttempted(true);
//           return;
//         }

//         const loadedQuestions = res.data.questions.map((q) => ({
//           questionId: q.questionId,
//           question: q.questionName,
//           options: [
//             { id: 'Option1', text: q.option1 },
//             { id: 'Option2', text: q.option2 },
//             { id: 'Option3', text: q.option3 },
//             { id: 'Option4', text: q.option4 }
//           ],
//           selectedAnswer: null
//         }));

//         const totalDuration = res.data.duration * 60;
//         setDuration(totalDuration);

//         const storedQuestions = localStorage.getItem(`testQuestions-${applicationId}`);
//         const storedIndex = localStorage.getItem(`currentIndex-${applicationId}`);
//         const storedStartTime = localStorage.getItem(`testStartTime-${applicationId}`);

//         if (storedQuestions) {
//           setQuestions(JSON.parse(storedQuestions));
//         } else {
//           setQuestions(loadedQuestions);
//         }

//         if (storedIndex) {
//           setCurrentQuestionIndex(parseInt(storedIndex));
//         }

//         let startTime;
//         if (storedStartTime) {
//           startTime = new Date(parseInt(storedStartTime));
//         } else {
//           startTime = new Date();
//           localStorage.setItem(`testStartTime-${applicationId}`, startTime.getTime());
//         }

//         const now = new Date();
//         const elapsedSeconds = Math.floor((now - startTime) / 1000);
//         const remaining = totalDuration - elapsedSeconds;

//         setTimeRemaining(remaining > 0 ? remaining : 0);
//         if (remaining <= 0) {
//           handleSubmitTest();
//         }
//       } catch (err) {
//         console.error('Failed to fetch questions:', err);
//       }
//     };

//     fetchQuestions();
//   }, [applicationId]);

//   useEffect(() => {
//     if (timeRemaining > 0 && !testCompleted) {
//       const timer = setTimeout(() => setTimeRemaining(prev => prev - 1), 1000);
//       return () => clearTimeout(timer);
//     } else if (timeRemaining === 0 && !testCompleted) {
//       handleSubmitTest();
//     }
//   }, [timeRemaining, testCompleted]);

//   useEffect(() => {
//     if (questions.length > 0) {
//       localStorage.setItem(`testQuestions-${applicationId}`, JSON.stringify(questions));
//     }
//   }, [questions, applicationId]);

//   useEffect(() => {
//     localStorage.setItem(`currentIndex-${applicationId}`, currentQuestionIndex.toString());
//   }, [currentQuestionIndex, applicationId]);

//   const handleSelectAnswer = (answerId) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[currentQuestionIndex].selectedAnswer = answerId;
//     setQuestions(updatedQuestions);
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(prev => prev - 1);
//     }
//   };

//   const handleSubmitTest = async () => {
//     setTestCompleted(true);
//     localStorage.removeItem(`testStartTime-${applicationId}`);
//     localStorage.removeItem(`testQuestions-${applicationId}`);
//     localStorage.removeItem(`currentIndex-${applicationId}`);

//     const answerData = questions.map((q) => ({
//       questionId: q.questionId,
//       answer: q.selectedAnswer || ""
//     }));

//     try {
//       const res = await axios.post(
//         `http://localhost:5190/api/CandidateAnswerCheck/mcq/${applicationId}`,
//         {
//           questionCount: questions.length,
//           answers: answerData,
//         }
//       );

//       setResultData(res.data);
//     } catch (err) {
//       console.error("Error submitting answers:", err);
//     }
//   };

//   const formatTime = (seconds) => {
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return `${m}:${s < 10 ? '0' : ''}${s}`;
//   };

//   if (alreadyAttempted) {
//   return (
//     <div className="h-[500px]  flex items-center justify-center">
//     <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 text-center mx-auto border-2 border-blue-300">
//         <p className="text-red-500 font-normal mb-6">
//           You have already completed the pre-screening test. You can't retake it.
//         </p>
    
//       <div className="space-y-3 mt-6">
//         <button
//           className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center"
//           onClick={handleContinue}
//         >
//           Continue to Interviews
//         </button>
//         <button
//           className="w-full bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium flex items-center justify-center"
//           onClick={handleBackHome}
//         >
//           Back to Home
//         </button>
//       </div>
//     </div>
//     </div>
//   );
// };

//   if (questions.length === 0) return <div className="p-6">Loading questions...</div>;

//   const currentQuestion = questions[currentQuestionIndex];

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       {!testCompleted ? (
//         <div className="bg-white shadow-md rounded-lg p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold">
//               Question {currentQuestionIndex + 1} of {questions.length}
//             </h2>
//             <div className="flex items-center">
//               <FiClock className="text-red-500 mr-2" />
//               <span className="text-red-500 font-bold">{formatTime(timeRemaining)}</span>
//             </div>
//           </div>

//           <p className="text-lg mb-4">{currentQuestion.question}</p>

//           <div className="space-y-3">
//             {currentQuestion.options.map((option) => (
//               <button
//                 key={option.id}
//                 onClick={() => handleSelectAnswer(option.id)}
//                 className={`w-full text-left p-4 rounded-lg border transition
//                   ${currentQuestion.selectedAnswer === option.id
//                     ? 'bg-green-100 border-green-600 border-2 text-black'
//                     : 'bg-white border-gray-300 hover:border-blue-400'}`}
//               >
//                 <div className="flex justify-between items-center">
//                   <span>{option.text}</span>
//                   {currentQuestion.selectedAnswer === option.id && (
//                     <FiCheckCircle className="text-green-600" />
//                   )}
//                 </div>
//               </button>
//             ))}
//           </div>

//           <div className="flex justify-between mt-6">
//             <button
//               onClick={handlePrevious}
//               disabled={currentQuestionIndex === 0}
//               className="px-5 py-2 bg-gray-300 rounded disabled:opacity-50"
//             >
//               Previous
//             </button>

//             {currentQuestionIndex === questions.length - 1 ? (
//               <button
//                 onClick={handleSubmitTest}
//                 className="px-5 py-2 bg-green-600 text-white rounded"
//               >
//                 Submit
//               </button>
//             ) : (
//               <button
//                 onClick={handleNext}
//                 className="px-5 py-2 bg-blue-500 text-white rounded"
//               >
//                 Next
//               </button>
//             )}
//           </div>
//         </div>
//       ) : (
//         <div className="flex justify-center">
//           <CongratulationsCard
//             totalQuestions={resultData?.questionCount}
//             correctAnswers={resultData?.correctAnswersCount}
//             passMark={resultData?.pre_Screen_PassMark}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default TextAssessment;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import QuestionCard from '../../components/CandidateComponants/QuestionCard';
import TimerDisplay from '../../components/CandidateComponants/TimerDisplay';
import NavigationButtons from '../../components/CandidateComponants/NavigationButtons';
import AlreadyAttemptedCard from '../../components/CandidateComponants/AlreadyAttemptedCard';
import CongratulationsCard from '../../components/CandidateComponants/CongratulationsCard';

const TextAssessment = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [duration, setDuration] = useState(600);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
  if (!applicationId) return 0;  // fallback if no ID yet
  const storedIndex = localStorage.getItem(`currentIndex-${applicationId}`);
  return storedIndex ? parseInt(storedIndex, 10) : 0;
});

  const [timeRemaining, setTimeRemaining] = useState(600);
  const [testCompleted, setTestCompleted] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);

  const handleContinue = () => navigate('/candidate/interview');
  const handleBackHome = () => navigate('/');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`http://localhost:5190/api/CandidatePreScreenTest/Questions/${applicationId}`);

        if (res.data.status === "Longlist" || res.data.status === "Rejected") {
          setAlreadyAttempted(true);
          return;
        }

        const loadedQuestions = res.data.questions.map((q) => ({
          questionId: q.questionId,
          question: q.questionName,
          options: [
            { id: 'Option1', text: q.option1 },
            { id: 'Option2', text: q.option2 },
            { id: 'Option3', text: q.option3 },
            { id: 'Option4', text: q.option4 }
          ],
          selectedAnswer: null
        }));

        const totalDuration = res.data.duration * 60;
        setDuration(totalDuration);

        const storedQuestions = localStorage.getItem(`testQuestions-${applicationId}`);
        const storedIndex = localStorage.getItem(`currentIndex-${applicationId}`);
        const storedStartTime = localStorage.getItem(`testStartTime-${applicationId}`);

        if (storedQuestions) setQuestions(JSON.parse(storedQuestions));
        else setQuestions(loadedQuestions);

        if (storedIndex) setCurrentQuestionIndex(parseInt(storedIndex));

        let startTime = storedStartTime ? new Date(parseInt(storedStartTime)) : new Date();
        if (!storedStartTime) localStorage.setItem(`testStartTime-${applicationId}`, startTime.getTime());

        const now = new Date();
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        const remaining = totalDuration - elapsedSeconds;

        setTimeRemaining(remaining > 0 ? remaining : 0);
        if (remaining <= 0) handleSubmitTest();
      } catch (err) {
        console.error('Failed to fetch questions:', err);
      }
    };

    fetchQuestions();
  }, [applicationId]);

  useEffect(() => {
    if (timeRemaining > 0 && !testCompleted) {
      const timer = setTimeout(() => setTimeRemaining(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !testCompleted) {
      handleSubmitTest();
    }
  }, [timeRemaining, testCompleted]);

  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem(`testQuestions-${applicationId}`, JSON.stringify(questions));
    }
  }, [questions, applicationId]);

  useEffect(() => {
    localStorage.setItem(`currentIndex-${applicationId}`, currentQuestionIndex.toString());
  }, [currentQuestionIndex, applicationId]);

  const handleSelectAnswer = (answerId) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].selectedAnswer = answerId;
    setQuestions(updatedQuestions);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitTest = async () => {
    setTestCompleted(true);
    localStorage.removeItem(`testStartTime-${applicationId}`);
    localStorage.removeItem(`testQuestions-${applicationId}`);
    localStorage.removeItem(`currentIndex-${applicationId}`);

    const answerData = questions.map((q) => ({
      questionId: q.questionId,
      answer: q.selectedAnswer || ""
    }));

    try {
      const res = await axios.post(
        `http://localhost:5190/api/CandidateAnswerCheck/mcq/${applicationId}`,
        {
          questionCount: questions.length,
          answers: answerData,
        }
      );
      setResultData(res.data);
    } catch (err) {
      console.error("Error submitting answers:", err);
    }
  };

  if (alreadyAttempted) {
    return <AlreadyAttemptedCard onContinue={handleContinue} onBack={handleBackHome} />;
  }

  if (questions.length === 0) return <div className="p-6">Loading questions...</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto p-6">
      {!testCompleted ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
            <TimerDisplay time={timeRemaining} />
          </div>

          <QuestionCard
            question={currentQuestion}
            onSelectAnswer={handleSelectAnswer}
          />

          <NavigationButtons
            isFirst={currentQuestionIndex === 0}
            isLast={currentQuestionIndex === questions.length - 1}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmitTest}
          />
        </div>
      ) : (
        <div className="flex justify-center">
          <CongratulationsCard
            totalQuestions={resultData?.questionCount}
            correctAnswers={resultData?.correctAnswersCount}
            passMark={resultData?.pre_Screen_PassMark}
          />
        </div>
      )}
    </div>
  );
};

export default TextAssessment;

