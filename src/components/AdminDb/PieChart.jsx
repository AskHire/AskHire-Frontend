import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  // Sample data for the Pie chart
  const data = {
    labels: ["Active Users", "Inactive Users", "New Users"],
    datasets: [
      {
        label: "User Distribution",
        data: [55, 30, 15], 
        backgroundColor: ["#4F46E5", "#EC4899", "#FACC15"], // Tailwind colors
        hoverOffset: 4, // Slight separation on hover
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Ensures dynamic resizing
    plugins: {
      legend: {
        position: "bottom", // Display legend at the bottom
        labels: {
          boxWidth: 20, // Width of the colored box
          padding: 10, // Padding between legend items
        },
      },
    },
  };

  return (
    <div className="flex flex-col w-full p-4 rounded-lg ">
      <h2 className="mb-4 text-lg font-bold text-gray-700">New Candidates</h2>
      <div className="w-full h-64 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChart;
