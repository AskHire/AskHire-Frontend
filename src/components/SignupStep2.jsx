import React, { useState } from 'react';

const SignupStep2 = ({ formData, setFormData, prevStep, onSubmit }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700">E-mail</label>
      <input 
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Password</label>
      <input 
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
      <input 
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
        required
      />
    </div>

    <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
      Sign in
    </button>
  </form>
  )
}

export default SignupStep2;