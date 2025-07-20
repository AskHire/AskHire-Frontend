import React from 'react';

const SignupStep1 = ({ formData, setFormData, nextStep, setError }) => {

  // New Regex for general character allowance (matches backend DTO regex)
  const nameCharRegex = /^[a-zA-Z\s.'-]+$/;

  // Function to perform "real name" validation logic (mimics backend AuthService.IsRealName)
  const validateRealName = (name, fieldName) => {
    // Check if the field is empty after trimming
    if (!name || name.trim().length === 0) {
      setError(`${fieldName} is required.`);
      return false;
    }
    
    const trimmedName = name.trim();

    // Check length (redundant with DTO but good client-side UX)
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      setError(`${fieldName} must be between 2 and 50 characters.`);
      return false;
    }

    // Check general allowed characters (from DTO's regex)
    if (!nameCharRegex.test(trimmedName)) {
      setError(`${fieldName} can only contain letters, spaces, apostrophes, hyphens, and periods.`);
      return false;
    }

    // Ensure it contains at least one letter (from AuthService.IsRealName)
    if (!/[a-zA-Z]/.test(trimmedName)) {
      setError(`${fieldName} must contain at least one letter.`);
      return false;
    }

    // Ensure it starts and ends with a letter (from AuthService.IsRealName)
    if (!/[a-zA-Z]/.test(trimmedName.charAt(0)) || !/[a-zA-Z]/.test(trimmedName.charAt(trimmedName.length - 1))) {
      setError(`${fieldName} must start and end with a letter.`);
      return false;
    }

    // Prevent multiple consecutive hyphens or apostrophes (from AuthService.IsRealName)
    if (trimmedName.includes("--") || trimmedName.includes("''")) {
        setError(`${fieldName} contains invalid consecutive special characters.`);
        return false;
    }

    return true; // Name passes all "real name" checks
  };

  const validateStep1 = () => {
    // Clear previous error message at the start of validation
    setError('');

    // Validate First Name
    if (!validateRealName(formData.firstName, "First name")) {
      return false;
    }

    // Validate Last Name
    if (!validateRealName(formData.lastName, "Last name")) {
      return false;
    }

    // Validate Address
    if (!formData.address || formData.address.trim().length === 0) {
      setError('Address is required.');
      return false;
    }
    if (formData.address.length > 200) {
        setError('Address cannot exceed 200 characters.');
        return false;
    }

    // Validate Date of Birth (DOB) - now required
    if (!formData.dob) {
      setError('Date of Birth is required.');
      return false;
    }
    const dobDate = new Date(formData.dob);
    if (isNaN(dobDate.getTime())) {
        setError('Invalid Date of Birth format. Please use YYYY-MM-DD.');
        return false;
    }
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    if (age < 16 || age > 100) {
      setError('You must be between 16 and 100 years old.');
      return false;
    }

    // Validate Gender - now required
    if (!formData.gender) {
      setError('Gender is required.');
      return false;
    }

    // Validate Phone Number - now required
    if (!formData.phone || formData.phone.trim().length === 0) {
        setError('Phone number is required.');
        return false;
    }
    if (!/^(?:0|\+94)?(?:7\d)\d{7}$/.test(formData.phone)) {
      setError('Invalid Sri Lankan mobile number. Must be 10 digits (e.g., 0712345678 or +94712345678).');
      return false;
    }

    // Validate NIC - now required
    if (!formData.nic || formData.nic.trim().length === 0) {
        setError('NIC number is required.');
        return false;
    }
    if (!/^(\d{9}[vV]|\d{12})$/.test(formData.nic)) {
      setError('Invalid NIC. Must be 9 digits ending with "V" (old format) or 12 digits (new format).');
      return false;
    }

    setError(''); // Clear error if all validations pass
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      nextStep(); 
    }
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
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input 
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required // Now required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input 
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({...formData, dob: e.target.value})}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required // Now required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <div className="mt-1 space-x-4">
            <label className="inline-flex items-center">
              <input 
                type="radio" 
                name="gender" 
                value="Male"
                checked={formData.gender === 'Male'}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="form-radio text-blue-600" 
                required // Now required
              />
              <span className="ml-2">Male</span>
            </label>
            <label className="inline-flex items-center">
              <input 
                type="radio" 
                name="gender" 
                value="Female"
                checked={formData.gender === 'Female'}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="form-radio text-blue-600" 
                required // Now required
              />
              <span className="ml-2">Female</span>
            </label>
            <label className="inline-flex items-center">
              <input 
                type="radio" 
                name="gender" 
                value="Other"
                checked={formData.gender === 'Other'}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="form-radio text-blue-600" 
                required // Now required
              />
              <span className="ml-2">Other</span>
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
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required // Now required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">NIC</label>
          <input 
            type="text"
            value={formData.nic}
            onChange={(e) => setFormData({...formData, nic: e.target.value})}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required // Now required
          />
        </div>
      </div>
      
      <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200">
        Next
      </button>
    </form>
  );
};

export default SignupStep1;