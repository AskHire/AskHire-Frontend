import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg my-10 p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-black mb-1">About Us</h2>
        <p className="text-sm text-gray-500">Learn more about AskHire</p>

      
      <div className="mt-6 text-justify">
        <p className="text-gray-700 mb-4 ">
          AskHire is an intelligent recruitment automation platform designed to streamline and enhance the hiring journey for modern companies. From AI-powered CV matching and smart interview scheduling to seamless candidate management - we bring speed, simplicity and smart technology to every step of your hiring process.
        </p>
        <p className="text-gray-700 mb-4">
          Built with innovation and scalability in mind, AskHire empowers HR managers to make data-driven decisions, reduce manual workload and create a personalized, efficient and transparent recruitment experience for candidates and teams alike.
        </p>
        <p className="text-gray-700 mb-10">
          Our mission is simple, "To help businesses hire the right talent, faster and smarter".
        </p>
        
        <h3 className="text-xl font-semibold text-black mb-5">Contact Us</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-base mr-3" />
            <span className="text-gray-700">Email: <a href="mailto:support@askhire.com" className="text-blue-600 hover:underline">support@askhire.com</a></span>
          </div>
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-black mr-3" />
            <span className="text-gray-700">Phone: +94 123456789</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-black mr-3" />
            <span className="text-gray-700">Address: Colombo, Sri Lanka</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;