import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const data = {
    labels: ["Scheduled", "Yet to Schedule", "Completed"],
    datasets: [
      {
        label: "Interview Status",
        data: [55, 30, 15],
        backgroundColor: ["#4F46E5", "#EC4899", "#FACC15"],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 20,
          padding: 10,
        },
      },
    },
  };

  return (
    <div className="flex flex-col w-full p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Interviews Scheduled This Month</h2>
      <div className="w-full h-80 max-w-2xl mx-auto pt-4">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChart;
