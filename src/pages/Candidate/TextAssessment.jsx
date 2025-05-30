// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { FiClock, FiCheckCircle } from 'react-icons/fi';
// // import CongratulationsCard from '../../components/CongratulationsCard';
// // import { useParams } from 'react-router-dom';

// // const TextAssessment = () => {
// //   const { applicationId } = useParams();
// //   const [questions, setQuestions] = useState([]);
// //   const [duration, setDuration] = useState(600);
// //   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
// //   const [timeRemaining, setTimeRemaining] = useState(600);
// //   const [testCompleted, setTestCompleted] = useState(false);
// //   const [resultData, setResultData] = useState(null);

// //   useEffect(() => {
// //     const fetchQuestions = async () => {
// //       try {
// //         const res = await axios.get(`http://localhost:5190/api/CandidatePreScreenTest/Questions/${applicationId}`);
// //         const loadedQuestions = res.data.questions.map((q) => ({
// //           questionId: q.questionId,
// //           question: q.questionName,
// //           options: [
// //             { id: 'Option1', text: q.option1 },
// //             { id: 'Option2', text: q.option2 },
// //             { id: 'Option3', text: q.option3 },
// //             { id: 'Option4', text: q.option4 }
// //           ],
// //           selectedAnswer: null
// //         }));
// //         setQuestions(loadedQuestions);

// //         const totalDuration = res.data.duration * 60;
// //         setDuration(totalDuration);
// //         setTimeRemaining(totalDuration);
// //       } catch (err) {
// //         console.error('Failed to fetch questions:', err);
// //       }
// //     };

// //     fetchQuestions();
// //   }, []);

// //   useEffect(() => {
// //     if (timeRemaining > 0 && !testCompleted) {
// //       const timer = setTimeout(() => setTimeRemaining(prev => prev - 1), 1000);
// //       return () => clearTimeout(timer);
// //     } else if (timeRemaining === 0 && !testCompleted) {
// //       handleSubmitTest();
// //     }
// //   }, [timeRemaining, testCompleted]);

// //   const handleSelectAnswer = (answerId) => {
// //     const updatedQuestions = [...questions];
// //     updatedQuestions[currentQuestionIndex].selectedAnswer = answerId;
// //     setQuestions(updatedQuestions);
// //   };

// //   const handleNext = () => {
// //     if (currentQuestionIndex < questions.length - 1) {
// //       setCurrentQuestionIndex(prev => prev + 1);
// //     }
// //   };

// //   const handlePrevious = () => {
// //     if (currentQuestionIndex > 0) {
// //       setCurrentQuestionIndex(prev => prev - 1);
// //     }
// //   };

// //   const handleSubmitTest = async () => {
// //     setTestCompleted(true);
// //     const answerData = questions.map((q) => ({
// //       questionId: q.questionId,
// //       answer: q.selectedAnswer || ""
// //     }));

// //     try {
// //       const res = await axios.post(
// //         `http://localhost:5190/api/CandidateAnswerCheck/mcq/${applicationId}`,
// //         {
// //           questionCount: questions.length,
// //           answers: answerData,
// //         }
// //       );

// //       setResultData(res.data);
// //     } catch (err) {
// //       console.error("Error submitting answers:", err);
// //     }
// //   };

// //   const formatTime = (seconds) => {
// //     const m = Math.floor(seconds / 60);
// //     const s = seconds % 60;
// //     return `${m}:${s < 10 ? '0' : ''}${s}`;
// //   };

// //   if (questions.length === 0) return <div className="p-6">Loading questions...</div>;

// //   const currentQuestion = questions[currentQuestionIndex];

// //   return (
// //     <div className="max-w-3xl mx-auto p-6">
// //       {!testCompleted ? (
// //         <div className="bg-white shadow-md rounded-lg p-6">
// //           <div className="flex justify-between items-center mb-4">
// //             <h2 className="text-xl font-semibold">
// //               Question {currentQuestionIndex + 1} of {questions.length}
// //             </h2>
// //             <div className="flex items-center">
// //               <FiClock className="text-red-500 mr-2" />
// //               <span className="text-red-500 font-bold">{formatTime(timeRemaining)}</span>
// //             </div>
// //           </div>

// //           <p className="text-lg mb-4">{currentQuestion.question}</p>

// //           <div className="space-y-3">
// //             {currentQuestion.options.map((option) => (
// //               <button
// //                 key={option.id}
// //                 onClick={() => handleSelectAnswer(option.id)}
// //                 className={`w-full text-left p-4 rounded-lg border transition
// //                   ${currentQuestion.selectedAnswer === option.id
// //                     ? 'bg-green-100 border-green-600 border-2 text-black'
// //                     : 'bg-white border-gray-300 hover:border-blue-400'}`}
// //               >
// //                 <div className="flex justify-between items-center">
// //                   <span>{option.text}</span>
// //                   {currentQuestion.selectedAnswer === option.id && (
// //                     <FiCheckCircle className="text-green-600" />
// //                   )}
// //                 </div>
// //               </button>
// //             ))}
// //           </div>

// //           <div className="flex justify-between mt-6">
// //             <button
// //               onClick={handlePrevious}
// //               disabled={currentQuestionIndex === 0}
// //               className="px-5 py-2 bg-gray-300 rounded disabled:opacity-50"
// //             >
// //               Previous
// //             </button>

// //             {currentQuestionIndex === questions.length - 1 ? (
// //               <button
// //                 onClick={handleSubmitTest}
// //                 className="px-5 py-2 bg-green-600 text-white rounded"
// //               >
// //                 Submit
// //               </button>
// //             ) : (
// //               <button
// //                 onClick={handleNext}
// //                 className="px-5 py-2 bg-blue-500 text-white rounded"
// //               >
// //                 Next
// //               </button>
// //             )}
// //           </div>
// //         </div>
// //       ) : (
// //         <div className="flex justify-center">
// //           <CongratulationsCard
// //             totalQuestions={resultData?.questionCount}
// //             correctAnswers={resultData?.correctAnswersCount}
// //             passMark={resultData?.pre_Screen_PassMark}
// //             status={resultData?.status}
// //           />
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default TextAssessment;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FiClock, FiCheckCircle } from 'react-icons/fi';
// import CongratulationsCard from '../../components/CongratulationsCard';
// import { useParams } from 'react-router-dom';

// const TextAssessment = () => {
//   const { applicationId } = useParams();
//   const [questions, setQuestions] = useState([]);
//   const [duration, setDuration] = useState(600); // Default fallback
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
//           handleSubmitTest(); // Automatically submit if time already over
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
//             status={resultData?.status}
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
// import { HiArrowRight, HiQuestionMarkCircle, HiChartBar } from 'react-icons/hi';
// import { FaCheck } from 'react-icons/fa';
// import { useParams, useNavigate } from 'react-router-dom';

// const TextAssessment = () => {
//   const { applicationId } = useParams();
//   const navigate = useNavigate();

//   const [questions, setQuestions] = useState([]);
//   const [duration, setDuration] = useState(600);
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
//           handleSubmitTest(); // Automatically submit if time already over
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

//   const handleContinue = () => {
//     navigate('/candidate/interview');
//   };

//   const handleBackHome = () => {
//     navigate('/');
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
//         <div className="bg-white shadow-lg rounded-lg p-6 text-center w-full max-w-md mx-auto border-2 border-blue-300">
//           <div className="mb-6">
//             <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
//               <HiCheckCircle className="h-8 w-8 text-blue-500" />
//             </div>
//             <h2 className="text-2xl font-bold mt-2 text-blue-600">Congratulations!</h2>
//           </div>

//           <div className="grid grid-cols-1 gap-4 mb-6">
//             <div className="bg-blue-100 rounded-lg p-4">
//               <div className="flex items-center justify-center mb-2">
//                 <HiQuestionMarkCircle className="h-6 w-6 text-blue-600" />
//               </div>
//               <p className="text-2xl font-bold text-blue-600">{resultData?.questionCount}</p>
//               <p className="text-blue-600 text-sm">Total Questions</p>
//             </div>

//             <div className="bg-purple-100 rounded-lg p-4">
//               <div className="flex items-center justify-center mb-2">
//                 <FaCheck className="h-6 w-6 text-purple-600" />
//               </div>
//               <p className="text-2xl font-bold text-purple-600">{resultData?.correctAnswersCount}</p>
//               <p className="text-purple-600 text-sm">Correct Answers</p>
//             </div>

//             <div className="bg-green-100 rounded-lg p-4">
//               <div className="flex items-center justify-center mb-2">
//                 <HiChartBar className="h-6 w-6 text-green-600" />
//               </div>
//               <p className="text-2xl font-bold text-green-600">{resultData?.pre_Screen_PassMark}%</p>
//               <p className="text-green-600 text-sm">Your Score</p>
//             </div>
//           </div>

//           <div className="flex flex-col gap-3">
//             <button
//               className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium"
//               onClick={handleContinue}
//             >
//               Continue to Interviews
//             </button>
//             <button
//               className="w-full bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium"
//               onClick={handleBackHome}
//             >
//               Back to Home
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TextAssessment;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiClock, FiCheckCircle } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import CongratulationsCard from '../../components/CongratulationsCard'; // Keep path relative to your project

const TextAssessment = () => {
  const { applicationId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [duration, setDuration] = useState(600); // default fallback
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [testCompleted, setTestCompleted] = useState(false);
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`http://localhost:5190/api/CandidatePreScreenTest/Questions/${applicationId}`);
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
        setQuestions(loadedQuestions);

        const totalDuration = res.data.duration * 60;
        setDuration(totalDuration);

        const storedStartTime = localStorage.getItem(`testStartTime-${applicationId}`);
        let startTime;

        if (storedStartTime) {
          startTime = new Date(parseInt(storedStartTime));
        } else {
          startTime = new Date();
          localStorage.setItem(`testStartTime-${applicationId}`, startTime.getTime());
        }

        const now = new Date();
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        const remaining = totalDuration - elapsedSeconds;

        setTimeRemaining(remaining > 0 ? remaining : 0);
        if (remaining <= 0) {
          handleSubmitTest();
        }
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

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

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
            <div className="flex items-center">
              <FiClock className="text-red-500 mr-2" />
              <span className="text-red-500 font-bold">{formatTime(timeRemaining)}</span>
            </div>
          </div>

          <p className="text-lg mb-4">{currentQuestion.question}</p>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelectAnswer(option.id)}
                className={`w-full text-left p-4 rounded-lg border transition
                  ${currentQuestion.selectedAnswer === option.id
                    ? 'bg-green-100 border-green-600 border-2 text-black'
                    : 'bg-white border-gray-300 hover:border-blue-400'}`}
              >
                <div className="flex justify-between items-center">
                  <span>{option.text}</span>
                  {currentQuestion.selectedAnswer === option.id && (
                    <FiCheckCircle className="text-green-600" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-5 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmitTest}
                className="px-5 py-2 bg-green-600 text-white rounded"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-5 py-2 bg-blue-500 text-white rounded"
              >
                Next
              </button>
            )}
          </div>
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
