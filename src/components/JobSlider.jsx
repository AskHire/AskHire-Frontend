import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JobSlider = ({ title, jobs, viewAllLink = "/jobs" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  
  // Show 3 items at a time
  const itemsPerView = 3;
  const totalSlides = Math.max(1, Math.ceil(jobs?.length / itemsPerView) || 0);
  
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  const handleApply = (job) => {
    navigate(`/job/${job.id}`, { 
      state: job
    });
  };
  
  if (!jobs || jobs.length === 0) {
    return null;
  }
  
  // Get current visible jobs
  const visibleJobs = jobs.slice(
    currentIndex * itemsPerView,
    (currentIndex * itemsPerView) + itemsPerView
  );

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <a href={viewAllLink} className="text-blue-600 text-sm">View All</a>
      </div>
      
      <div className="relative">
        {/* Left navigation button */}
        <button
          onClick={handlePrevious}
          className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-blue-600 transition-colors"
          aria-label="Previous jobs"
        >
          <ChevronLeft size={24} />
        </button>
        
        {/* Cards container */}
        <div className="flex justify-between gap-4 px-2">
          {visibleJobs.map((job) => (
            <div 
              key={job.id}
              className="bg-white rounded-lg border border-gray-200 flex-1 overflow-hidden shadow-sm"
            >
              <div className="p-4 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold">{job.title}</h3>
                  <CheckCircle size={20} className="text-green-500" />
                </div>
                
                <div className="flex justify-between text-sm text-gray-500 mb-3">
                  <span>{job.location || "Remote"}</span>
                  <span>{job.type || "Full-Time"}</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 flex-grow">
                  {job.description || "Seeking innovative developers to build cutting-edge solutions."}
                </p>
                
                <button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
                  onClick={() => handleApply(job)}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Right navigation button */}
        <button
          onClick={handleNext}
          className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-blue-600 transition-colors"
          aria-label="Next jobs"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      {/* Pagination dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default JobSlider;