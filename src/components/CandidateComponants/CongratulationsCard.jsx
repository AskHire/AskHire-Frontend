// import React from 'react';
// import { HiCheckCircle, HiXCircle, HiArrowRight, HiQuestionMarkCircle, HiChartBar } from 'react-icons/hi';
// import { FaStar, FaCheck } from 'react-icons/fa';
// import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
// import { useNavigate } from 'react-router-dom';

// const CongratulationsCard = ({ totalQuestions, correctAnswers, passMark, status }) => {
//   const navigate = useNavigate();

//   const handleButtonClick = () => {
//     if (status === 'pass') {
//       navigate('/candidate/interview');  // Redirect to the interview page
//     } else {
//       navigate('/');  // Redirect to the home page
//     }
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-6 text-center w-full max-w-md mx-auto border-2 border-blue-300">
//       {status === 'pass' ? (
//         <div className="mb-4">
//           <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
//             <HiCheckCircle className="h-8 w-8 text-green-500" />
//           </div>
//           <h2 className="text-2xl font-bold mt-2 text-green-600">Congratulations!</h2>
//         </div>
//       ) : (
//         <div className="mb-4">
//           <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
//             <HiXCircle className="h-8 w-8 text-red-500" />
//           </div>
//           <h2 className="text-2xl font-bold mt-2 text-red-600">Not Eligible</h2>
//         </div>
//       )}

//       {/* Match Score Section */}
//       <div className="bg-green-100 rounded-lg p-4 mb-4">
//         <div className="flex justify-between items-center">
//           <span className="text-green-800">Match Score</span>
//           <div className="flex">
//             {[...Array(5)].map((_, index) => (
//               <FaStar key={index} className="text-yellow-500" />
//             ))}
//           </div>
//         </div>
//         <div className="text-3xl font-bold text-green-800">{passMark}%</div>
//       </div>

//       {/* Score Details Section */}
//       <div className="grid grid-cols-2 gap-4 mb-4">
//         <div className="bg-blue-100 rounded-lg p-4">
//           <div className="flex items-center justify-center mb-2">
//             <HiQuestionMarkCircle className="h-6 w-6 text-blue-600" />
//           </div>
//           <p className="text-2xl font-bold text-blue-600">{totalQuestions}</p>
//           <p className="text-blue-600 text-sm">Total Questions</p>
//         </div>

//         <div className="bg-purple-100 rounded-lg p-4">
//           <div className="flex items-center justify-center mb-2">
//             <FaCheck className="h-6 w-6 text-purple-600" />
//           </div>
//           <p className="text-2xl font-bold text-purple-600">{correctAnswers}</p>
//           <p className="text-purple-600 text-sm">Correct Answers</p>
//         </div>

//         <div className="bg-green-100 rounded-lg p-4">
//           <div className="flex items-center justify-center mb-2">
//             <HiChartBar className="h-6 w-6 text-green-600" />
//           </div>
//           <p className="text-2xl font-bold text-green-600">{passMark}%</p>
//           <p className="text-green-600 text-sm">Your Score</p>
//         </div>

//         <div className={`${status === 'pass' ? 'bg-green-100' : 'bg-red-100'} rounded-lg p-4`}>
//           <div className="flex items-center justify-center mb-2">
//             {status === 'pass' ? (
//               <AiOutlineCheck className="h-6 w-6 text-green-600" />
//             ) : (
//               <AiOutlineClose className="h-6 w-6 text-red-600" />
//             )}
//           </div>
//           <p className={`text-2xl font-bold ${status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
//             {status === 'pass' ? 'Pass' : 'Fail'}
//           </p>
//           <p className={`${status === 'pass' ? 'text-green-600' : 'text-red-600'} text-sm`}>Status</p>
//         </div>
//       </div>

//       {/* Continue Button */}
//       <button 
//         className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center"
//         onClick={handleButtonClick}
//       >
//         <HiArrowRight className="h-5 w-5 mr-2" />
//         {status === 'pass' ? 'Continue to Interviews' : 'Back to Home'}
//       </button>
//     </div>
//   );
// };

// export default CongratulationsCard;

// import React from 'react';
// import { HiArrowRight } from 'react-icons/hi';
// import { useNavigate } from 'react-router-dom';
// import { HiCheckCircle,HiQuestionMarkCircle } from 'react-icons/hi';
// import { FaCheck } from 'react-icons/fa';
// import { HiChartBar } from 'react-icons/hi';

// const CongratulationsCard = ({ totalQuestions, correctAnswers, passMark }) => {
//   const navigate = useNavigate();

//   const handleContinue = () => {
//     navigate('/candidate/interview');
//   };

//   const handleBackHome = () => {
//     navigate('/');
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-6 text-center w-full max-w-md mx-auto border-2 border-blue-300">
//       <div className="mb-6">
//         <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
//           <HiCheckCircle className="h-8 w-8 text-blue-500" />
//         </div>
//         <h2 className="text-2xl font-bold mt-2 text-blue-600">Test Completed</h2>
//       </div>

//       {/* Score Summary */}
//       <div className="grid grid-cols-1 gap-4 mb-6">
//         <div className="bg-green-100 rounded-lg p-4">
//           <div className="flex items-center justify-center mb-2">
//             <HiChartBar className="h-6 w-6 text-green-600" />
//           </div>
//           <p className="text-2xl font-bold text-green-600">{passMark}%</p>
//           <p className="text-green-600 text-sm">Your Score</p>
//         </div>
//         <div className="bg-blue-100 rounded-lg p-4">
//           <div className="flex items-center justify-center mb-2">
//             <HiQuestionMarkCircle className="h-6 w-6 text-blue-600" />
//           </div>
//           <p className="text-2xl font-bold text-blue-600">{totalQuestions}</p>
//           <p className="text-blue-600 text-sm">Total Questions</p>
//         </div>

//         <div className="bg-purple-100 rounded-lg p-4">
//           <div className="flex items-center justify-center mb-2">
//             <FaCheck className="h-6 w-6 text-purple-600" />
//           </div>
//           <p className="text-2xl font-bold text-purple-600">{correctAnswers}</p>
//           <p className="text-purple-600 text-sm">Correct Answers</p>
//         </div>

        
//       </div>

//       {/* Buttons */}
//       <div className="flex flex-col gap-3">
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
//   );
// };

// export default CongratulationsCard;

import React from 'react';
import { HiArrowRight } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { HiCheckCircle, HiQuestionMarkCircle } from 'react-icons/hi';
import { FaCheck } from 'react-icons/fa';
import { HiChartBar } from 'react-icons/hi';

const CongratulationsCard = ({ totalQuestions, correctAnswers, passMark, loading, error }) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/candidate/interview');
  };

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 text-center w-full max-w-md mx-auto border-2 border-blue-300">
      {loading ? (
        <div className="text-xl font-semibold text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-xl font-semibold text-red-500">{error}</div>
      ) : (
        <>
          <div className="mb-6">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <HiCheckCircle className="h-8 w-8 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mt-2 text-blue-600">Test Completed</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="bg-green-100 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <HiChartBar className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">{passMark}%</p>
              <p className="text-green-600 text-sm">Your Score</p>
            </div>

            <div className="bg-blue-100 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <HiQuestionMarkCircle className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{totalQuestions}</p>
              <p className="text-blue-600 text-sm">Total Questions</p>
            </div>

            <div className="bg-purple-100 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <FaCheck className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">{correctAnswers}</p>
              <p className="text-purple-600 text-sm">Correct Answers</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center"
              onClick={handleContinue}
            >
              Continue to Interviews
            </button>
            <button
              className="w-full bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium flex items-center justify-center"
              onClick={handleBackHome}
            >
              Back to Home
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CongratulationsCard;

