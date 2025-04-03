import React, { useState } from 'react';


const SignupStep1 = ({ formData, setFormData, nextStep }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        nextStep(); 
    };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">First Name</label>
        <input 
          type="text" 
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Last Name</label>
        <input 
          type="text"
          value={formData.lastName}
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700">Address</label>
      <input 
        type="text"
        value={formData.address}
        onChange={(e) => setFormData({...formData, address: e.target.value})}
        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
        required
      />
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
        <input 
          type="date"
          value={formData.dob}
          onChange={(e) => setFormData({...formData, dob: e.target.value})}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Gender</label>
        <div className="mt-1 space-x-4">
          <label className="inline-flex items-center">
            <input 
              type="radio" 
              name="gender" 
              value="male"
              checked={formData.gender === 'male'}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              className="form-radio" 
            />
            <span className="ml-2">Male</span>
          </label>
          <label className="inline-flex items-center">
            <input 
              type="radio" 
              name="gender" 
              value="female"
              checked={formData.gender === 'female'}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              className="form-radio" 
            />
            <span className="ml-2">Female</span>
          </label>
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input 
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">NIC</label>
        <input 
          type="text"
          value={formData.nic}
          onChange={(e) => setFormData({...formData, nic: e.target.value})}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
    </div>
    
    <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
      Next
    </button>
  </form>
  )
}

export default SignupStep1;