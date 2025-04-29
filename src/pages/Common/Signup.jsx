import React, { useState } from 'react'
import SignupStep1 from '../../components/SignupStep1';
import SignupStep2 from '../../components/SignupStep2';
import { FcGoogle } from "react-icons/fc";

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
    <div className="hidden md:block md:w-2/5 bg-blue-500 relative rounded-r-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-50 rounded-r-3xl "></div>
    </div>
    
    {/* Right Side - Form */}
    <div className="w-full md:w-3/5 px-16 py-4">
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
            <button className="w-full mt-4 py-3 border border-gray-300 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-50">
                <FcGoogle />
                <span>Sign in with Google</span>
            </button>
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
