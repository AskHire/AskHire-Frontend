import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JobSlider = ({ title, jobs = [], viewAllLink = "/jobs" }) => {
  // ===== STATE MANAGEMENT =====
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  // ===== CONFIGURATION =====
  const CARDS_PER_SLIDE = 3;
  const ANIMATION_DURATION = 600; // milliseconds
  
  // ===== CALCULATIONS =====
  const totalSlides = Math.ceil(jobs.length / CARDS_PER_SLIDE);
  const hasMultipleSlides = totalSlides > 1;

  // ===== NAVIGATION FUNCTIONS =====
  const goToNextSlide = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentSlide(prev => 
      prev === totalSlides - 1 ? 0 : prev + 1
    );
  };

  const goToPreviousSlide = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentSlide(prev => 
      prev === 0 ? totalSlides - 1 : prev - 1
    );
  };

  const goToSlide = (slideIndex) => {
    if (isAnimating || slideIndex === currentSlide) return;
    
    setIsAnimating(true);
    setCurrentSlide(slideIndex);
  };

  // ===== ANIMATION MANAGEMENT =====
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, ANIMATION_DURATION);
    
    return () => clearTimeout(timer);
  }, [currentSlide]);

  // ===== UTILITY FUNCTIONS =====
  const handleJobApply = (job) => {
    navigate(`/job/${job.id}`, { state: job });
  };

  const getJobsForSlide = (slideIndex) => {
    const startIndex = slideIndex * CARDS_PER_SLIDE;
    const endIndex = startIndex + CARDS_PER_SLIDE;
    return jobs.slice(startIndex, endIndex);
  };

  // ===== EARLY RETURN FOR EMPTY JOBS =====
  if (!jobs.length) return null;

  // ===== RENDER COMPONENT =====
  return (
    <div className="my-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <a 
          href={viewAllLink} 
          className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
        >
          View All
        </a>
      </div>

      {/* Slider Section */}
      <div className="relative">
        {/* Previous Button */}
        {hasMultipleSlides && (
          <button
            onClick={goToPreviousSlide}
            disabled={isAnimating}
            className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 
                     bg-blue-500 hover:bg-blue-600 text-white 
                     w-10 h-10 rounded-full flex items-center justify-center 
                     shadow-md transition-colors disabled:opacity-50"
            aria-label="Previous jobs"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Cards Container */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform ease-out"
            style={{ 
              transform: `translateX(-${currentSlide * 100}%)`,
              transitionDuration: `${ANIMATION_DURATION}ms`
            }}
          >
            {/* Generate Slides */}
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div key={slideIndex} className="w-full flex flex-shrink-0">
                {/* Job Cards in Current Slide */}
                {getJobsForSlide(slideIndex).map(job => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    onApply={handleJobApply} 
                  />
                ))}
                
                {/* Empty Placeholders for Last Slide */}
                {slideIndex === totalSlides - 1 && 
                  Array.from({ 
                    length: CARDS_PER_SLIDE - getJobsForSlide(slideIndex).length 
                  }).map((_, i) => (
                    <div key={`empty-${i}`} className="w-1/3 px-2" />
                  ))
                }
              </div>
            ))}
          </div>
        </div>

        {/* Next Button */}
        {hasMultipleSlides && (
          <button
            onClick={goToNextSlide}
            disabled={isAnimating}
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 
                     bg-blue-500 hover:bg-blue-600 text-white 
                     w-10 h-10 rounded-full flex items-center justify-center 
                     shadow-md transition-colors disabled:opacity-50"
            aria-label="Next jobs"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Pagination Dots */}
      {hasMultipleSlides && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isAnimating}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide 
                  ? "bg-blue-600 scale-110" 
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ===== SEPARATE JOB CARD COMPONENT =====
const JobCard = ({ job, onApply }) => (
  <div className="w-1/3 px-2">
    <div className="bg-white rounded-lg border border-gray-200 h-full 
                  shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4 flex flex-col h-full">
        {/* Job Header */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold flex-1 mr-2">
            {job.title}
          </h3>
          <CheckCircle size={20} className="text-green-500" />
        </div>
        
        {/* Job Details */}
        <div className="flex justify-between text-sm text-gray-500 mb-3">
          <span>{job.location || "Remote"}</span>
          <span>{job.type || "Full-Time"}</span>
        </div>
        
        {/* Job Description */}
        <p className="text-sm text-gray-600 mb-4 flex-grow">
          {job.description || "Seeking innovative developers to build cutting-edge solutions."}
        </p>
        
        {/* Apply Button */}
        <button 
          onClick={() => onApply(job)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 
                   rounded-md transition-colors focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:ring-offset-2"
        >
          Apply Now
        </button>
      </div>
    </div>
  </div>
);

export default JobSlider;