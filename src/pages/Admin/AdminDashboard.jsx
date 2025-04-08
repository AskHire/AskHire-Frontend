import { FaUsers, FaBriefcase } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa6";
import { RiFileUserFill } from "react-icons/ri";
import BarChart from "../../components/AdminDb/BarChart";
import Interviews from "../../components/AdminDb/Interviews";
import PieChart from "../../components/AdminDb/PieChart";
import AdminHeader from "../../components/AdminHeader";

export default function Dashboard() {
  return (
    <div className="flex-1 p-4 md:p-6">
      {/* Admin Header */}
      <AdminHeader />

      {/* Admin Dashboard Title */}
      <h1 className="mt-8 text-2xl font-bold md:text-3xl">Admin Dashboard</h1>

      {/* Cards Section */}
      <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<FaUsers className="w-12 h-12 p-2 text-green-500 bg-green-200 rounded-full" />}
          title="Total Users"
          value="451"
          growth={<span className="text-black"><span className="text-green-500">37.8%</span> this month</span>}
        />
        <StatCard
          icon={<RiFileUserFill className="w-12 h-12 p-2 text-blue-500 bg-blue-200 rounded-full" />}
          title="Total Candidates"
          value="201"
          growth={<span className="text-black"><span className="text-red-500">2%</span> this month</span>}
        />
        <StatCard
          icon={<FaUserTie className="w-12 h-12 p-2 text-pink-500 bg-pink-200 rounded-full" />}
          title="Total Managers"
          value="250"
          growth={<span className="text-black"><span className="text-green-500">11%</span> this month</span>}
        />
        <StatCard
          icon={<FaBriefcase className="w-12 h-12 p-2 text-yellow-500 bg-yellow-200 rounded-full" />}
          title="Total Jobs"
          value="20"
          growth={<span className="text-black"><span className="text-green-500">11%</span> this month</span>}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3 ">
        <div className="bg-white rounded-lg shadow-md lg:col-span-2">
          <BarChart />
        </div>
        <div className="bg-white rounded-lg shadow-md">
          <PieChart />
        </div>
      </div>

      {/* Upcoming Interviews Section */}
      <div className="mt-10">
        <h1 className="text-lg font-bold">Upcoming Interviews</h1>
        <div className="mt-4">
          <Interviews />
        </div>
      </div>
    </div>
  );
}

// Reusable StatCard Component
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

