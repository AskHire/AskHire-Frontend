import React from 'react';
import { FiClock } from 'react-icons/fi';

const TimerDisplay = ({ time }) => {
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex items-center">
      <FiClock className="text-red-500 mr-2" />
      <span className="text-red-500 font-bold">{formatTime(time)}</span>
    </div>
  );
};

export default TimerDisplay;
