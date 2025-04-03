import React, { useState } from "react";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import ManagerTopbar from "../../components/ManagerTopbar";
import { Link } from "react-router-dom";

const candidatesData = [
  { id: 1, name: "Nicholas Patrick", testMarks: 97, interviewStatus: "Interview Scheduled (12/30/2025 12:00pm)" },
  { id: 2, name: "Eshan Senadhi", testMarks: 95, interviewStatus: "Interview Scheduled (12/30/2025 12:30pm)" },
  { id: 3, name: "Eshan Senadhi", testMarks: 92, interviewStatus: "Interview Scheduled (12/30/2025 1:00pm)" },
  { id: 4, name: "Larissa Burton", testMarks: 90, interviewStatus: "Interview Scheduled (12/30/2025 1:30pm)" },
  { id: 5, name: "Larissa Burton", testMarks: 85, interviewStatus: "Schedule Interview" },
  { id: 6, name: "Nicholas Patrick", testMarks: 82, interviewStatus: "Interview Scheduled (14/30/2025 11:00am)" },
  { id: 7, name: "Eshan Senadhi", testMarks: 78, interviewStatus: "Schedule Interview" },
  { id: 8, name: "Eshan Senadhi", testMarks: 75, interviewStatus: "Schedule Interview" },
  { id: 9, name: "Larissa Burton", testMarks: 65, interviewStatus: "Schedule Interview" },
];

const LongList2 = () => {
  const [selectedVacancy, setSelectedVacancy] = useState("Software Engineer");

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
                  <div key={candidate.id} className="border border-gray-300 rounded-lg mb-3 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-12 items-center">
                      {/* Number Column */}
                      <div className="col-span-1 p-4 text-center md:text-left">
                        {index + 1}
                      </div>
                      
                      {/* Profile Column */}
                      <div className="col-span-1 p-4 flex justify-center md:justify-start">
                        {candidate.name.includes("Nicholas") ? (
                          <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-purple-700">NP</div>
                        ) : candidate.name.includes("Eshan") ? (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700">ES</div>
                        ) : (
                          <div className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center text-pink-700">LB</div>
                        )}
                      </div>
                      
                      {/* Name Column */}
                      <div className="col-span-3 p-4 text-center md:text-left">
                        {candidate.name}
                      </div>
                      
                      {/* Test Marks Column - Shifted left */}
                      <div className="col-span-2 p-4 text-center md:text-left pl-0 md:pl-2">
                        {candidate.testMarks}%
                      </div>
                      
                      {/* View Details Column */}
                      
                      <div className="col-span-2 p-4 flex justify-center md:justify-start">
                        <button className="bg-blue-600 text-white rounded-md px-4 py-1 text-sm">
                        <Link to="/manager/ViewDetails"> View Details</Link>
                        </button>
                      </div>
                     
                      {/* Interview Status Column - Shifted left */}
                      <div className="col-span-3 p-4 flex justify-center md:justify-start pl-0 md:pl-2">
                        {candidate.interviewStatus === "Schedule Interview" ? (
                          <button className="bg-blue-600 text-white rounded-md px-4 py-1 text-sm">
                             <Link to="/manager/InterviewSheduler">
                            Schedule Interview
                            </Link>
                          </button>
                        ) : (
                          <div className="flex items-center">
                            <div className="text-sm text-gray-600">{candidate.interviewStatus}</div>
                            <div className="ml-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">LS</div>
                          </div>
                        )}
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

export default LongList2;