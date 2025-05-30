import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import SignupStep1 from '../../components/SignupStep1';
import SignupStep2 from '../../components/SignupStep2';

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    dob: '',
    gender: '',
    phone: '',
    nic: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const nextStep = () => {
    setStep(step + 1);
    setError(''); // Clear any errors when moving to next step
  };
  
  const prevStep = () => {
    setStep(step - 1);
    setError(''); // Clear any errors when moving back
  };

  const handleSubmit = async () => {
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
        mobileNumber: formData.phone || null,
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

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-screen h-screen bg-white relative overflow-hidden">
      {/* Close/Home Button in Top Right Corner of Full Page */}
      <button
        onClick={handleHomeClick}
        className="absolute top-0 right-0 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 p-2 transition-all duration-200 shadow-sm hover:shadow-md z-10"
        title="Go to Home"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
      </button>

      {/* Left Side - Blue Background */}
      <div className="hidden md:flex md:w-2/5 relative overflow-hidden rounded-r-3xl">
        <div className="w-full h-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative">
          {/* Curved shape */}
          <div className="absolute top-0 right-0 w-full h-full">
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <path 
                d="M0,0 L60,0 Q80,20 85,50 Q80,80 60,100 L0,100 Z" 
                fill="url(#gradient)"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          {/* Decorative circles */}
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white bg-opacity-10"></div>
          <div className="absolute bottom-32 left-20 w-24 h-24 rounded-full bg-white bg-opacity-5"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-white bg-opacity-10"></div>
        </div>
      </div>
    
      {/* Right Side - Form */}
      <div className="w-full md:w-3/5 px-8 md:px-16 py-8 md:py-12 overflow-y-auto max-h-screen">
        <h2 className="text-3xl font-bold mb-8">Sign Up</h2>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {step === 1 ? (
          <SignupStep1 
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
          />
        ) : (
          <SignupStep2
            formData={formData}
            setFormData={setFormData}
            prevStep={prevStep}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
        
        {/* Progress Indicator */}
        <div className="mt-6 flex items-center justify-center space-x-2">
          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
            step >= 1 ? 'bg-green-500 text-white' : 'border-2 border-gray-200'
          }`}>1</div>
          <div className="w-16 h-1 bg-gray-200"></div>
          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
            step >= 2 ? 'bg-green-500 text-white' : 'border-2 border-gray-200'
          }`}>2</div>
        </div>
        
        <div className="mt-6 text-center">
          <span className="text-gray-600">Or</span>
          <p className="mt-4 text-gray-600">
            Do you have an account? 
            <Link to="/login" className="text-blue-600 hover:underline ml-1">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;