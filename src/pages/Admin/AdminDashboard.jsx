import { FaUsers, FaUserCircle, FaSuitcase, FaChartPie, FaBell, FaBriefcase } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa6";
import { RiFileUserFill } from "react-icons/ri";
import BarChart from "../../components/AdminDb/BarChart";
import Interviews from "../../components/AdminDb/Interviews";
import { IoIosSearch } from "react-icons/io";
import PieChart from "../../components/AdminDb/PieChart";

export default function Dashboard() {
  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Search jobs"
            className="w-full p-2 pl-10 border border-gray-300 shadow-xl rounded-3xl"
          />
          <IoIosSearch className="absolute text-gray-600 transform -translate-y-1/2 left-3 top-1/2" />
        </div>
        <div className="flex space-x-8">
          <FaBell className="text-2xl text-black" />
          <FaUserCircle className="text-2xl text-black" />
        </div>
      </div>

      {/* Admin Dashboard */}
      <div>
        <h1 className="mt-8 text-3xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Cards */}
      <div className="grid h-40 grid-cols-4 gap-6 mt-10">
        <StatCard icon={<FaUsers className="w-16 h-16 p-2 text-green-500 bg-green-200 rounded-full" />} title="Total Users" value="451" growth={<span className="text-black"><span className="text-green-500">37.8%</span> this month</span>}/>
        <StatCard icon={<RiFileUserFill className="w-16 h-16 p-2 text-blue-500 bg-blue-200 rounded-full" />} title="Total Candidates" value="201" growth={<span className="text-black"><span className="text-red-500">2%</span> this month</span>}/>
        <StatCard icon={<FaUserTie className="w-16 h-16 p-2 text-pink-500 bg-pink-200 rounded-full" />} title="Total Managers" value="250" growth={<span className="text-black"><span className="text-green-500">11%</span> this month</span>} />
        <StatCard icon={<FaBriefcase className="w-16 h-16 p-2 text-yellow-500 bg-yellow-200 rounded-full" />} title="Total Jobs" value="20" growth={<span className="text-black"><span className="text-green-500">11%</span> this month</span>} />
      </div>

      {/* Charts */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="col-span-2">
            <BarChart />
          </div>
          <div>
            <PieChart />
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div>
          <h1 className="mt-10 text-lg font-bold">Upcoming Interviews</h1>
        </div>
       
        <div >
          <Interviews />
        </div>
    </div>
  );
}

function StatCard({ icon, title, value, growth }) {
  return (
    <div className="flex items-center p-4 space-x-4 bg-white rounded-lg shadow-md">
      <div className="text-3xl text-blue-500">{icon}</div>
      <div>
        <h4 className="text-xl font-semibold">{title}</h4>
        <p className="text-2xl font-bold">{value}</p>
        <span className="text-sm ">{growth}</span>
      </div>
    </div>
  );
}