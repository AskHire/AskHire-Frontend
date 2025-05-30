import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const InterviewLoadChart = () => {
  const data = {
    labels: ['Manager A', 'Manager B', 'Manager C', 'Manager D', 'Manager E', 'Manager F', 'Manager G', 'Manager H'],
    datasets: [
      {
        label: 'Interviews Scheduled',
        data: [8, 5, 12, 7, 10, 6, 9, 4],
        backgroundColor: '#4F46E5',
        borderRadius: 5,
        barThickness: 50,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows dynamic resizing
    plugins: {
      legend: {
        display: false, // Hide legend
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide grid lines
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 ">Interviews Scheduled by Managers</h2>
      <div className="w-full h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default InterviewLoadChart;
