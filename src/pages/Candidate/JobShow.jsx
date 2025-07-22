import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const JobShow = () => {
    const { id } = useParams(); // This is the vacancyId
    const navigate = useNavigate();
    const { currentUser, loading: authLoading } = useAuth(); // Get the current user and auth loading state

    const [jobData, setJobData] = useState(null);
    const [loadingJob, setLoadingJob] = useState(true); // Separate loading for job details
    const [error, setError] = useState(null);
    const [applicationStatus, setApplicationStatus] = useState('pending'); // 'pending', 'can_apply', 'applied', 'not_found'

    useEffect(() => {
        if (!id) {
            setLoadingJob(false); // No ID, nothing to load
            return;
        }

        const fetchJobDetails = async () => {
            try {
                setLoadingJob(true);
                setError(null); // Clear previous errors

                // Construct URL based on whether a user is logged in
                const url = currentUser
                    ? `http://localhost:5190/api/CandidateVacancy/${id}?userId=${currentUser.id}`
                    : `http://localhost:5190/api/CandidateVacancy/${id}`; // For unauthenticated users, userId is optional

                const response = await fetch(url);

                if (response.ok) {
                    const data = await response.json();
                    setJobData(data);
                    // Determine application status only if a user is authenticated
                    if (currentUser) {
                        setApplicationStatus('can_apply'); // Default for authenticated, not yet applied
                    } else {
                        setApplicationStatus('pending'); // For unauthenticated, we can't tell if they applied
                    }
                } else if (response.status === 409 && currentUser) { // Status 409 for already applied, only if authenticated
                    const errorData = await response.json();
                    setError(errorData.message);
                    setApplicationStatus('applied');
                } else if (response.status === 404) {
                    setError("The job you are looking for does not exist or has expired.");
                    setApplicationStatus('not_found');
                } else {
                    throw new Error("An error occurred while fetching job details.");
                }
            } catch (error) {
                console.error("Failed to fetch job data:", error);
                setError(error.message);
                setApplicationStatus('pending'); // Reset status on error
            } finally {
                setLoadingJob(false);
            }
        };

        fetchJobDetails();
    }, [id, currentUser]); // Re-run effect if ID or currentUser changes

    const calculateDaysRemaining = (endDate) => {
        if (!endDate) return null;
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const goBack = () => navigate(-1);

    const handleGoToDashboard = () => {
        navigate('/candidate');
    };

    const handleApply = () => {
        if (!currentUser) {
            // Unauthenticated user clicked apply, redirect to login with a message
            navigate('/login', { state: { message: 'Please log in to apply for this job.' } });
            return;
        }

        if (id) {
            navigate(`/candidate/CVupload/${id}`);
        } else {
            console.error("Vacancy ID not available");
        }
    };

    // Show loading spinner if either auth is loading or job data is loading
    if (authLoading || loadingJob) {
        return <div className="p-6 text-center">Loading...</div>;
    }

    // If there's an error and no job data (e.g., 404 or general fetch error)
    if (error && !jobData) {
        // Special message for "Already Applied" if authenticated
        if (applicationStatus === 'applied') {
            return (
                <div className="max-w-5xl mx-auto p-6 text-center">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Already Applied</h2>
                        <p className="text-gray-600 mb-8">{error}</p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={goBack} className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300">
                                Back to Jobs
                            </button>
                            <button
                                onClick={handleGoToDashboard}
                                className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // Fallback for other errors (e.g., 404 Not Found)
        return (
            <div className="max-w-5xl mx-auto p-6 text-center">
                <button onClick={goBack} className="mb-6 flex items-center text-blue-600 mx-auto">
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Jobs
                </button>
                <div className="bg-white rounded-lg shadow-md p-8 text-red-500">{error}</div>
            </div>
        );
    }

    if (!jobData) return null; // Safeguard if jobData is still null after loading

    const daysRemaining = calculateDaysRemaining(jobData.endDate);

    // Button state depends on authentication and application status
    const isApplyButtonDisabled = currentUser && applicationStatus === 'applied';
    const applyButtonText = currentUser && applicationStatus === 'applied' ? 'Already Applied' : 'Apply Now';

    return (
        <div className="max-w-5xl mx-auto p-6">
            <button onClick={goBack} className="mb-6 flex items-center text-blue-600">
                <ArrowLeft size={16} className="mr-1" />
                Back to Jobs
            </button>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-2xl font-bold">{jobData.vacancyName}</h1>
                    {daysRemaining !== null && (
                        <div className="text-red-500 font-medium">
                            {daysRemaining > 0 ? `Ends in ${daysRemaining} days` : 'Expired'}
                        </div>
                    )}
                </div>

                <div className="flex space-x-4 text-gray-600 mb-4">
                    <div>{jobData.workLocation}</div>
                    <div>{jobData.workType}</div>
                </div>

                <p className="text-gray-700 mb-6">{jobData.description}</p>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Job Requirements</h2>
                    <ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
                        <li><strong>Experience:</strong> {jobData.experience}</li>
                        <li><strong>Education:</strong> {jobData.education}</li>
                        <li><strong>Required Skills:</strong> {jobData.requiredSkills}</li>
                        <li><strong>Non-Technical Skills:</strong> {jobData.nonTechnicalSkills}</li>
                    </ul>
                </div>

                {jobData.instructions && (
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Application Instructions</h2>
                        <p className="text-gray-700">{jobData.instructions}</p>
                    </div>
                )}

                <button
                    onClick={handleApply}
                    disabled={isApplyButtonDisabled}
                    className={`mt-auto text-white py-2 rounded-md text-center w-full ${
                        isApplyButtonDisabled
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    {applyButtonText}
                </button>
            </div>
        </div>
    );
};

export default JobShow;