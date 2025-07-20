import React from 'react';

const AlreadyAttemptedCard = ({ onContinue, onBack }) => {
  return (
    <div className="h-[500px] flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 text-center mx-auto border-2 border-blue-300">
        <p className="text-red-500 font-normal mb-6">
          You have already completed the pre-screening test. You can't retake it.
        </p>

        <div className="space-y-3 mt-6">
          <button
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium"
            onClick={onContinue}
          >
            Continue to Interviews
          </button>
          <button
            className="w-full bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium"
            onClick={onBack}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlreadyAttemptedCard;
