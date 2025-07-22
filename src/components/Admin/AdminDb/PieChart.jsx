import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ ageGroupData }) {
  if (!ageGroupData) return <p className="p-4">Loading chart...</p>;

  const labels = Object.keys(ageGroupData);
  const dataValues = Object.values(ageGroupData);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Users by Age Group",
        data: dataValues,
        backgroundColor: ["#4F46E5", "#EC4899", "#FACC15", "#10B981"],
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
      <h2 className="mb-4 text-lg font-bold text-gray-700">Users by Age Group</h2>
      <div className="w-full h-64 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}
