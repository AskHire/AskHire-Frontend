import React from 'react';

const ViewDetails = () => {
  // Sample data for the candidate
  const candidate = {
    name: 'Nicholas Patrick',
    id: '200219452782',
    age: 26,
    gender: 'Male',
    address: '2nd street, Colombia 6',
    email: 'nicholaspatrick@gmail.com',
    phoneNumber: '0781212321',
    cvTallyMark: '87%',
    preScreenTextMark: '88%',
  };

  // Handler for downloading CV
  const handleDownloadCV = () => {
    console.log('Downloading CV...');
    // Add logic to download the CV (e.g., call an API or open a file)
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6">Candidate Long-List</h1>

        {/* Candidate Details Section */}
        <h2 className="text-xl font-semibold mb-4">Candidate Details</h2>

        {/* Candidate Information */}
        <div className="space-y-4 text-left">
          <div className="flex justify-between">
            <span className="font-medium">Name</span>
            <span>{candidate.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">ID</span>
            <span>{candidate.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Age</span>
            <span>{candidate.age}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Gender</span>
            <span>{candidate.gender}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Address</span>
            <span>{candidate.address}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Email</span>
            <span>{candidate.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Phone Number</span>
            <span>{candidate.phoneNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">CV Tally Mark</span>
            <span>{candidate.cvTallyMark}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Pre-Screen Text Mark</span>
            <span>{candidate.preScreenTextMark}</span>
          </div>
        </div>

        {/* Download CV Button */}
        <div className="mt-6">
          <button
            onClick={handleDownloadCV}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Download CV
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
