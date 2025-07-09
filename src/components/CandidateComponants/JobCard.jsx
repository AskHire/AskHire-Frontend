import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ id, title, location, type, description, endDate, instructions }) => {
  const navigate = useNavigate();
  
  // Calculate days remaining from endDate
  const calculateDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = calculateDaysRemaining(endDate);
  
  const handleApply = () => {
    navigate(`/job/${id}`);
  };
  

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col h-full">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-lg font-bold">{title}</h2>
        <CheckCircle size={20} className="text-green-500" />
      </div>
      
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>{location}</span>
        <span>{type}</span>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      
      {endDate && (
        <div className="text-sm text-red-500 mb-4">
          End in {daysRemaining} days
        </div>
      )}
      
      <button 
        className="mt-auto bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md text-center w-full"
        onClick={handleApply}
      >
        Apply Now
      </button>
    </div>
  );
};

export default JobCard;