// import React, { useState, useEffect } from 'react';
// import { 
//   FiClock, 
//   FiCheckCircle, 
//   FiXCircle, 
//   FiRefreshCw 
// } from 'react-icons/fi';

// const TextPreScreen = () => {
//   // Mock MCQ questions
//   const [questions, setQuestions] = useState([
//     {
//       id: 1,
//       question: "Which data structure uses LIFO (Last In, First Out) principle?",
//       options: [
//         { id: 'a', text: "Queue" },
//         { id: 'b', text: "Stack" },
//         { id: 'c', text: "Array" },
//         { id: 'd', text: "Linked List" }
//       ],
//       correctAnswer: 'b',
//       selectedAnswer: null
//     },
//     {
//       id: 2,
//       question: "What is the time complexity of binary search?",
//       options: [
//         { id: 'a', text: "O(n)" },
//         { id: 'b', text: "O(log n)" },
//         { id: 'c', text: "O(n^2)" },
//         { id: 'd', text: "O(1)" }
//       ],
//       correctAnswer: 'b',
//       selectedAnswer: null
//     },
//     {
//       id: 3,
//       question: "Which of the following is not a type of software testing?",
//       options: [
//         { id: 'a', text: "Unit Testing" },
//         { id: 'b', text: "Integration Testing" },
//         { id: 'c', text: "Compiler Testing" },
//         { id: 'd', text: "System Testing" }
//       ],
//       correctAnswer: 'c',
//       selectedAnswer: null
//     },
//     {
//       id: 4,
//       question: "What does API stand for?",
//       options: [
//         { id: 'a', text: "Advanced Programming Interface" },
//         { id: 'b', text: "Application Programming Interface" },
//         { id: 'c', text: "Automated Programming Interaction" },
//         { id: 'd', text: "Application Process Integration" }
//       ],
//       correctAnswer: 'b',
//       selectedAnswer: null
//     },
//     {
//       id: 5,
//       question: "Which programming language is primarily used for machine learning?",
//       options: [
//         { id: 'a', text: "Java" },
//         { id: 'b', text: "C++" },
//         { id: 'c', text: "Python" },
//         { id: 'd', text: "JavaScript" }
//       ],
//       correctAnswer: 'c',
//       selectedAnswer: null
//     }
//   ]);

//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
//   const [testCompleted, setTestCompleted] = useState(false);

//   // Timer logic
//   useEffect(() => {
//     if (timeRemaining > 0 && !testCompleted) {
//       const timer = setTimeout(() => {
//         setTimeRemaining(prev => prev - 1);
//       }, 1000);
//       return () => clearTimeout(timer);
//     } else if (timeRemaining === 0) {
//       handleSubmitTest();
//     }
//   }, [timeRemaining, testCompleted]);

//   // Select answer for current question
//   const handleSelectAnswer = (answerId) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[currentQuestionIndex].selectedAnswer = answerId;
//     setQuestions(updatedQuestions);
//   };

//   // Navigate between questions
//   const handleNextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//     }
//   };

//   const handlePreviousQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(prev => prev - 1);
//     }
//   };

//   // Submit test
//   const handleSubmitTest = () => {
//     setTestCompleted(true);
//   };

//   // Format time
//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
//   };

//   // Calculate test results
//   const calculateResults = () => {
//     const correctAnswers = questions.filter(
//       q => q.selectedAnswer === q.correctAnswer
//     ).length;
//     const percentage = (correctAnswers / questions.length) * 100;

//     return {
//       totalQuestions: questions.length,
//       correctAnswers,
//       incorrectAnswers: questions.length - correctAnswers,
//       percentage: percentage.toFixed(2)
//     };
//   };

//   // Render current question
//   const renderCurrentQuestion = () => {
//     const currentQuestion = questions[currentQuestionIndex];

//     return (
//       <div className="bg-white shadow-lg rounded-lg p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold">
//             Question {currentQuestionIndex + 1} of {questions.length}
//           </h2>
//           <div className="flex items-center">
//             <FiClock className="mr-2 text-red-500" />
//             <span className="font-bold text-red-500">
//               {formatTime(timeRemaining)}
//             </span>
//           </div>
//         </div>

//         <p className="text-lg mb-6">{currentQuestion.question}</p>

//         <div className="space-y-4">
//           {currentQuestion.options.map((option) => (
//             <button
//               key={option.id}
//               onClick={() => handleSelectAnswer(option.id)}
//               className={`
//                 w-full text-left p-4 rounded-lg border-2 transition-all
//                 ${currentQuestion.selectedAnswer === option.id
//                   ? 'bg-blue-100 border-blue-500 text-blue-700'
//                   : 'bg-white border-gray-300 hover:border-blue-400'}
//               `}
//             >
//               <div className="flex justify-between items-center">
//                 <span>{option.text}</span>
//                 {currentQuestion.selectedAnswer === option.id && (
//                   <FiCheckCircle className="text-blue-500" />
//                 )}
//               </div>
//             </button>
//           ))}
//         </div>

//         <div className="flex justify-between mt-6">
//           <button
//             onClick={handlePreviousQuestion}
//             disabled={currentQuestionIndex === 0}
//             className={`
//               px-6 py-3 rounded-lg
//               ${currentQuestionIndex === 0 
//                 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
//                 : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}
//             `}
//           >
//             Previous
//           </button>
//           <button
//             onClick={handleNextQuestion}
//             disabled={currentQuestionIndex === questions.length - 1}
//             className={`
//               px-6 py-3 rounded-lg
//               ${currentQuestionIndex === questions.length - 1
//                 ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                 : 'bg-blue-600 text-white hover:bg-blue-700'}
//             `}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     );
//   };

//   // Render question progress
//   const renderQuestionProgress = () => {
//     return (
//         <div className="bg-white shadow-md rounded-lg p-4">
//         <h3 className="text-lg font-semibold mb-4">Question Progress</h3>
//         <div className="grid grid-cols-5 gap-2">
//           {questions.map((question, index) => (
//             <button
//               key={question.id}
//               onClick={() => setCurrentQuestionIndex(index)}
//               className={`
//                 w-10 h-10 rounded-full
//                 ${currentQuestionIndex === index 
//                   ? 'bg-blue-600 text-white' 
//                   : question.selectedAnswer 
//                     ? 'bg-green-500 text-white' 
//                     : 'bg-gray-200 text-gray-600'}
//               `}
//             >
//               {index + 1}
//             </button>
//           ))}
//         </div>
//         <div className="mt-4 text-sm text-gray-600">
//           <p>Completed: {questions.filter(q => q.selectedAnswer).length} / {questions.length}</p>
//         </div>
//         <button 
//           onClick={handleSubmitTest}
//           className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
//         >
//           Submit Test
//         </button>
//       </div>
//     );
//   };

//   // Render test results
//   const renderTestResults = () => {
//     const results = calculateResults();

//     return (
//       <div className='flex justify-center'>
//         <div className="bg-white shadow-lg rounded-lg p-8 text-center">
//         <h1 className="text-3xl font-bold mb-6 text-green-600">Test Completed</h1>
        
//         <div className="grid md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-blue-50 p-4 rounded-lg">
//             <h3 className="text-lg font-semibold">Total Questions</h3>
//             <p className="text-2xl font-bold">{results.totalQuestions}</p>
//           </div>
//           <div className="bg-green-50 p-4 rounded-lg">
//             <h3 className="text-lg font-semibold">Correct Answers</h3>
//             <p className="text-2xl font-bold text-green-600">{results.correctAnswers}</p>
//           </div>
//           <div className="bg-red-50 p-4 rounded-lg">
//             <h3 className="text-lg font-semibold">Incorrect Answers</h3>
//             <p className="text-2xl font-bold text-red-600">{results.incorrectAnswers}</p>
//           </div>
//         </div>

//         <div className="bg-gray-100 p-6 rounded-lg mb-8">
//           <h3 className="text-xl font-semibold mb-4">Your Score</h3>
//           <div className="text-4xl font-bold text-blue-600">{results.percentage}%</div>
//         </div>

//         <button 
//           onClick={() => window.location.reload()}
//           className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center mx-auto"
//         >
//           <FiRefreshCw className="mr-2" /> Retake Test
//         </button>
//       </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-fit bg-gray-50 py-10">
//     <div className="max-w-7xl mx-auto flex space-x-6">
//       {!testCompleted ? (
//         <>
//           <div className="w-3/4">{renderCurrentQuestion()}</div>
//           <div className="w-1/4">{renderQuestionProgress()}</div>
//         </>
//       ) : (
//         <div className="w-full">{renderTestResults()}</div>
//       )}
//     </div>
//   </div>
  
//   );
// };

// export default TextPreScreen;

// import React, { useEffect, useState } from "react";

// function TextPreScreen() {
//   const [questions, setQuestions] = useState([]);

//   useEffect(() => {
//     fetch("https://localhost:7256/api/Question")
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to fetch questions");
//         }
//         return response.json();
//       })
//       .then((data) => setQuestions(data))
//       .catch((error) => console.error("Error fetching data:", error));
//   }, []);

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Pre-Screen Questions</h1>
//       {questions.length > 0 ? (
//         <ul className="space-y-4">
//           {questions.map((q) => (
//             <li key={q.questionId} className="border p-4 rounded-lg shadow">
//               <h2 className="text-lg font-semibold">{q.jobRole.jobTitle}</h2>
//               <p className="text-sm text-gray-600">{q.jobRole.description}</p>
//               <p className="font-medium">Select the correct answer:</p>
//               <ul className="list-disc pl-6">
//                 <li>{q.option1}</li>
//                 <li>{q.option2}</li>
//                 <li>{q.option3}</li>
//                 <li>{q.option4}</li>
//               </ul>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>Loading questions...</p>
//       )}
//     </div>
//   );
  
// }

// export default TextPreScreen;

// import React, { useState, useEffect } from 'react';
// import { FiClock, FiCheckCircle } from 'react-icons/fi';

// const TextPreScreen = () => {
//   const jobId = 'AEB03CC8-909F-41E0-A3C9-87C71E6248DA'; // Hardcoded job ID
//   const [question, setQuestion] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes

//   useEffect(() => {
//     setLoading(true);
//     fetch(`https://localhost:7256/api/Question/JobRole/${jobId}`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Failed to fetch question');
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setQuestion(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         setError(error.message);
//         setLoading(false);
//       });
//   }, []);

//   useEffect(() => {
//     if (timeRemaining > 0) {
//       const timer = setTimeout(() => {
//         setTimeRemaining((prev) => prev - 1);
//       }, 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [timeRemaining]);

//   const handleSelectAnswer = (answerId) => {
//     setSelectedAnswer(answerId);
//   };

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
//   };

//   if (loading) return <div className="text-center p-8">Loading question...</div>;
//   if (error) return <div className="text-center p-8 text-red-600">Error: {error}</div>;
//   if (!question) return <div className="text-center p-8">No question available for this job role.</div>;

//   const options = [
//     { id: 'option1', text: question.option1 },
//     { id: 'option2', text: question.option2 },
//     { id: 'option3', text: question.option3 },
//     { id: 'option4', text: question.option4 }
//   ];

//   return (
//     <div className="min-h-fit bg-gray-50 py-10">
//       <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold">
//             Pre-Screen Question for {question.jobRole?.jobTitle || 'This Position'}
//           </h2>
//           <div className="flex items-center">
//             <FiClock className="mr-2 text-red-500" />
//             <span className="font-bold text-red-500">{formatTime(timeRemaining)}</span>
//           </div>
//         </div>

//         <p className="text-lg mb-6">{question.questionText || 'Select the correct answer from below options:'}</p>

//         <div className="space-y-4">
//           {options.map((option) => (
//             <button
//               key={option.id}
//               onClick={() => handleSelectAnswer(option.id)}
//               className={`w-full text-left p-4 rounded-lg border-2 transition-all
//                 ${
//                   selectedAnswer === option.id
//                     ? 'bg-blue-100 border-blue-500 text-blue-700'
//                     : 'bg-white border-gray-300 hover:border-blue-400'
//                 }`}
//             >
//               <div className="flex justify-between items-center">
//                 <span>{option.text}</span>
//                 {selectedAnswer === option.id && <FiCheckCircle className="text-blue-500" />}
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TextPreScreen;


import React, { useState, useEffect } from 'react';
import { 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiRefreshCw 
} from 'react-icons/fi';
import axios from 'axios';

const API_BASE_URL = 'https://localhost:7125/api'; // Update with your actual API URL

const PreScreenTest = ({ applicationId }) => {
  // State for questions loaded from API
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use the prop or fallback to a mock application ID for testing
  const currentApplicationId = applicationId || '00000000-0000-0000-0000-000000000000';

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/Questions/prescreen/${currentApplicationId}`);
        
        // Transform API response to match our state structure
        const transformedQuestions = response.data.map(q => ({
          id: q.questionId,
          question: q.question,
          options: q.options.map(opt => ({
            id: opt.id,
            text: opt.text
          })),
          correctAnswer: null, // We don't get this from API for security
          selectedAnswer: null
        }));
        
        setQuestions(transformedQuestions);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load test questions. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [currentApplicationId]);

  // Timer logic
  useEffect(() => {
    if (timeRemaining > 0 && !testCompleted && !isLoading && questions.length > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !testCompleted && questions.length > 0) {
      handleSubmitTest();
    }
  }, [timeRemaining, testCompleted, isLoading, questions]);

  // Select answer for current question
  const handleSelectAnswer = (answerId) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].selectedAnswer = answerId;
    setQuestions(updatedQuestions);
  };

  // Navigate between questions
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Submit test to API
  const handleSubmitTest = async () => {
    try {
      // Prepare submission data
      const submission = {
        applicationId: currentApplicationId,
        answers: questions.map(q => ({
          questionId: q.id,
          selectedAnswer: q.selectedAnswer || '' // Send empty string if no answer selected
        })),
        timeSpent: 600 - timeRemaining // Calculate time spent
      };

      // Submit to API
      const response = await axios.post(`${API_BASE_URL}/Questions/submit`, submission);
      
      // Set results
      setTestResults(response.data);
      setTestCompleted(true);
    } catch (err) {
      console.error('Error submitting test:', err);
      setError('Failed to submit test. Please try again.');
    }
  };

  // Format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Loading state
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
      <div className="text-lg font-semibold">Loading questions...</div>
    </div>;
  }

  // Error state
  if (error) {
    return <div className="flex justify-center items-center h-64">
      <div className="text-lg font-semibold text-red-600">{error}</div>
    </div>;
  }

  // Render current question
  const renderCurrentQuestion = () => {
    if (questions.length === 0) return null;
    
    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          <div className="flex items-center">
            <FiClock className="mr-2 text-red-500" />
            <span className="font-bold text-red-500">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        <p className="text-lg mb-6">{currentQuestion.question}</p>

        <div className="space-y-4">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelectAnswer(option.id)}
              className={`
                w-full text-left p-4 rounded-lg border-2 transition-all
                ${currentQuestion.selectedAnswer === option.id
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 hover:border-blue-400'}
              `}
            >
              <div className="flex justify-between items-center">
                <span>{option.text}</span>
                {currentQuestion.selectedAnswer === option.id && (
                  <FiCheckCircle className="text-blue-500" />
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`
              px-6 py-3 rounded-lg
              ${currentQuestionIndex === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}
            `}
          >
            Previous
          </button>
          <button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
            className={`
              px-6 py-3 rounded-lg
              ${currentQuestionIndex === questions.length - 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'}
            `}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  // Render question progress
  const renderQuestionProgress = () => {
    return (
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Question Progress</h3>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((question, index) => (
            <button
              key={question.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`
                w-10 h-10 rounded-full
                ${currentQuestionIndex === index 
                  ? 'bg-blue-600 text-white' 
                  : question.selectedAnswer 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600'}
              `}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>Completed: {questions.filter(q => q.selectedAnswer).length} / {questions.length}</p>
        </div>
        <button 
          onClick={handleSubmitTest}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Submit Test
        </button>
      </div>
    );
  };

  // Render test results
  const renderTestResults = () => {
    if (!testResults) return null;

    return (
      <div className='flex justify-center'>
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <h1 className="text-3xl font-bold mb-6 text-green-600">Test Completed</h1>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Total Questions</h3>
              <p className="text-2xl font-bold">{testResults.totalQuestions}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Correct Answers</h3>
              <p className="text-2xl font-bold text-green-600">{testResults.correctAnswers}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Incorrect Answers</h3>
              <p className="text-2xl font-bold text-red-600">
                {testResults.totalQuestions - testResults.correctAnswers}
              </p>
            </div>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-4">Your Score</h3>
            <div className="text-4xl font-bold text-blue-600">{testResults.percentage}%</div>
            <div className="mt-4 text-lg">
              {testResults.passed ? (
                <div className="text-green-600 font-semibold">You passed the test!</div>
              ) : (
                <div className="text-red-600 font-semibold">You did not meet the required score.</div>
              )}
            </div>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center mx-auto"
          >
            <FiRefreshCw className="mr-2" /> Retake Test
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-fit bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:space-x-6">
        {!testCompleted ? (
          <>
            <div className="w-full md:w-3/4">{renderCurrentQuestion()}</div>
            <div className="w-full md:w-1/4 mt-4 md:mt-0">{renderQuestionProgress()}</div>
          </>
        ) : (
          <div className="w-full">{renderTestResults()}</div>
        )}
      </div>
    </div>
  );
};

export default PreScreenTest;

