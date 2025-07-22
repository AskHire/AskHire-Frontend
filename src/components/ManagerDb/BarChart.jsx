import React, { useEffect, useState } from 'react';
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
  const [weekLabels, setWeekLabels] = useState([]);
  const [interviewCounts, setInterviewCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format date as 'YYYY-MM-DD' in local time (no UTC shift)
  const toLocalIsoDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5190/api/manager-dashboard/weekly-interview-count");
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();

        const today = new Date();
        const day = today.getDay(); // 0 (Sun) - 6 (Sat)
        const monday = new Date(today);
        monday.setDate(today.getDate() - ((day + 6) % 7));
        monday.setHours(0, 0, 0, 0);

        const labels = [];
        const counts = [];

        for (let i = 0; i < 7; i++) {
          const currentDate = new Date(monday);
          currentDate.setDate(monday.getDate() + i);

          const isoDate = toLocalIsoDate(currentDate);

          const label = `${currentDate.toLocaleDateString('en-US', { weekday: 'short' })} (${currentDate.getDate()})`;
          labels.push(label);
          counts.push(data[isoDate] || 0);
        }

        setWeekLabels(labels);
        setInterviewCounts(counts);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch interview data", err);
        setError('Failed to load interview data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading interview data...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const data = {
    labels: weekLabels,
    datasets: [
      {
        label: 'Interviews Scheduled',
        data: interviewCounts,
        backgroundColor: '#4F46E5',
        borderRadius: 6,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        precision: 0,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="p-4 rounded-lg bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">Interviews This Week</h2>
      <div className="w-full h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default InterviewLoadChart;
