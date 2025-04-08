import { BiDotsVerticalRounded } from "react-icons/bi";
import { useState } from 'react';

const interviews = [
  {
    id: 1,
    profileImg: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'Nicholas Patrick',
    vacancy: 'UX Engineer',
    date: '2024-12-12',
    time: '23:38',
  },
  {
    id: 2,
    profileImg: 'https://randomuser.me/api/portraits/men/33.jpg',
    name: 'Eshan Senadhi',
    vacancy: 'Front-End Developer',
    date: '2024-12-12',
    time: '22:38',
  },
  {
    id: 3,
    profileImg: 'https://randomuser.me/api/portraits/men/34.jpg',
    name: 'Eshan Senadhi',
    vacancy: 'Back-End Developer',
    date: '2024-12-12',
    time: '22:41',
  },
  {
    id: 4,
    profileImg: 'https://randomuser.me/api/portraits/women/32.jpg',
    name: 'Larissa Burton',
    vacancy: 'Front-End Developer',
    date: '2024-12-12',
    time: '20:20',
  },
  {
    id: 5,
    profileImg: 'https://randomuser.me/api/portraits/women/33.jpg',
    name: 'Larissa Burton',
    vacancy: 'Front-End Developer',
    date: '2024-12-12',
    time: '20:20',
  },
];

const Interviews = () => {
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="p-4 ">
      {/* Header Section */}
      <div className="flex items-center justify-end mb-4">
        {!showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="text-blue-600 hover:underline"
          >
            View All
          </button>
        )}
      </div>

      {/* Table Header */}
        <div className="hidden grid-cols-5 px-4 py-2 text-sm font-semibold rounded-lg md:grid">
          <span className="pl-20">Profile</span>
          <span>Name</span>
          <span>Vacancy</span>
          <span className="pl-20">Date</span>
          <span>Time</span>
        </div>

        {/* Interview List */}
      <div className="mt-2 space-y-3">
        {(showAll ? interviews : interviews.slice(0, 4)).map((interview) => (
          <div
            key={interview.id}
            className="grid items-center grid-cols-5 p-3 bg-white rounded-lg shadow-sm hover:bg-gray-100"
          >
            {/* Profile Image */}
            <div className="flex justify-center col-span-1">
              <img
                src={interview.profileImg}
                alt={interview.name}
                className="w-10 h-10 border border-gray-300 rounded-full"
              />
            </div>

            {/* Name */}
            <p className="font-medium text-gray-800">{interview.name}</p>

            {/* Vacancy */}
            <p className="text-sm text-gray-500">{interview.vacancy}</p>

            {/* Date */}
            <p className="text-sm text-center text-gray-500">{interview.date}</p>

            {/* Time & More Button */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-green-600">{interview.time}</span>
              <button className="text-gray-500 hover:text-gray-700">
                <BiDotsVerticalRounded className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Interviews;
