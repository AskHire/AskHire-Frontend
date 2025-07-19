import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ManagerTopbar from '../../components/ManagerTopbar';

const ViewDetails = () => {
  const { id } = useParams(); // Get the candidate ID from the URL
  const [candidateData, setCandidateData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken'); // Adjust this based on your auth service
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  // Fetch candidate data from the backend based on the ID
  useEffect(() => {
    const fetchCandidateDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5190/api/ManagerCandidates/${id}`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Candidate not found');
          } else if (response.status === 401) {
            throw new Error('Unauthorized access. Please login again.');
          }
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched candidate data:', data);
        setCandidateData(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching candidate data:', error);
        setError(error.message || 'Failed to load candidate data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCandidateDetails();
    }
  }, [id]);

  const handleDownloadCV = async () => {
    // Prevent multiple simultaneous downloads
    if (isDownloading) {
      return;
    }

    setIsDownloading(true);
    
    try {
      // Check if candidate data exists
      if (!candidateData) {
        alert('No candidate data available.');
        return;
      }

      console.log('Attempting to download CV for candidate:', id);
      
      const response = await fetch(`http://localhost:5190/api/ManagerCandidates/download-cv/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Accept': 'application/pdf, application/octet-stream, */*',
        },
      });

      console.log('Download response status:', response.status);
      console.log('Download response headers:', response.headers);

      if (!response.ok) {
        let errorMessage = 'Download failed';
        
        try {
          const errorData = await response.text();
          if (errorData) {
            errorMessage = errorData;
          }
        } catch (e) {
          // If we can't parse the error response, use the status
          if (response.status === 404) {
            errorMessage = 'CV file not found. The CV may not have been uploaded for this candidate.';
          } else if (response.status === 401) {
            errorMessage = 'Unauthorized access. Please login again.';
          } else if (response.status === 403) {
            errorMessage = 'Access denied. You do not have permission to download this CV.';
          } else if (response.status === 500) {
            errorMessage = 'Server error occurred while downloading the CV.';
          } else {
            errorMessage = `Download failed with status ${response.status}`;
          }
        }
        
        throw new Error(errorMessage);
      }

      // Check if response has content
      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength) === 0) {
        throw new Error('CV file is empty');
      }

      const blob = await response.blob();
      
      // Verify blob has content
      if (blob.size === 0) {
        throw new Error('Downloaded file is empty');
      }

      // Get filename from response headers or use default
      let filename = `Candidate_${candidateData.user?.firstName || 'Unknown'}_${candidateData.user?.lastName || 'Candidate'}_CV.pdf`;
      const contentDisposition = response.headers.get('content-disposition');
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      console.log('CV downloaded successfully');
      alert('CV downloaded successfully!');
      
    } catch (error) {
      console.error('Error downloading CV:', error);
      alert(`Failed to download CV: ${error.message}`);
    } finally {
      setIsDownloading(false);
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

  // Calculate marks for display
  const cvMark = Number(candidateData.cV_Mark || candidateData.cvMark || 0);
  const prescreenMark = Number(candidateData.pre_Screen_PassMark || candidateData.prescreenMark || candidateData.prescreenTestMark || candidateData.prescreen || 0);
  const totalMark = (cvMark * 0.5) + (prescreenMark * 0.5);

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
              <p className="font-bold">{cvMark}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pre-Screen Test Mark</p>
              <p className="font-bold">{prescreenMark}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Marks (CV 50% + Prescreen 50%)</p>
              <p className="font-bold">{totalMark.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Application Status</p>
              <p className="font-bold">{candidateData.status || 'N/A'}</p>
            </div>
          </div>

          <button
            onClick={handleDownloadCV}
            disabled={isDownloading}
            className={`w-full font-semibold py-3 px-4 rounded-full transition duration-300 transform hover:-translate-y-1 ${
              isDownloading
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-pink-600 hover:bg-pink-700 text-white'
            }`}
          >
            {isDownloading ? 'Downloading...' : 'Download CV'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;