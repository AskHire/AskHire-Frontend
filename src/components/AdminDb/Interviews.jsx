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

  const handleViewAll = () => {
    setShowAll(true);
  };

  return (
    <div>
      <br></br> 
      <br></br>
      <div className="space-y-4">
        {(showAll ? interviews : interviews.slice(0, 4)).map((interview) => (
          <div
            key={interview.id}
            className="flex items-center justify-between p-3 transition bg-white rounded-lg shadow-sm hover:bg-gray-100"
          >
            {/* Profile Section */}
            <div className="flex items-center gap-3">
              <img
                src={interview.profileImg}
                alt={`${interview.name}'s profile`}
                className="object-cover w-10 h-10 border border-gray-300 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-800">{interview.name}</p>
                <p className="text-sm text-gray-500">{interview.vacancy}</p>
              </div>
            </div>
            
            {/* Details Section */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="min-w-[100px] text-center">{interview.date}</span>
              <span className="text-green-600">{interview.time}</span>
              <button className="text-gray-500 transition hover:text-gray-700">
                <BiDotsVerticalRounded className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {!showAll && ( 
        <div className="flex justify-end mt-4">
          <button
            onClick={handleViewAll}
            className="text-blue-600 hover:underline"
          >
            View All
          </button>
        </div>
      )}
    </div>
  );
};

export default Interviews;
