import React, { useState } from 'react';
import Calendar from '../../components/Calendar';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { FiUsers, FiCalendar, FiBriefcase, FiFileText } from 'react-icons/fi'; // Import icons
import ManagerTopbar from '../../components/ManagerTopbar';

const ManagerDashboard = () => {
  const [currentMonth, setCurrentMonth] = useState('May 2023');
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');

  const statsData = [
    { 
      id: 1, 
      title: 'Total Candidates', 
      count: 451, 
      change: '+7 this month', 
      icon: <FiUsers className="text-4xl" />, // Use FiUsers icon
      bgColor: 'bg-green-100', 
      textColor: 'text-green-700' 
    },
    { 
      id: 2, 
      title: 'Interviews Today', 
      count: 5, 
      change: '3% this day', 
      icon: <FiCalendar className="text-4xl" />, // Use FiCalendar icon
      bgColor: 'bg-blue-100', 
      textColor: 'text-blue-700' 
    },
    { 
      id: 3, 
      title: 'Total Jobs', 
      count: 20, 
      change: '10% this week', 
      icon: <FiBriefcase className="text-4xl" />, // Use FiBriefcase icon
      bgColor: 'bg-yellow-100', 
      textColor: 'text-yellow-700' 
    },
    { 
      id: 4, 
      title: 'Pending Reviews', 
      count: 11, 
      change: '8% this week', 
      icon: <FiFileText className="text-4xl" />, // Use FiFileText icon
      bgColor: 'bg-pink-100', 
      textColor: 'text-pink-700' 
    }
  ];

  const pieData = [
    { name: 'New Candidates', value: 21, color: '#FF41A1' },
    { name: 'Other', value: 79, color: '#5932EA' }
  ];

  const monthlyData = [
    { name: 'Jan', value: 40 },
    { name: 'Feb', value: 50 },
    { name: 'Mar', value: 70 },
    { name: 'Apr', value: 60 },
    { name: 'May', value: 80 },
    { name: 'Jun', value: 60 },
    { name: 'Jul', value: 70 },
    { name: 'Aug', value: 120 },
    { name: 'Sep', value: 60 },
    { name: 'Oct', value: 80 },
    { name: 'Nov', value: 50 },
    { name: 'Dec', value: 60 }
  ];

  return (
    <div className="bg-gray-100 flex-auto min-h-screen">
      <ManagerTopbar />
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => (
          <div key={stat.id} className={`p-4 rounded-lg shadow-md ${stat.bgColor}`}>
            <div className={`${stat.textColor}`}>{stat.icon}</div> {/* Render the icon */}
            <h2 className="text-2xl font-bold mt-2">{stat.count}</h2>
            <p className="text-gray-600">{stat.title}</p>
            <span className="text-sm text-gray-500">{stat.change}</span>
          </div>
        ))}
      </div>

      {/* Calendar & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Calendar */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">{currentMonth}</h2>
          <div className="flex justify-between mb-4">
            <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setCurrentMonth('April 2023')}>←</button>
            <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setCurrentMonth('June 2023')}>→</button>
          </div>
          <Calendar month={currentMonth} />
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Total Interviews</h2>
          <p className="text-gray-500 text-sm">Candidates that you process</p>
          <div className="flex justify-center mt-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-2">
            <span className="text-2xl font-bold text-pink-600">21%</span>
            <p className="text-gray-500 text-sm">Total New Candidates</p>
          </div>
        </div>
      </div>

      {/* Candidates Overview */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Candidates Overview</h2>
            <p className="text-gray-500 text-sm">{selectedPeriod}</p>
          </div>
          <button className="bg-gray-200 px-3 py-1 rounded" onClick={() => setSelectedPeriod(selectedPeriod === 'Monthly' ? 'Quarterly' : 'Monthly')}>
            {selectedPeriod} ▼
          </button>
        </div>

        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} />
              <Bar dataKey="value" fill="#5932EA" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ManagerDashboard;