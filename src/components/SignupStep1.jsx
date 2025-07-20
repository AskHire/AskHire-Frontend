import React from 'react';

const SignupStep1 = ({ formData, setFormData, nextStep, setError }) => {

  // New Regex for general character allowance (matches backend DTO regex)
  const nameCharRegex = /^[a-zA-Z\s.'-]+$/;

  // Function to perform "real name" validation logic (mimics backend AuthService.IsRealName)
  const validateRealName = (name, fieldName, errors) => {
    // Check if the field is empty after trimming
    if (!name || name.trim().length === 0) {
      errors.push(`${fieldName} is required.`);
      return false; // Indicate a failure for this specific field
    }

    const trimmedName = name.trim();

    // Check length (redundant with DTO but good client-side UX)
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      errors.push(`${fieldName} must be between 2 and 50 characters.`);
      return false;
    }

    // Check general allowed characters (from DTO's regex)
    if (!nameCharRegex.test(trimmedName)) {
      errors.push(`${fieldName} can only contain letters, spaces, apostrophes, hyphens, and periods.`);
      return false;
    }

    // Ensure it contains at least one letter (from AuthService.IsRealName)
    if (!/[a-zA-Z]/.test(trimmedName)) {
      errors.push(`${fieldName} must contain at least one letter.`);
      return false;
    }

    // Ensure it starts and ends with a letter (from AuthService.IsRealName)
    if (!/[a-zA-Z]/.test(trimmedName.charAt(0)) || !/[a-zA-Z]/.test(trimmedName.charAt(trimmedName.length - 1))) {
      errors.push(`${fieldName} must start and end with a letter.`);
      return false;
    }

    // Prevent multiple consecutive hyphens, apostrophes, or periods, and also multiple spaces.
    if (trimmedName.includes("--") || trimmedName.includes("''") || trimmedName.includes("..") || trimmedName.includes("  ")) {
        errors.push(`${fieldName} contains invalid consecutive special characters or spaces.`);
        return false;
    }

    return true; // Name passes all "real name" checks
  };

  const validateStep1 = () => {
    let errors = []; // Collect all errors in an array

    // Validate First Name
    validateRealName(formData.firstName, "First name", errors);

    // Validate Last Name
    validateRealName(formData.lastName, "Last name", errors);

    // Validate Address
    if (!formData.address || formData.address.trim().length === 0) {
      errors.push('Address is required.');
    } else if (formData.address.length > 200) {
        errors.push('Address cannot exceed 200 characters.');
    }

    // Validate Date of Birth (DOB)
    if (!formData.dob) {
      errors.push('Date of Birth is required.');
    } else {
      const dobDate = new Date(formData.dob);
      if (isNaN(dobDate.getTime())) {
          errors.push('Invalid Date of Birth format. Please use YYYY-MM-DD.');
      } else {
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const m = today.getMonth() - dobDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
          age--;
        }
        if (age < 16 || age > 100) {
          errors.push('You must be between 16 and 100 years old.');
        }
      }
    }

    // Validate Gender
    if (!formData.gender) {
      errors.push('Gender is required.');
    }

    // Validate Phone Number
    if (!formData.phone || formData.phone.trim().length === 0) {
        errors.push('Phone number is required.');
    } else if (!/^(?:0|\+94)?(?:7\d)\d{7}$/.test(formData.phone)) {
      errors.push('Invalid Sri Lankan mobile number. Must be 10 digits (e.g., 0712345678 or +94712345678).');
    }

    // Validate NIC
    if (!formData.nic || formData.nic.trim().length === 0) {
        errors.push('NIC number is required.');
    } else if (!/^(\d{9}[vV]|\d{12})$/.test(formData.nic)) {
      errors.push('Invalid NIC. Must be 9 digits ending with "V" (old format) or 12 digits (new format).');
    }

    // After all checks, if there are errors, set the parent error state
    if (errors.length > 0) {
      setError(errors.join(' ')); // Join all messages into a single string
      return false;
    }

    setError(''); // Clear error if all validations pass
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      nextStep(); // Only proceed if validation passes
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
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                value="Male"
                checked={formData.gender === 'Male'}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="form-radio text-blue-600"
                required
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
                required
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
                required
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
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">NIC</label>
          <input
            type="text"
            value={formData.nic}
            onChange={(e) => setFormData({...formData, nic: e.target.value})}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
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