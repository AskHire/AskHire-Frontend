import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const JobShow = () => {
  const { id } = useParams(); // This is the vacancyId
  const navigate = useNavigate();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5190/api/CandidateVacancy/${id}`);
        const data = await response.json();
        setJobData(data);
      } catch (error) {
        console.error("Failed to fetch job data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  const calculateDaysRemaining = (endDate) => {
    if (!endDate) return null;
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const goBack = () => navigate(-1);

  // Handle Apply Now button click
  const handleApply = () => {
    if (id) {
      navigate(`/candidate/CVupload/${id}`); // Pass vacancyId as URL parameter
    } else {
      console.error("Vacancy ID not available");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!jobData) return <div className="p-6 text-center text-red-500">Job not found.</div>;

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
          className="mt-auto bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md text-center w-full"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobShow;