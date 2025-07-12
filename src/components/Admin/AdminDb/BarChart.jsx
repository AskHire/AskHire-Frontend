import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const getNiceStep = (max) => {
  if (max <= 10) return 1;
  if (max <= 25) return 5;
  if (max <= 50) return 10;
  if (max <= 100) return 20;
  if (max <= 250) return 50;
  if (max <= 500) return 100;
  return 200; // fallback for very large numbers
};

const BarChart = ({ signupsPerMonth = Array(12).fill(0) }) => {
  const labels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const rawData = signupsPerMonth;

  const maxValue = Math.max(...rawData);
  const stepSize = getNiceStep(maxValue);
  const axisTop = Math.ceil(maxValue / stepSize) * stepSize;

  const data = {
    labels,
    datasets: [
      {
        label: "Users",
        data: rawData,
        backgroundColor: "#4F46E5",
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        max: axisTop,
        ticks: { stepSize },
      },
    },
  };

  return (
    <div className="p-4 rounded-lg">
      <h2 className="mb-2 text-lg font-bold text-gray-700">Users Overview</h2>
      <div className="w-full min-h-[20rem]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
