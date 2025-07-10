import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const [dataCounts, setDataCounts] = useState({
    scheduled: 0,
    yetToSchedule: 0,
    completed: 15,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5190/api/Application/interview-status-summary");
        setDataCounts({
          scheduled: response.data.scheduledCount,
          yetToSchedule: response.data.yetToScheduleCount,
          completed: response.data.completedCount,
        });
      } catch (error) {
        console.error("Error fetching interview summary", error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: ["Scheduled", "Yet to Schedule", "Completed"],
    datasets: [
      {
        label: "Interview Status",
        data: [dataCounts.scheduled, dataCounts.yetToSchedule, dataCounts.completed],
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
