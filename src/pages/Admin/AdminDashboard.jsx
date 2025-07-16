import { useState, useEffect } from "react";
import { FaUsers, FaBriefcase } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa6";
import { RiFileUserFill } from "react-icons/ri";
import axios from "axios";
import BarChart from "../../components/Admin/AdminDb/BarChart";
import PieChart from "../../components/Admin/AdminDb/PieChart";
import VacancyTrackingTable from "../../components/Admin/AdminDb/VacancyTrackingTable";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCandidates: 0,
    totalManagers: 0,
    totalJobs: 0,
    signupsPerMonth: Array(12).fill(0),
    usersByAgeGroup: {},
  });

  useEffect(() => {
  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get("http://localhost:5190/api/AdminDashboard");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    }
    }; fetchDashboardStats();
  }, []);

  return (
    <div className="flex-1 p-4 md:p-6">
      <h1 className="mt-3 text-2xl font-bold md:text-3xl">Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<FaUsers className="w-16 h-16 p-2 text-green-500 bg-green-200 rounded-full" />}
          title="Total Users"
          value={stats.totalUsers}
        />
        <StatCard
          icon={<RiFileUserFill className="w-16 h-16 p-2 text-blue-500 bg-blue-200 rounded-full" />}
          title="Total Candidates"
          value={stats.totalCandidates}
        />
        <StatCard
          icon={<FaUserTie className="w-16 h-16 p-2 text-pink-500 bg-pink-200 rounded-full" />}
          title="Total Managers"
          value={stats.totalManagers}
        />
        <StatCard
          icon={<FaBriefcase className="w-16 h-16 p-2 text-yellow-500 bg-yellow-200 rounded-full" />}
          title="Total Jobs"
          value={stats.totalJobs}
        /> 
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow-md lg:col-span-2">
          <BarChart signupsPerMonth={stats.signupsPerMonth} />
        </div>
        <div className="bg-white rounded-lg shadow-md">
          <PieChart ageGroupData={stats.usersByAgeGroup}/>
        </div>
      </div>

      {/* Vacancy Tracking */}
      <div className="mt-10">
        <div className="mt-4">
          <VacancyTrackingTable />
        </div>
      </div>
    </div>
  );
}

// StatCard Component
function StatCard({ icon, title, value }) {
  return (
    <div className="flex items-center h-40 p-4 mt-4 space-x-4 bg-white rounded-lg shadow-md">
      <div className="text-3xl">{icon}</div>
      <div>
        <h4 className="text-xl font-semibold">{title}</h4>
        <p className="text-2xl font-bold text-center">{value}</p>
      </div>
    </div>
  );
}