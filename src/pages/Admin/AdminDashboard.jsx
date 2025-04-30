import React, { useState, useEffect } from "react";
import { FaUsers, FaBriefcase } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa6";
import { RiFileUserFill } from "react-icons/ri";
import axios from "axios";
import BarChart from "../../components/AdminDb/BarChart";
import Interviews from "../../components/AdminDb/Interviews";
import PieChart from "../../components/AdminDb/PieChart";
import AdminHeader from "../../components/AdminHeader";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCandidates: 0,
    totalManagers: 0,
    totalAdmins: 0,
    totalJobs: 0
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get("http://localhost:5190/api/AdminDashboard"); // Update URL
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="flex-1 p-4 md:p-6">
      <AdminHeader />
      <h1 className="mt-8 text-2xl font-bold md:text-3xl">Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<FaUsers className="w-12 h-12 p-2 text-green-500 bg-green-200 rounded-full" />}
          title="Total Users"
          value={stats.totalUsers}
          growth={<span className="text-black">+37.8% this month</span>}
        />
        <StatCard
          icon={<RiFileUserFill className="w-12 h-12 p-2 text-blue-500 bg-blue-200 rounded-full" />}
          title="Total Candidates"
          value={stats.totalCandidates}
          growth={<span className="text-black">+2% this month</span>}
        />
        <StatCard
          icon={<FaUserTie className="w-12 h-12 p-2 text-pink-500 bg-pink-200 rounded-full" />}
          title="Total Managers"
          value={stats.totalManagers}
          growth={<span className="text-black">+11% this month</span>}
        />
        <StatCard
          icon={<FaBriefcase className="w-12 h-12 p-2 text-yellow-500 bg-yellow-200 rounded-full" />}
          title="Total Jobs"
          value={stats.totalJobs}
          growth={<span className="text-black">+11% this month</span>}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow-md lg:col-span-2">
          <BarChart />
        </div>
        <div className="bg-white rounded-lg shadow-md">
          <PieChart />
        </div>
      </div>

      {/* Upcoming Interviews */}
      <div className="mt-10">
        <h1 className="text-lg font-bold">Upcoming Interviews</h1>
        <div className="mt-4">
          <Interviews />
        </div>
      </div>
    </div>
  );
}

// StatCard Component
function StatCard({ icon, title, value, growth }) {
  return (
    <div className="flex items-center h-40 p-4 mt-6 space-x-4 bg-white rounded-lg shadow-md">
      <div className="text-3xl">{icon}</div>
      <div>
        <h4 className="text-lg font-semibold">{title}</h4>
        <p className="text-xl font-bold">{value}</p>
        <span className="text-sm">{growth}</span>
      </div>
    </div>
  );
}
