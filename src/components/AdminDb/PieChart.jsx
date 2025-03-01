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
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 mr-1 text-lg font-bold text-gray-700">New Candidates</h2>
        <div className="flex justify-center w-64 h-64">
            <Pie data={data} options={options} />
        </div>
    </div>
);
};

export default PieChart;
