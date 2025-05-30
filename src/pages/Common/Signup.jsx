// import { useState } from 'react'
// import SignupStep1 from '../../components/SignupStep1';
// import SignupStep2 from '../../components/SignupStep2';

// const SignUp = () => {
//     const [step, setStep] = useState(1);
//     const [formData, setFormData] = useState({
//         firstName: '',
//         lastName: '',
//         address: '',
//         dob: '',
//         gender: '',
//         phone: '',
//         nic: '',
//         email: '',
//         password: '',
//         confirmPassword: ''
//     });

//     const nextStep = () => {
//         setStep(step + 1);
//     };
    
//     const prevStep = () => {
//         setStep(step - 1);
//     };

//     const handleSubmit = () => {
//         // send the data to backend
//         console.log('Form submitted:', formData);
//     };

//   return (
//     <div className="flex min-h-screen bg-white">
//     {/* Left Side - Blue Background */}
//     <div className="hidden md:flex md:w-2/5 relative overflow-hidden rounded-r-3xl">
//         <div className="w-full h-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative">
//           {/* Curved shape */}
//           <div className="absolute top-0 right-0 w-full h-full">
//             <svg 
//               viewBox="0 0 100 100" 
//               className="w-full h-full"
//               preserveAspectRatio="none"
//             >
//               <path 
//                 d="M0,0 L60,0 Q80,20 85,50 Q80,80 60,100 L0,100 Z" 
//                 fill="url(#gradient)"
//               />
//               <defs>
//                 <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                   <stop offset="0%" stopColor="#60a5fa" />
//                   <stop offset="50%" stopColor="#3b82f6" />
//                   <stop offset="100%" stopColor="#2563eb" />
//                 </linearGradient>
//               </defs>
//             </svg>
//           </div>
          
//           {/* Decorative circles */}
//           <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white bg-opacity-10"></div>
//           <div className="absolute bottom-32 left-20 w-24 h-24 rounded-full bg-white bg-opacity-5"></div>
//           <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-white bg-opacity-10"></div>
//         </div>
//       </div>
    
//     {/* Right Side - Form */}
//     <div className="w-full md:w-3/5 px-16 py-12">
//         <h2 className="text-3xl font-bold mb-8">Sign Up</h2>
        
//         {step === 1 ? (
//             <SignupStep1 
//                 formData={formData}
//                 setFormData={setFormData}
//                 nextStep={nextStep}  // nextStep is passed here
//             />
//         ) : (
//             <SignupStep2  // Fixed component 
//                 formData={formData}
//                 setFormData={setFormData}
//                 prevStep={prevStep}
//                 onSubmit={handleSubmit}
//             />
//         )}
        
//         {/* Progress Indicator */}
//         <div className="mt-6 flex items-center justify-center space-x-2">
//             <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
//                 step >= 1 ? 'bg-green-500 text-white' : 'border-2 border-gray-200'
//             }`}>1</div>
//             <div className="w-16 h-1 bg-gray-200"></div>
//             <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
//                 step >= 2 ? 'bg-green-500 text-white' : 'border-2 border-gray-200'
//             }`}>2</div>
//         </div>
        
//         <div className="mt-6 text-center">
//             <span className="text-gray-600">Or</span>
//             <p className="mt-4 text-gray-600">
//                 Do you have an account? 
//                 <a href="/login" className="text-blue-600 hover:underline ml-1 ">Log in</a>
//             </p>
//         </div>
//     </div>
// </div>
//   )
// }

// export default SignUp



import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService'; // Import authService directly

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    nic: '',
    mobileNumber: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form data
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Create request object matching backend UserRegisterDto
      const registerData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender || null,
        dob: formData.dob || null,
        nic: formData.nic || null,
        mobileNumber: formData.mobileNumber || null,
        address: formData.address || null
      };

      // Call authService.register
      const userData = await authService.register(registerData);

      // Show success alert
      alert('Registration successful! Please sign in.');

      // Redirect to login page
      navigate('/login', { state: { message: 'Registration successful. Please sign in.' } });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-gray-600">Register for a new account</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Email */}
            <div className="col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            
            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            
            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender (optional)</label>
              <select
                id="gender"
                name="gender"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            {/* Date of Birth */}
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth (optional)</label>
              <input
                id="dob"
                name="dob"
                type="date"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>
            
            {/* NIC */}
            <div>
              <label htmlFor="nic" className="block text-sm font-medium text-gray-700">NIC (optional)</label>
              <input
                id="nic"
                name="nic"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.nic}
                onChange={handleChange}
              />
            </div>
            
            {/* Mobile Number */}
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number (optional)</label>
              <input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.mobileNumber}
                onChange={handleChange}
              />
            </div>
            
            {/* Address */}
            <div className="col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address (optional)</label>
              <textarea
                id="address"
                name="address"
                rows="3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.address}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

