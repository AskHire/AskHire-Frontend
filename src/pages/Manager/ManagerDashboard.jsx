import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { FiUsers, FiCalendar, FiBriefcase, FiFileText } from 'react-icons/fi';
import Calendar from '../../components/Calendar';
import ManagerTopbar from '../../components/ManagerTopbar';

const ManagerDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
  const [dashboardData, setDashboardData] = useState({
    totalJobs: null,
    totalUsers: null,
    interviewsToday: 5,
    pendingReviews: 11
  });

  useEffect(() => {
    // Combine API calls into a single effect for better organization
    const fetchDashboardData = async () => {
      try {
        const [jobsResponse, usersResponse] = await Promise.all([
          axios.get('http://localhost:5190/api/manager-dashboard/total-jobs'),
          axios.get('http://localhost:5190/api/manager-dashboard/total-candidates')
        ]);
        
        setDashboardData(prev => ({
          ...prev,
          totalJobs: jobsResponse.data,
          totalUsers: usersResponse.data
        }));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  // Stats cards data
  const statsData = [
    {
      id: 1,
      title: 'Total Candidates',
      count: dashboardData.totalUsers ?? '...',
      // change: '+7 this month',
      icon: <FiUsers className="text-4xl" />,
      bgColor: 'bg-green-100',
      textColor: 'text-green-700'
    },
    {
      id: 2,
      title: 'Interviews Today',
      count: dashboardData.interviewsToday,
      // change: '3% this day',
      icon: <FiCalendar className="text-4xl" />,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700'
    },
    {
      id: 3,
      title: 'Total Job Vacancies',
      count: dashboardData.totalJobs ?? '...',
      // change: '10% this week',
      icon: <FiBriefcase className="text-4xl" />,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700'
    },
    {
      id: 4,
      title: 'Pending Reviews',
      count: dashboardData.pendingReviews,
      // change: '8% this week',
      icon: <FiFileText className="text-4xl" />,
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-700'
    }
  ];

  const pieData = [
    { name: 'New Candidates', value: 21, color: '#FF41A1' },
    { name: 'Other', value: 79, color: '#5932EA' }
  ];

  const monthlyData = [
    { name: 'Jan', value: 40 }, { name: 'Feb', value: 50 },
    { name: 'Mar', value: 70 }, { name: 'Apr', value: 60 },
    { name: 'May', value: 80 }, { name: 'Jun', value: 60 },
    { name: 'Jul', value: 70 }, { name: 'Aug', value: 120 },
    { name: 'Sep', value: 60 }, { name: 'Oct', value: 80 },
    { name: 'Nov', value: 50 }, { name: 'Dec', value: 60 }
  ];

  // Reusable card component to reduce repetitive markup
  const Card = ({ children, className = "" }) => (
    <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );

  const StatCard = ({ stat }) => (
    <div className={`p-4 rounded-lg shadow-md ${stat.bgColor}`}>
      <div className={stat.textColor}>{stat.icon}</div>
      <h2 className="text-2xl font-bold mt-2">{stat.count}</h2>
      <p className="text-gray-600">{stat.title}</p>
      <span className="text-sm text-gray-500">{stat.change}</span>
    </div>
  );

  return (
    <div className="flex-1 pt-1 pb-4 pr-6 pl-6">
      <div className="pb-4">
        <ManagerTopbar />
      </div>
      <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map(stat => <StatCard key={stat.id} stat={stat} />)}
      </div>

      {/* Calendar & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Calendar and Reminders</h2>
          <p className="text-sm text-gray-500 mb-4">Click on a date to add a reminder</p>
          <Calendar />
        </Card>

        <Card>
          <h2 className="text-xl font-semibold">Total Interviews</h2>
          <p className="text-gray-500 text-sm">Candidates that you process</p>
          <div className="flex justify-center mt-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie 
                  data={pieData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value"
                >
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
        </Card>
      </div>

      {/* Candidates Overview */}
      <Card className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Candidates Overview</h2>
            <p className="text-gray-500 text-sm">{selectedPeriod}</p>
          </div>
          <button
            className="bg-gray-200 px-3 py-1 rounded"
            onClick={() => setSelectedPeriod(prev => prev === 'Monthly' ? 'Quarterly' : 'Monthly')}
          >
            {selectedPeriod} ▼
          </button>
        </div>

        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ 
                backgroundColor: '#fff', 
                borderRadius: '4px', 
                border: '1px solid #ddd', 
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' 
              }} />
              <Bar dataKey="value" fill="#5932EA" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default ManagerDashboard;