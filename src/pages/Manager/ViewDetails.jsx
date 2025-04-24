import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ManagerTopbar from '../../components/ManagerTopbar';

const ViewDetails = () => {
  const { id } = useParams(); // Get the candidate ID from the URL
  const [candidateData, setCandidateData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch candidate data from the backend based on the ID
  useEffect(() => {
    const fetchCandidateDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://localhost:7256/api/Candidates/${id}`);
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched candidate data:', data); // Log the data to see structure
        setCandidateData(data); // Set the data to state
        setError(null);
      } catch (error) {
        console.error('Error fetching candidate data:', error);
        setError('Failed to load candidate data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCandidateDetails();
    }
  }, [id]);

  const handleDownloadCV = async () => {
    try {
      if (!candidateData || !candidateData.cvFilePath) {
        alert('CV file not available for download.');
        return;
      }

      const response = await fetch(`https://localhost:7256/api/Candidates/download-cv/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Candidate_${id}_CV.pdf`);
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error downloading CV:', error);
      alert(`Failed to download CV: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl">Loading candidate details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!candidateData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl">No candidate data found</div>
      </div>
    );
  }

  // Helper function to calculate age from date of birth string or timestamp
  const calculateAge = (dateOfBirthStr) => {
    if (!dateOfBirthStr) {
      return 'N/A';
    }

    try {
      const dob = new Date(dateOfBirthStr);
      if (isNaN(dob.getTime())) {
        console.error('Invalid date format:', dateOfBirthStr);
        return 'N/A';
      }

      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      return age;
    } catch (error) {
      console.error('Error calculating age:', error);
      return 'N/A';
    }
  };

  let candidateAge = 'N/A';
  if (candidateData.user) {
    if (candidateData.user.dateOfBirth) {
      candidateAge = calculateAge(candidateData.user.dateOfBirth);
    } else if (candidateData.user.dob) {
      candidateAge = calculateAge(candidateData.user.dob);
    } else if (candidateData.user.birthDate) {
      candidateAge = calculateAge(candidateData.user.birthDate);
    } else if (candidateData.dateOfBirth) {
      candidateAge = calculateAge(candidateData.dateOfBirth);
    } else if (candidateData.dob) {
      candidateAge = calculateAge(candidateData.dob);
    } else if (candidateData.user.age) {
      candidateAge = candidateData.user.age;
    }
  }

  return (
    <div className="bg-gray-100 flex-auto min-h-screen">
      <ManagerTopbar />

      <h2 className="text-2xl font-bold mb-4 pl-8 pt-8">Candidate Details</h2>

      <div className="flex justify-center px-4 pb-8">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl border border-blue-600">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {candidateData.user?.firstName} {candidateData.user?.lastName}
            </h1>
            {candidateData.vacancy && (
              <p className="text-blue-600 font-medium mt-1">
                Experience: {candidateData.vacancy.experience}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">NIC</p>
              <p className="font-medium">{candidateData.user?.nic || 'N/A'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Age</p>
              <p className="font-medium">{candidateAge}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium">{candidateData.user?.gender || 'N/A'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{candidateData.user?.address || 'N/A'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{candidateData.user?.email || 'N/A'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium">{candidateData.user?.mobileNumber || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">CV Tally Mark</p>
              <p className="font-bold">{candidateData.cV_Mark || 0}%</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Pre-Screen Test Mark</p>
              <p className="font-bold">{candidateData.pre_Screen_PassMark || 0}%</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Application Status</p>
              <p className="font-bold">{candidateData.status || 'N/A'}</p>
            </div>
          </div>

          <button
            onClick={handleDownloadCV}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-4 rounded-full transition duration-300 transform hover:-translate-y-1"
            disabled={!candidateData.cvFilePath}
          >
            {candidateData.cvFilePath ? 'Download CV' : 'CV Not Available'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
