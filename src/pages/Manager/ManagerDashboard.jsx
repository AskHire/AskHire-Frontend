import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUsers, FiCalendar, FiBriefcase, FiFileText } from 'react-icons/fi';
import Calendar from '../../components/Calendar';
import ManagerTopbar from '../../components/ManagerTopbar';
import PieChart from '../../components/ManagerDb/PieChart';
import InterviewLoadChart from '../../components/ManagerDb/BarChart';

const ManagerDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [jobsResponse, usersResponse, InterviewResponse] = await Promise.all([
          axios.get('http://localhost:5190/api/manager-dashboard/total-jobs'),
          axios.get('http://localhost:5190/api/manager-dashboard/total-candidates'),
          axios.get('http://localhost:5190/api/manager-dashboard/total-interviews-today'),
        ]);

        setDashboardData(prev => ({
          ...prev,
          totalJobs: jobsResponse.data,
          totalUsers: usersResponse.data,
          interviewsToday: InterviewResponse.data
        }));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const statsData = [
    {
      id: 1,
      title: 'Total Candidates',
      count: dashboardData.totalUsers ?? '...',
      icon: <FiUsers className="text-4xl" />,
      bgColor: 'bg-green-100',
      textColor: 'text-green-700'
    },
    {
      id: 2,
      title: 'Interviews Today',
      count: dashboardData.interviewsToday ?? '...',
      icon: <FiCalendar className="text-4xl" />,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700'
    },
    {
      id: 3,
      title: 'Total Job Vacancies',
      count: dashboardData.totalJobs ?? '...',
      icon: <FiBriefcase className="text-4xl" />,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700'
    },
    {
      id: 4,
      title: 'Pending Reviews',
      count: dashboardData.pendingReviews ?? '...',
      icon: <FiFileText className="text-4xl" />,
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-700'
    }
  ];

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

      {/* Pie Chart & Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <PieChart />
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">Interview Overview</h2>
              <p className="text-gray-500 text-sm">This Week</p>
            </div>
          </div>

          <InterviewLoadChart />
        </Card>
      </div>

      {/* Calendar */}
      <Card className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Calendar and Reminders</h2>
        <p className="text-sm text-gray-500 mb-4">Click on a date to add a reminder</p>
        <Calendar />
      </Card>
    </div>
  );
};

export default ManagerDashboard;