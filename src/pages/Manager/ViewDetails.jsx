import React from 'react';
import ManagerTopbar from '../../components/ManagerTopbar';

const ViewDetails = () => {
  return (
    <div className="bg-gray-100 flex-auto min-h-screen">
      <ManagerTopbar />

      <h2 className="text-2xl font-bold mb-4 pl-8 pt-8">Candidate Long-List</h2>
      
      <div className="flex justify-center px-4 pb-8">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl border border-blue-600">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Nicholas Patrick</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">NIC</p>
              <p className="font-medium">200219452782</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Age</p>
              <p className="font-medium">26</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium">Male</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">2nd street, Colombo 6</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">nicholaspatrick@gmail.com</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium">0781212121</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">CV Tally Mark</p>
              <p className="font-bold">87%</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Pre-Screen Test Mark</p>
              <p className="font-bold">88%</p>
            </div>
          </div>
          
          <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-4 rounded-full transition duration-300 transform hover:-translate-y-1">
            Download CV
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;