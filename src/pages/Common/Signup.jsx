import { useState } from 'react'
import SignupStep1 from '../../components/SignupStep1';
import SignupStep2 from '../../components/SignupStep2';

const SignUp = () => {
    const [step, setStep] = useState(1);
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
    };
    
    const prevStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = () => {
        // send the data to backend
        console.log('Form submitted:', formData);
    };

  return (
    <div className="flex min-h-screen bg-white">
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
    <div className="w-full md:w-3/5 px-16 py-12">
        <h2 className="text-3xl font-bold mb-8">Sign Up</h2>
        
        {step === 1 ? (
            <SignupStep1 
                formData={formData}
                setFormData={setFormData}
                nextStep={nextStep}  // nextStep is passed here
            />
        ) : (
            <SignupStep2  // Fixed component 
                formData={formData}
                setFormData={setFormData}
                prevStep={prevStep}
                onSubmit={handleSubmit}
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
                <a href="/login" className="text-blue-600 hover:underline ml-1 ">Log in</a>
            </p>
        </div>
    </div>
</div>
  )
}

export default SignUp
