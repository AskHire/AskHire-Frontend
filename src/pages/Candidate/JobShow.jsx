import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const JobShow = () => {
    const { id } = useParams(); // This is the vacancyId
    const navigate = useNavigate();
    const { currentUser } = useAuth(); // Get the current user from AuthContext

    const [jobData, setJobData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applicationStatus, setApplicationStatus] = useState('pending'); // 'pending', 'can_apply', 'applied', 'not_found'

    useEffect(() => {
        if (!id || !currentUser) {
            if (!currentUser) {
                setLoading(true);
            }
            return;
        }

        const fetchJobDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5190/api/CandidateVacancy/${id}?userId=${currentUser.id}`);

                if (response.ok) {
                    const data = await response.json();
                    setJobData(data);
                    setApplicationStatus('can_apply');
                } else if (response.status === 409) { // Status 409: User has already applied
                    const errorData = await response.json();
                    setError(errorData.message); // Set the error message from backend
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
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [id, currentUser]);

    const calculateDaysRemaining = (endDate) => {
        if (!endDate) return null;
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const goBack = () => navigate(-1);

    // NEW: Function to navigate to the candidate's dashboard
    const handleGoToDashboard = () => {
        navigate('/candidate'); // Adjust this path if your dashboard route is different
    };

    const handleApply = () => {
        if (id) {
            navigate(`/candidate/CVupload/${id}`);
        } else {
            console.error("Vacancy ID not available");
        }
    };

    if (loading) return <div className="p-6 text-center">Loading...</div>;

    // MODIFIED: This block now handles the 'Already Applied' case specifically
    if (error && !jobData) {
        // If user has already applied, show a special message and dashboard button
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
    
    if (!jobData) return null; // Safeguard

    const daysRemaining = calculateDaysRemaining(jobData.endDate);

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
                        <div className="text-red-500 font-medium">End in {daysRemaining} days</div>
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
                    disabled={applicationStatus === 'applied'}
                    className={`mt-auto text-white py-2 rounded-md text-center w-full ${
                        applicationStatus === 'applied'
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    {applicationStatus === 'applied' ? 'Already Applied' : 'Apply Now'}
                </button>
            </div>
        </div>
    );
};

export default JobShow;