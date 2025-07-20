import React from 'react';

const NavigationButtons = ({
  isFirst,
  isLast,
  onPrevious,
  onNext,
  onSubmit,
}) => {
  return (
    <div className="flex justify-between mt-6">
      <button
        onClick={onPrevious}
        disabled={isFirst}
        className="px-5 py-2 bg-gray-300 rounded disabled:opacity-50"
      >
        Previous
      </button>

      {isLast ? (
        <button
          onClick={onSubmit}
          className="px-5 py-2 bg-green-600 text-white rounded"
        >
          Submit
        </button>
      ) : (
        <button
          onClick={onNext}
          className="px-5 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;
