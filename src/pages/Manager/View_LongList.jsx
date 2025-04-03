import React, { useState, useEffect } from "react";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import ManagerTopbar from "../../components/ManagerTopbar";
import { Link, useNavigate } from "react-router-dom";  // <-- Import useNavigate

const View_LongList = () => {
  const [selectedVacancy, setSelectedVacancy] = useState("Software Engineer");
  const [candidatesData, setCandidatesData] = useState([]);
  const navigate = useNavigate();  // <-- Initialize navigate

  // Fetch data from backend API
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch("https://localhost:7256/api/Candidates");
        const data = await response.json();
        setCandidatesData(data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  const handleLsClick = (applicationId, status) => {
    // Open the scheduler form for both scheduling and editing
    navigate(`/manager/InterviewScheduler/${applicationId}?edit=${status !== "Schedule Interview"}`);
  };
  

  return (
    <div className="bg-gray-100 flex-auto min-h-screen">
      <ManagerTopbar />
      <div className="p-4 bg-gray-50 min-h-screen shadow-lg w-full">
        {/* Select Vacancy Container */}
        <div className="bg-white rounded-xl shadow-md mb-4 border border-blue-500">
          <div className="relative p-4">
            <h3 className="text-xl font-bold mb-4 md:mb-0">Select Vacancy</h3>
            <div className="flex justify-center">
              <div className="flex items-center border border-gray-600 rounded-full px-5 py-2 w-full max-w-lg sm:max-w-xl md:max-w-2xl">
                <SearchIcon className="w-5 h-5 text-gray-500 mr-3" />
                <input type="text" value={selectedVacancy} readOnly className="w-full outline-none text-black font-semibold" />
                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Software Engineer List Container */}
        <div className="bg-white rounded-xl shadow-md border border-blue-500">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Software Engineer</h2>
              <button className="text-blue-600 font-medium">View All</button>
            </div>

            {/* Candidate Table */}
            <div className="overflow-x-auto">
              <div className="mb-4">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 mb-2 px-4">
                  <div className="col-span-1 text-left">#</div>
                  <div className="col-span-1 text-left">Profile</div>
                  <div className="col-span-3 text-left">Name</div>
                  <div className="col-span-2 text-left">Test Marks</div>
                  <div className="col-span-2 text-left">View Details</div>
                  <div className="col-span-3 text-left">Schedule Interview</div>
                </div>

                {/* Candidate Rows */}
                {candidatesData.map((candidate, index) => (
                  <div key={candidate.applicationId} className="border border-gray-300 rounded-lg mb-3 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-12 items-center">
                      {/* Number Column */}
                      <div className="col-span-1 p-4 text-center md:text-left">
                        {index + 1}
                      </div>

                      {/* Profile Column */}
                      <div className="col-span-1 p-4 flex justify-center md:justify-start">
                        {/* Display candidate initials based on name */}
                        <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-purple-700">
                          {candidate.user.firstName.charAt(0)}
                          {candidate.user.lastName.charAt(0)}
                        </div>
                      </div>

                      {/* Name Column */}
                      <div className="col-span-3 p-4 text-center md:text-left">
                        {candidate.user.firstName} {candidate.user.lastName}
                      </div>

                      {/* Test Marks Column */}
                      <div className="col-span-2 p-4 text-center md:text-left pl-0 md:pl-2">
                        {candidate.cvMark}%
                      </div>

                      {/* View Details Column */}
                      <div className="col-span-2 p-4 flex justify-center md:justify-start">
                        <button className="bg-blue-600 text-white rounded-md px-4 py-1 text-sm">
                          <Link to={`/manager/ViewDetails/${candidate.applicationId}`} className="text-white">
                            View Details
                          </Link>
                        </button>
                      </div>

                      {/* Interview Status Column */}
                      <div className="col-span-3 p-4 flex justify-center md:justify-start pl-0 md:pl-2">
  <button
    onClick={() => handleLsClick(candidate.applicationId, candidate.status)}
    className={`rounded-md px-4 py-1 text-sm ${
      candidate.status === "Schedule Interview" ? "bg-blue-600 text-white" : "border border-blue-600 text-blue-600"
    }`}
  >
    {candidate.status === "Schedule Interview" ? "Schedule Interview" : "Edit"}
  </button>
</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule Long-List Interviews Button */}
            <div className="mt-6 flex justify-center">
              <button className="px-6 py-2 bg-blue-600 text-white text-sm md:text-base rounded-full hover:bg-blue-700 transition-colors">
                <Link to="/manager/LongListInterviewSheduler">
                  Schedule Long-List Interviews
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View_LongList;
