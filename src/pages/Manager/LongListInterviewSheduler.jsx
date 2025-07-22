import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ManagerTopbar from '../../components/ManagerTopbar';

const LongListInterviewScheduler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [vacancyName, setVacancyName] = useState('');
  const [vacancyId, setVacancyId] = useState('');
  const [jobId, setJobId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [interviewDuration, setInterviewDuration] = useState('00:30:00');
  const [interviewInstructions, setInterviewInstructions] = useState('');
  const [unscheduledCandidates, setUnscheduledCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [possibleInterviews, setPossibleInterviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [selectAll, setSelectAll] = useState(false);
  
  // Success state
  const [successMessage, setSuccessMessage] = useState(null);
  const [showSuccessView, setShowSuccessView] = useState(false);
  const [scheduledResults, setScheduledResults] = useState({
    scheduledCount: 0,
    notScheduledCount: 0
  });

  // Extract vacancy info from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const vacancy = params.get('vacancy');
    const vacancyIdParam = params.get('vacancyId');
    
    console.log("URL params - vacancy:", vacancy, "vacancyId:", vacancyIdParam);
    
    if (vacancy) {
      setVacancyName(vacancy);
      if (vacancyIdParam) {
        setVacancyId(vacancyIdParam);
        fetchUnscheduledCandidates(vacancyIdParam);
      } else {
        fetchVacancyByName(vacancy);
      }
    } else if (vacancyIdParam) {
      // If only vacancyId is provided, try to fetch vacancy details
      setVacancyId(vacancyIdParam);
      fetchVacancyDetails(vacancyIdParam);
    } else {
      setError('No vacancy information specified in URL parameters');
      setIsLoading(false);
    }
  }, [location.search]);

  // Fetch vacancy details by ID
  const fetchVacancyDetails = async (vacancyId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Fetching vacancy details for ID:", vacancyId);
      
      const response = await fetch(`http://localhost:5190/api/ManagerLonglistVacancy/${vacancyId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch vacancy details: ${response.status}`);
      }
      
      const vacancyData = await response.json();
      console.log("Vacancy details:", vacancyData);
      
      setVacancyName(vacancyData.vacancyName || `Vacancy ${vacancyId}`);
      setJobId(vacancyData.jobId || '');
      
      await fetchUnscheduledCandidates(vacancyId);
      
    } catch (error) {
      console.error("Error fetching vacancy details:", error);
      // Don't fail completely, just set a default name and continue
      setVacancyName(`Vacancy ${vacancyId}`);
      await fetchUnscheduledCandidates(vacancyId);
    }
  };

  // Fetch vacancy by name to get the vacancy ID
  const fetchVacancyByName = async (name) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Fetching vacancy by name:", name);
      
      const vacancyResponse = await fetch('http://localhost:5190/api/ManagerLonglistVacancy');
      if (!vacancyResponse.ok) {
        throw new Error(`Failed to fetch vacancies: ${vacancyResponse.status}`);
      }
      const vacancies = await vacancyResponse.json();
      
      console.log("All vacancies:", vacancies);
      
      const matchingVacancy = vacancies.find(vacancy => 
        vacancy.vacancyName.toLowerCase() === name.toLowerCase() ||
        vacancy.vacancyName.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(vacancy.vacancyName.toLowerCase())
      );
      
      if (!matchingVacancy) {
        throw new Error(`No vacancy found matching: ${name}`);
      }
      
      console.log("Matching vacancy found:", matchingVacancy);
      setVacancyId(matchingVacancy.vacancyId);
      setJobId(matchingVacancy.jobId || '');
      
      await fetchUnscheduledCandidates(matchingVacancy.vacancyId);
      
    } catch (error) {
      console.error("Error fetching vacancy data:", error);
      setError(`Error fetching vacancy information: ${error.message}`);
      setIsLoading(false);
    }
  };

  // Enhanced function to fetch unscheduled candidates
  const fetchUnscheduledCandidates = async (vacancyId) => {
    try {
      setError(null);
      console.log(`Fetching unscheduled candidates for vacancy ID: ${vacancyId}`);
      
      if (!vacancyId) {
        throw new Error('No vacancy ID provided');
      }
      
      // Try multiple API endpoints to get unscheduled candidates
      let candidates = [];
      
      // First try the specific unscheduled candidates endpoint
      try {
        const response = await fetch(
          `http://localhost:5190/api/ManagerLongListInterviewScheduler/unscheduled-candidates/${vacancyId}`
        );
        
        if (response.ok) {
          candidates = await response.json();
          console.log("Fetched from unscheduled endpoint:", candidates);
        } else {
          console.warn("Unscheduled endpoint returned:", response.status);
        }
      } catch (error) {
        console.warn("Unscheduled endpoint failed:", error);
      }
      
      // If no candidates found, try to get all applications for this vacancy
      if (!candidates || candidates.length === 0) {
        try {
          const allApplicationsResponse = await fetch(
            `http://localhost:5190/api/ManagerLonglistVacancy/applications/${vacancyId}`
          );
          
          if (allApplicationsResponse.ok) {
            const allApplications = await allApplicationsResponse.json();
            console.log("All applications for vacancy:", allApplications);
            
            // Filter for unscheduled candidates (those without interview scheduled)
            candidates = allApplications.filter(app => 
              !app.interviewScheduled && 
              app.applicationStatus !== 'Rejected' &&
              app.applicationStatus !== 'Hired'
            );
            
            console.log("Filtered unscheduled candidates:", candidates);
          } else {
            console.warn("Applications endpoint returned:", allApplicationsResponse.status);
          }
        } catch (error) {
          console.warn("Applications endpoint failed:", error);
        }
      }
      
      // If still no candidates, try alternative approach
      if (!candidates || candidates.length === 0) {
        try {
          const longlistResponse = await fetch(
            `http://localhost:5190/api/ManagerLonglistVacancy/longlist/${vacancyId}`
          );
          
          if (longlistResponse.ok) {
            const longlistData = await longlistResponse.json();
            console.log("Longlist data:", longlistData);
            
            // Extract candidates from longlist data
            candidates = longlistData.candidates || longlistData.applications || [];
            
            // Filter for unscheduled
            candidates = candidates.filter(candidate => 
              !candidate.interviewScheduled && 
              !candidate.hasInterview &&
              candidate.status !== 'Rejected'
            );
          } else {
            console.warn("Longlist endpoint returned:", longlistResponse.status);
          }
        } catch (error) {
          console.warn("Longlist endpoint failed:", error);
        }
      }
      
      // Ensure candidates is an array and has proper structure
      const candidatesArray = Array.isArray(candidates) ? candidates : [];
      
      // Normalize candidate data structure
      const normalizedCandidates = candidatesArray.map(candidate => {
        console.log('Candidate object:', candidate); // DEBUG: See what fields are present
        const cvMark = Number(candidate.cvMark || candidate.cV_Mark || 0);
        const prescreenMark = Number(
          candidate.pre_Screen_PassMark ||
          candidate.Pre_Screen_PassMark ||
          candidate.preScreenPassMark ||
          candidate.pre_screen_pass_mark ||
          candidate.prescreenMark ||
          candidate.prescreenTestMark ||
          candidate.prescreen ||
          0
        );
        const totalMark = (cvMark * 0.5) + (prescreenMark * 0.5);
        return { ...candidate, totalMark, cvMark, prescreenMark };
      });
      // Sort by totalMark descending
      normalizedCandidates.sort((a, b) => b.totalMark - a.totalMark);
      setUnscheduledCandidates(normalizedCandidates);
      setIsLoading(false);
      
      // Auto-select all candidates if auto-scheduling is enabled
      if (normalizedCandidates.length > 0) {
        setSelectedCandidates(normalizedCandidates.map(c => c.applicationId));
        setSelectAll(true);
      }
      
    } catch (error) {
      console.error("Error fetching unscheduled candidates:", error);
      setError(`Error fetching unscheduled candidates: ${error.message}`);
      setIsLoading(false);
    }
  };

  // Handle individual candidate selection
  const handleCandidateToggle = (candidateId) => {
    setSelectedCandidates(prev => {
      const newSelected = prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId];
      
      setSelectAll(newSelected.length === unscheduledCandidates.length);
      return newSelected;
    });
  };

  // Handle select all toggle
  const handleSelectAllToggle = () => {
    if (selectAll) {
      setSelectedCandidates([]);
      setSelectAll(false);
    } else {
      setSelectedCandidates(unscheduledCandidates.map(c => c.applicationId));
      setSelectAll(true);
    }
  };

  // Calculate number of possible interviews
  useEffect(() => {
    if (startTime && endTime && interviewDuration) {
      try {
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        
        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;
        
        if (endTotalMinutes <= startTotalMinutes) {
          setPossibleInterviews(0);
          return;
        }
        
        const totalAvailableMinutes = endTotalMinutes - startTotalMinutes;
        const [durationHours, durationMinutes] = interviewDuration.split(':').map(Number);
        const interviewDurationMinutes = durationHours * 60 + durationMinutes;
        
        const possibleCount = Math.floor(totalAvailableMinutes / interviewDurationMinutes);
        setPossibleInterviews(possibleCount);
      } catch (error) {
        console.error("Error calculating possible interviews:", error);
        setPossibleInterviews(0);
      }
    } else {
      setPossibleInterviews(0);
    }
  }, [startTime, endTime, interviewDuration]);

  // Get minimum time for date validation
  const getMinTime = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (date === todayStr) {
      const now = new Date();
      now.setSeconds(0, 0);
      now.setMinutes(now.getMinutes() + 1);
      return now.toTimeString().slice(0, 5);
    }
    return "00:00";
  };

  // Generate automatic interview schedule
  const generateInterviewSchedule = () => {
    if (!startTime || !endTime || !interviewDuration || selectedCandidates.length === 0) {
      return [];
    }

    const schedule = [];
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [durationHours, durationMinutes] = interviewDuration.split(':').map(Number);
    const interviewDurationMinutes = durationHours * 60 + durationMinutes;

    let currentTime = startHours * 60 + startMinutes;
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const endTotalMinutes = endHours * 60 + endMinutes;

    const selectedCandidateDetails = unscheduledCandidates.filter(candidate => 
      selectedCandidates.includes(candidate.applicationId)
    );

    for (let i = 0; i < selectedCandidateDetails.length && currentTime + interviewDurationMinutes <= endTotalMinutes; i++) {
      const candidate = selectedCandidateDetails[i];
      const interviewStartHours = Math.floor(currentTime / 60);
      const interviewStartMinutes = currentTime % 60;
      const interviewEndTime = currentTime + interviewDurationMinutes;
      const interviewEndHours = Math.floor(interviewEndTime / 60);
      const interviewEndMinutes = interviewEndTime % 60;

      schedule.push({
        candidateId: candidate.candidateId,
        applicationId: candidate.applicationId,
        candidateName: `${candidate.firstName} ${candidate.lastName}`,
        candidateEmail: candidate.email,
        startTime: `${interviewStartHours.toString().padStart(2, '0')}:${interviewStartMinutes.toString().padStart(2, '0')}`,
        endTime: `${interviewEndHours.toString().padStart(2, '0')}:${interviewEndMinutes.toString().padStart(2, '0')}`,
        date: date
      });

      currentTime = interviewEndTime;
    }

    return schedule;
  };

  // Handle form submission with automatic scheduling - FIXED VERSION
  // Handle form submission with automatic scheduling - CORRECTED VERSION
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Clear any previous errors
  setError(null);
  
  // Enhanced validation with better error messages
  if (!vacancyId || vacancyId.trim() === '') {
    setError('Vacancy ID is missing. Please try refreshing the page or go back and select the vacancy again.');
    return;
  }
  
  if (!date || date.trim() === '') {
    setError('Please select a date for the interviews');
    return;
  }
  
  if (!startTime || startTime.trim() === '') {
    setError('Please set the start time for interviews');
    return;
  }
  
  if (!endTime || endTime.trim() === '') {
    setError('Please set the end time for interviews');
    return;
  }
  
  if (!interviewInstructions || interviewInstructions.trim() === '') {
    setError('Please provide interview instructions');
    return;
  }
  
  if (possibleInterviews <= 0) {
    setError('Please set a valid time range and duration that allows for at least one interview');
    return;
  }
  
  if (selectedCandidates.length === 0) {
    setError('Please select at least one candidate to schedule interviews. If no candidates are available, try refreshing the candidates list.');
    return;
  }

  const selectedDateTime = new Date(`${date}T${startTime}`);
  const now = new Date();
  if (selectedDateTime < now) {
    setError('Cannot schedule interviews in the past. Please select a valid date and time.');
    return;
  }
  
  try {
    setIsSubmitting(true);
    setError(null);
    
    console.log("Starting interview scheduling with vacancy ID:", vacancyId);
    
    // Generate the automatic interview schedule
    const interviewSchedule = generateInterviewSchedule();
    
    if (interviewSchedule.length === 0) {
      setError('No interviews could be scheduled with the current time constraints');
      setIsSubmitting(false);
      return;
    }
    
    console.log("Generated interview schedule:", interviewSchedule);
    
    // Create individual interview requests - CORRECTED LOGIC
    const scheduledInterviews = [];
    const failedInterviews = [];
    
    console.log("Total interviews to schedule:", interviewSchedule.length);
    
    for (const interview of interviewSchedule) {
      try {
        const interviewData = {
          applicationId: interview.applicationId,
          date: interview.date,
          time: interview.startTime,
          duration: interviewDuration,
          Interview_Instructions: interviewInstructions
        };
        
        console.log("Creating interview for:", interview.candidateName, "Data:", interviewData);
        
        const response = await fetch('http://localhost:5190/api/ManagerInterview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(interviewData)
        });
        
        const responseText = await response.text();
        console.log(`API response for ${interview.candidateName}: status=`, response.status, 'body=', responseText);
        
        if (response.ok) {
          // Try to parse JSON if possible
          let result = null;
          try { result = JSON.parse(responseText); } catch {}
          console.log("✅ Interview created successfully for:", interview.candidateName, result);
          scheduledInterviews.push(interview); // SUCCESS: Add to scheduled
        } else {
          console.error("❌ Failed to create interview for:", interview.candidateName, "Error:", responseText);
          failedInterviews.push(interview); // FAILURE: Add to failed
        }
      } catch (error) {
        console.error("❌ Exception creating interview for:", interview.candidateName, "Error:", error);
        failedInterviews.push(interview); // EXCEPTION: Add to failed
      }
    }

    // Wait a bit for backend to process
    await new Promise(resolve => setTimeout(resolve, 1500));

    // CORRECTED: Get accurate counts by fetching fresh unscheduled candidates
    console.log("Fetching updated unscheduled candidates to get accurate counts...");
    
    let remainingUnscheduledCandidates = [];
    try {
      // Fetch fresh unscheduled candidates from backend
      const unscheduledResponse = await fetch(
        `http://localhost:5190/api/ManagerLongListInterviewScheduler/unscheduled-candidates/${vacancyId}`
      );
      
      if (unscheduledResponse.ok) {
        remainingUnscheduledCandidates = await unscheduledResponse.json();
      } else {
        // Fallback: try to get all applications and filter
        const allApplicationsResponse = await fetch(
          `http://localhost:5190/api/ManagerLonglistVacancy/applications/${vacancyId}`
        );
        
        if (allApplicationsResponse.ok) {
          const allApplications = await allApplicationsResponse.json();
          
          // Filter for unscheduled candidates
          const unscheduledPromises = allApplications.map(async (app) => {
            try {
              const interviewResponse = await fetch(
                `http://localhost:5190/api/ManagerInterview/application/${app.applicationId}`
              );
              
              if (interviewResponse.ok) {
                const interviewData = await interviewResponse.json();
                // If no interview data or no date, consider unscheduled
                return !interviewData || !interviewData.date ? app : null;
              } else {
                // If API call fails, consider unscheduled
                return app;
              }
            } catch (error) {
              console.error(`Error checking interview status for application ${app.applicationId}:`, error);
              return app; // If error, consider unscheduled
            }
          });
          
          const unscheduledResults = await Promise.all(unscheduledPromises);
          remainingUnscheduledCandidates = unscheduledResults.filter(app => app !== null);
        }
      }
    } catch (error) {
      console.error("Error fetching updated unscheduled candidates:", error);
      // Use fallback calculation
      remainingUnscheduledCandidates = unscheduledCandidates.filter(
        candidate => !scheduledInterviews.some(scheduled => 
          scheduled.applicationId === candidate.applicationId
        )
      );
    }
    
    // Calculate accurate counts
    const actualScheduledCount = scheduledInterviews.length;
    const actualUnscheduledCount = remainingUnscheduledCandidates.length;
    
    console.log("FINAL COUNTS:");
    console.log("- Successfully scheduled:", actualScheduledCount);
    console.log("- Remaining unscheduled:", actualUnscheduledCount);
    console.log("- Failed to schedule:", failedInterviews.length);
    
    // Update state with accurate counts
    setScheduledResults({
      scheduledCount: actualScheduledCount,
      notScheduledCount: actualUnscheduledCount
    });
    
    // Create success message
    const successMsg = `Successfully scheduled ${actualScheduledCount} interview${actualScheduledCount !== 1 ? 's' : ''} for this vacancy.${
      actualUnscheduledCount > 0 ? ` ${actualUnscheduledCount} candidate${actualUnscheduledCount !== 1 ? 's are' : ' is'} still unscheduled.` : ''
    }${failedInterviews.length > 0 ? ` ${failedInterviews.length} interview${failedInterviews.length !== 1 ? 's' : ''} failed to schedule.` : ''}${
      sendEmail ? ' Email invitations have been sent.' : ''
    }`;
    
    setSuccessMessage(successMsg);
    setShowSuccessView(true);
    setIsSubmitting(false);
    
  } catch (error) {
    console.error("Error during submission:", error);
    setError(`Error scheduling interviews: ${error.message}`);
    setIsSubmitting(false);
  }
};

  // Handle cancel
  const handleCancel = () => {
    const referrer = document.referrer;
    if (referrer.includes('/manager/View_LongList')) {
      navigate('/manager/View_LongList');
    } else {
      navigate('/manager/LongList');
    }
  };

  // Manual refresh functionality
  const handleRefresh = () => {
    if (vacancyId) {
      setIsLoading(true);
      setSelectedCandidates([]);
      setSelectAll(false);
      setError(null);
      fetchUnscheduledCandidates(vacancyId);
    } else {
      setError("No vacancy ID available to refresh data. Please go back and select the vacancy again.");
    }
  };
  
  // Handle return to listing after successful scheduling
  const handleReturnToListing = () => {
    const referrer = document.referrer;
    if (referrer.includes('/manager/View_LongList')) {
      navigate('/manager/View_LongList');
    } else {
      navigate('/manager/LongList');
    }
  };

  // Handle scheduling more interviews
  const handleScheduleMore = () => {
    setShowSuccessView(false);
    setSuccessMessage(null);
    setSelectedCandidates([]);
    setSelectAll(false);
    
    if (vacancyId) {
      setIsLoading(true);
      fetchUnscheduledCandidates(vacancyId);
    }
  };

// Success view component - Updated to show scheduled and unscheduled quantities
const SuccessView = () => {
  console.log("SuccessView - scheduledResults:", scheduledResults);
  console.log("SuccessView - successMessage:", successMessage);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      {/* Big green check */}
      <div className="flex justify-center mb-6">
        <div className="bg-green-100 rounded-full p-3">
          <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        Interviews Scheduled Successfully!
      </h3>

      {/* Success Statistics */}
      <div className="mb-6">
        <div className="flex justify-center space-x-6 mb-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 min-w-32">
            <div className="text-3xl font-bold text-green-600">
              {scheduledResults.scheduledCount}
            </div>
            <div className="text-sm text-green-700 font-medium">
              Interviews Scheduled
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 min-w-32">
            <div className="text-3xl font-bold text-blue-600">
              {scheduledResults.notScheduledCount}
            </div>
            <div className="text-sm text-blue-700 font-medium">
              Still Unscheduled
            </div>
          </div>
        </div>

        {/* Success message */}
        <p className="text-gray-600 mb-4">
          {successMessage}
        </p>

        {/* Additional context if there are unscheduled candidates */}
        {scheduledResults.notScheduledCount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> {scheduledResults.notScheduledCount} candidate(s) could not be scheduled due to time constraints. 
              You can schedule more interviews for them by clicking "Schedule More Interviews" below.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={handleScheduleMore}
          className="px-6 py-3 bg-white border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
        >
          Schedule More Interviews
        </button>

        <button
          onClick={handleReturnToListing}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Return to Long List
        </button>
      </div>
    </div>
  );
};

  return (
    <div className="bg-blue-50 flex-auto min-h-screen">
      <ManagerTopbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">
          {showSuccessView ? 'Interview Scheduling Complete' : 'Schedule Long-List Interviews'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
            {error.includes('Vacancy ID is missing') && (
              <div className="mt-2">
                <button
                  onClick={handleCancel}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Go Back and Select Vacancy Again
                </button>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-blue-600">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : showSuccessView ? (
            <SuccessView />
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Vacancy Name Display */}
              <div className="flex items-center mb-6 bg-blue-50 p-4 rounded-lg">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Vacancy: {vacancyName}
                  </h3>
                  
                </div>
              </div>

              {/* Candidates Summary */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-800">
                    Unscheduled Candidates
                  </h3>
                  <div className="flex space-x-2">
                    <span className="bg-blue-100 text-blue-800 font-medium py-1 px-3 rounded-full">
                      {unscheduledCandidates.length} Candidates
                    </span>
                    <button 
                      type="button"
                      onClick={handleRefresh}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-1 rounded-full"
                      title="Refresh candidates list"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                {unscheduledCandidates.length > 0 ? (
                  <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                    <ul className="space-y-2">
                      {unscheduledCandidates.map(candidate => (
                        <li key={candidate.applicationId} className="grid grid-cols-2 md:grid-cols-4 gap-2 py-2 border-b">
  <span className="font-medium">
    {candidate.firstName} {candidate.lastName}
  </span>
  <span className="text-purple-700">
    CV: {candidate.cvMark || candidate.cV_Mark || 0}%
  </span>
  <span className="text-yellow-700">
    Prescreen: {candidate.prescreenMark}%
  </span>
  <span className="text-blue-700 font-bold">
    Total: {candidate.totalMark ? candidate.totalMark.toFixed(2) : 'N/A'}%
  </span>
</li>

                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-center text-gray-500 mb-2">
                      No unscheduled candidates found for this vacancy
                    </div>
                    <div className="flex justify-center">
                      <button 
                        type="button"
                        onClick={handleRefresh} 
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        Refresh Candidates List
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Date Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              {/* Time Range Fields */}
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Interviews Start Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={startTime}
                    min={getMinTime()}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Interviews End Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={endTime}
                    min={getMinTime()}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Duration Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">Time Duration for One Interview</label>
                <select
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={interviewDuration}
                  onChange={(e) => setInterviewDuration(e.target.value)}
                  required
                >
                  <option value="00:15:00">15 minutes</option>
                  <option value="00:30:00">30 minutes</option>
                  <option value="00:45:00">45 minutes</option>
                  <option value="01:00:00">1 hour</option>
                  <option value="01:30:00">1 hour 30 minutes</option>
                  <option value="02:00:00">2 hours</option>
                </select>
              </div>

              {/* Possible Interviews Count */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">Quantity of Possible Interviews</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg bg-gray-50"
                  value={possibleInterviews}
                  readOnly
                />
                {startTime && endTime ? (
                  possibleInterviews > 0 ? (
                    <p className="mt-2 text-sm text-green-600">
                      You can schedule up to {possibleInterviews} interviews with the selected time range and duration.
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-red-600">
                      Please configure start time, end time, and duration to allow for interviews.
                    </p>
                  )
                ) : (
                  <p className="mt-2 text-sm text-gray-500">
                    Please configure start time, end time, and duration
                  </p>
                )}
              </div>

              {/* Instructions Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">Interview Instructions</label>
                <textarea
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-32"
                  placeholder="Enter instructions for interview..."
                  value={interviewInstructions}
                  onChange={(e) => setInterviewInstructions(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* Email Option */}
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    id="sendEmail"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                  />
                  <label htmlFor="sendEmail" className="ml-2 block text-sm font-medium text-gray-700">
                    Send email invitations to all scheduled candidates
                  </label>
                </div>
              </div>

              {/* Button Container */}
              <div className="flex flex-col-reverse sm:flex-row justify-between pt-4 gap-3">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-center"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting || possibleInterviews <= 0 || unscheduledCandidates.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Scheduling...
                    </>
                  ) : (
                    'Schedule Interviews & Send Invites'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default LongListInterviewScheduler;