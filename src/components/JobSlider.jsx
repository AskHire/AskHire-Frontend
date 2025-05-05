import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JobSlider = ({ title, jobs, viewAllLink = "/jobs" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  
  // Show 3 items at a time
  const itemsPerView = 3;
  const totalJobs = jobs?.length || 0;
  const totalSlides = Math.max(1, Math.ceil(totalJobs / itemsPerView) || 0);
  
  // Animation duration in milliseconds - longer for smoother transitions
  const animationDuration = 800;
  
  // Calculate visible jobs for current index
  const getVisibleJobs = () => {
    const startIdx = currentIndex * itemsPerView;
    const endIdx = Math.min(startIdx + itemsPerView, totalJobs);
    return jobs.slice(startIdx, endIdx);
  };
  
  const handlePrevious = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };
  
  const handleNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  const handleDotClick = (index) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex(index);
  };

  useEffect(() => {
    // Reset animation state after transition completes
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, animationDuration); // Match this with the CSS transition duration
    
    return () => clearTimeout(timer);
  }, [currentIndex, animationDuration]);

  const handleApply = (job) => {
    navigate(`/job/${job.id}`, { 
      state: job
    });
  };
  
  if (!jobs || jobs.length === 0) {
    return null;
  }
  
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
          className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous jobs"
          disabled={isAnimating}
        >
          <ChevronLeft size={24} />
        </button>
        
        {/* Cards container with overflow hidden to contain sliding animation */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-800 ease-out"
            style={{ 
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: `transform ${animationDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1.0)`
            }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => {
              // Get jobs for this slide
              const slideJobs = jobs.slice(slideIndex * itemsPerView, (slideIndex * itemsPerView) + itemsPerView);
              const jobsInSlide = slideJobs.length;
              
              return (
                <div key={slideIndex} className="flex w-full flex-shrink-0 justify-center">
                  {slideJobs.map((job, jobIndex) => (
                    <div 
                      key={job.id}
                      className="w-1/3 flex-shrink-0 px-2"
                    >
                      <div className="bg-white rounded-lg border border-gray-200 h-full overflow-hidden shadow-sm">
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
                    </div>
                  ))}
                  
                  {/* Add empty placeholders for missing cards in the last slide */}
                  {slideIndex === totalSlides - 1 && jobsInSlide < itemsPerView && 
                    Array.from({ length: itemsPerView - jobsInSlide }).map((_, i) => (
                      <div key={`placeholder-${i}`} className="w-1/3 flex-shrink-0 px-2"></div>
                    ))
                  }
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Right navigation button */}
        <button
          onClick={handleNext}
          className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next jobs"
          disabled={isAnimating}
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      {/* Pagination dots - one dot represents one group of 3 jobs */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-label={`Go to job group ${index + 1}`}
            disabled={isAnimating}
          />
        ))}
      </div>
    </div>
  );
};

export default JobSlider;