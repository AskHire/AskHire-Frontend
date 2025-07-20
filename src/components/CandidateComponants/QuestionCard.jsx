import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

const QuestionCard = ({ question, onSelectAnswer }) => {
  return (
    <div>
      <p className="text-lg mb-4">{question.question}</p>
      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelectAnswer(option.id)}
            className={`w-full text-left p-4 rounded-lg border transition
              ${question.selectedAnswer === option.id
                ? 'bg-green-100 border-green-600 border-2 text-black'
                : 'bg-white border-gray-300 hover:border-blue-400'}`}
          >
            <div className="flex justify-between items-center">
              <span>{option.text}</span>
              {question.selectedAnswer === option.id}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
