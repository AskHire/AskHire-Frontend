import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiClock, FiCheckCircle } from 'react-icons/fi';
import CongratulationsCard from '../../components/CongratulationsCard';

const applicationId = 'D3A48EFD-AA80-4126-88DE-85CD916838A2';

const TextAssessment = () => {
  const [questions, setQuestions] = useState([]);
  const [duration, setDuration] = useState(600);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [testCompleted, setTestCompleted] = useState(false);
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`http://localhost:5190/api/PreScreenTest/Questions/${applicationId}`);
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
        setTimeRemaining(totalDuration);
      } catch (err) {
        console.error('Failed to fetch questions:', err);
      }
    };

    fetchQuestions();
  }, []);

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
    const answerData = questions.map((q) => ({
      questionId: q.questionId,
      answer: q.selectedAnswer || ""
    }));

    try {
      const res = await axios.post(
        `http://localhost:5190/api/AnswerCheck/mcq/${applicationId}`,
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
            status={resultData?.status}
          />
        </div>
      )}
    </div>
  );
};

export default TextAssessment;
