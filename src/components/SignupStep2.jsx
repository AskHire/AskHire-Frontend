import React from 'react';

const SignupStep2 = ({ formData, setFormData, prevStep, onSubmit, isLoading, setError }) => {
  const validateStep2 = () => {
    // Clear previous error message at the start of validation
    setError('');

    // Validate Email
    if (!formData.email.trim()) {
      setError('Email is required.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    // Validate Password
    if (!formData.password) {
      setError('Password is required.');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must have at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return false;
    }

    // Validate Confirm Password
    if (!formData.confirmPassword) {
      setError('Confirm Password is required.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    setError(''); // Clear error if all validations pass
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep2()) {
      onSubmit(); // Call the parent's onSubmit function for final registration
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">E-mail</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={prevStep}
          className="w-1/2 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="w-1/2 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Registering...' : 'Sign Up'}
        </button>
      </div>
    </form>
  );
};

export default SignupStep2;