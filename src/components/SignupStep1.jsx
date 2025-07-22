import React from 'react';

const SignupStep1 = ({ formData, setFormData, nextStep, setError }) => {

  // Regex for validating names: allows letters, spaces, apostrophes, hyphens, and periods.
  const nameCharRegex = /^[a-zA-Z\s.'-]+$/;

  /**
   * Validates a given name field based on "real name" criteria.
   * Mimics backend validation logic for consistency.
   * @param {string} name - The name string to validate (e.g., first name, last name).
   * @param {string} fieldName - The user-friendly name of the field (e.g., "First name").
   * @param {Array<string>} errors - An array to accumulate validation error messages.
   * @returns {boolean} True if the name is valid, false otherwise.
   */
  const validateRealName = (name, fieldName, errors) => {
    // Check for emptiness after trimming
    if (!name || name.trim().length === 0) {
      errors.push(`${fieldName} is required.`);
      return false;
    }

    const trimmedName = name.trim();

    // Validate length
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      errors.push(`${fieldName} must be between 2 and 50 characters.`);
      return false;
    }

    // Validate allowed characters
    if (!nameCharRegex.test(trimmedName)) {
      errors.push(`${fieldName} can only contain letters, spaces, apostrophes, hyphens, and periods.`);
      return false;
    }

    // Ensure at least one letter is present
    if (!/[a-zA-Z]/.test(trimmedName)) {
      errors.push(`${fieldName} must contain at least one letter.`);
      return false;
    }

    // Ensure it starts and ends with a letter
    const firstChar = trimmedName.charAt(0);
    const lastChar = trimmedName.charAt(trimmedName.length - 1);
    if (!/[a-zA-Z]/.test(firstChar) || !/[a-zA-Z]/.test(lastChar)) {
      errors.push(`${fieldName} must start and end with a letter.`);
      return false;
    }

    // Prevent consecutive special characters or multiple spaces
    if (trimmedName.includes("--") || trimmedName.includes("''") || trimmedName.includes("..") || trimmedName.includes("  ")) {
      errors.push(`${fieldName} contains invalid consecutive special characters or spaces.`);
      return false;
    }

    return true; // Name passed all checks
  };

  /**
   * Validates all fields in Signup Step 1.
   * Collects all errors and sets a single error message for the parent component.
   * @returns {boolean} True if all validations pass, false otherwise.
   */
  const validateStep1 = () => {
    let errors = []; // Array to store all validation messages

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
          age--; // Adjust age if birthday hasn't occurred yet this year
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

    // Validate Phone Number (Sri Lankan mobile numbers)
    if (!formData.phone || formData.phone.trim().length === 0) {
      errors.push('Phone number is required.');
    } else if (!/^(?:0|\+94)?(?:7\d)\d{7}$/.test(formData.phone)) {
      errors.push('Invalid Sri Lankan mobile number. Must be 10 digits (e.g., 0712345678 or +94712345678).');
    }

    // Validate NIC (Old or New format)
    if (!formData.nic || formData.nic.trim().length === 0) {
      errors.push('NIC number is required.');
    } else if (!/^(\d{9}[vV]|\d{12})$/.test(formData.nic)) {
      errors.push('Invalid NIC. Must be 9 digits ending with "V" (old format) or 12 digits (new format).');
    }

    // If any errors exist, set the combined error message and return false.
    if (errors.length > 0) {
      setError(errors.join(' ')); // Join all error messages into a single string
      return false;
    }

    setError(''); // Clear any previous errors if all validations pass
    return true;
  };

  /**
   * Handles the form submission.
   * Prevents default form submission and proceeds to the next step only if validation passes.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      nextStep(); // Move to the next signup step
    }
  };

  // Calculate the minimum and maximum allowed dates for the Date of Birth input.
  // This helps constrain the calendar picker.
  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate()).toISOString().split('T')[0];
  const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate()).toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* First Name and Last Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      {/* Address Field */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
        <input
          type="text"
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Date of Birth and Gender Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            id="dob"
            min={minDate} // Sets the earliest selectable date for the calendar
            max={maxDate} // Sets the latest selectable date for the calendar
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <div className="mt-1 space-x-4">
            <label htmlFor="genderMale" className="inline-flex items-center">
              <input
                type="radio"
                id="genderMale"
                name="gender"
                value="Male"
                checked={formData.gender === 'Male'}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="form-radio text-blue-600"
                required
              />
              <span className="ml-2">Male</span>
            </label>
            <label htmlFor="genderFemale" className="inline-flex items-center">
              <input
                type="radio"
                id="genderFemale"
                name="gender"
                value="Female"
                checked={formData.gender === 'Female'}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="form-radio text-blue-600"
                required
              />
              <span className="ml-2">Female</span>
            </label>
            <label htmlFor="genderOther" className="inline-flex items-center">
              <input
                type="radio"
                id="genderOther"
                name="gender"
                value="Other"
                checked={formData.gender === 'Other'}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="form-radio text-blue-600"
                required
              />
              <span className="ml-2">Other</span>
            </label>
          </div>
        </div>
      </div>

      {/* Phone Number and NIC Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label htmlFor="nic" className="block text-sm font-medium text-gray-700">NIC</label>
          <input
            type="text"
            id="nic"
            value={formData.nic}
            onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      {/* Next Button */}
      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
      >
        Next
      </button>
    </form>
  );
};

export default SignupStep1;