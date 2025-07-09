// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Check } from 'lucide-react';

// const CongratulationsCard2 = () => {
//   const { applicationId } = useParams();
//   const [matchScore, setMatchScore] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchScore = async () => {
//       try {
//         const response = await fetch(`http://localhost:5190/api/CandidateFile/${applicationId}/cvmark`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch score');
//         }
//         const score = await response.json();
//         setMatchScore(score);
//       } catch (err) {
//         console.error('Error fetching score:', err);
//         setError(err.message);
//         setMatchScore(0);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (applicationId) {
//       fetchScore();
//     }
//   }, [applicationId]);

//   return (
//     <div className="bg-white shadow-lg rounded-2xl p-8 text-center w-full max-w-sm mx-auto border border-gray-200">
//       <div className="mb-6">
//         <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
//           <Check className="h-8 w-8 text-green-600" />
//         </div>
//         <h2 className="text-2xl font-bold mt-4 text-gray-800">Congratulations!</h2>
//         <p className="text-gray-500">Your CV has been submitted.</p>
//       </div>

//       <div className="bg-green-50 rounded-xl p-6 mb-6">
//         <div className="flex items-center justify-between mb-2">
//           <span className="text-sm font-medium text-gray-600">Match Score</span>
//           <div className="flex">
//             {[...Array(5)].map((_, i) => (
//               <span key={i} className="text-green-500 text-sm">★</span>
//             ))}
//           </div>
//         </div>
//         {loading ? (
//           <div className="text-2xl font-bold text-gray-400 mb-1">Loading...</div>
//         ) : error ? (
//           <div className="text-2xl font-bold text-red-500 mb-1">{error}</div>
//         ) : (
//           <div className="text-4xl font-bold text-green-600 mb-1">{matchScore}%</div>
//         )}
//       </div>

//       <button
//         onClick={() => navigate('/candidate/prescreen', { state: { applicationId } })}
//         className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
//       >
//         Continue to Pre-Screen Test
//       </button>
//     </div>
//   );
// };

// export default CongratulationsCard2;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const CongratulationsCard2 = () => {
  const { applicationId } = useParams();
  const [matchScore, setMatchScore] = useState(0);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5190/api/CandidateFile/${applicationId}/cv-status`);
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await res.json();
        setMatchScore(data.cV_Mark ?? 0);
        setStatus(data.status ?? '');
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        setMatchScore(0);
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      fetchData();
    }
  }, [applicationId]);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 text-center w-full max-w-sm mx-auto border border-gray-200">
      <div className="mb-6">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mt-4 text-gray-800">Congratulations!</h2>
        <p className="text-gray-500">Your CV has been submitted.</p>
      </div>

      <div className="bg-green-50 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Match Score</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-green-500 text-sm">★</span>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="text-2xl font-bold text-gray-400 mb-1">Loading...</div>
        ) : error ? (
          <div className="text-2xl font-bold text-red-500 mb-1">{error}</div>
        ) : (
          <div className="text-4xl font-bold text-green-600 mb-1">{matchScore}%</div>
        )}
      </div>

      {!loading && !error && status === 'CV Approved' ? (
        <button
          onClick={() => navigate('/candidate/prescreen', { state: { applicationId } })}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Continue to Pre-Screen Test
        </button>
      ) : (
        <button
          onClick={() => navigate('/')}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Back to Home
        </button>
      )}
    </div>
  );
};

export default CongratulationsCard2;

