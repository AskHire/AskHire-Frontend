import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, } from 'lucide-react';

const JobShow = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const jobData = location.state || {};


    // Calculate days remaining from endDate
    const calculateDaysRemaining = (endDate) => {
        if (!endDate) return null;

        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const daysRemaining = calculateDaysRemaining(jobData.endDate);


    const goBack = () => {
        navigate(-1);
    };

    if (!jobData.title) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <p>Job details not found.</p>
                <button
                    onClick={goBack}
                    className="mt-4 flex items-center text-blue-600"
                >
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Jobs
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            {/* Header with back button */}
            <button
                onClick={goBack}
                className="mb-6 flex items-center text-blue-600"
            >
                <ArrowLeft size={16} className="mr-1" />
                Back to Jobs
            </button>

            {/* Job details card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-2xl font-bold">{jobData.title}</h1>
                    {daysRemaining !== null && (
                        <div className="text-red-500 font-medium">
                            End in {daysRemaining} days
                        </div>
                    )}
                </div>

                <div className="flex space-x-4 text-gray-600 mb-4">
                    <div>{jobData.location}</div>
                    <div>{jobData.type}</div>
                </div>

                <p className="text-gray-700 mb-6">{jobData.description}</p>

                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-3">Job Requirements</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium">1. Technical Skills:</h3>
                            <ul className="list-disc list-inside ml-4 text-gray-700">
                                <li>Proficiency in programming languages such as Java, Python, or C++.</li>
                                <li>Experience with frameworks, libraries, and tools related to your field (e.g., React, Spring Boot).</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium">2. Problem-Solving:</h3>
                            <ul className="list-disc list-inside ml-4 text-gray-700">
                                <li>Ability to analyze and solve complex technical issues.</li>
                                <li>Innovate and optimize systems for better performance and scalability.</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium">3. Collaboration:</h3>
                            <ul className="list-disc list-inside ml-4 text-gray-700">
                                <li>Work closely with designers, product managers, and other engineers.</li>
                                <li>Participate in code reviews and contribute to team discussions.</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium">4. Communication:</h3>
                            <ul className="list-disc list-inside ml-4 text-gray-700">
                                <li>Document and share progress, issues, and ideas with stakeholders.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {jobData.instructions && (
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Application Instructions</h2>
                        <p className="text-gray-700">{jobData.instructions}</p>
                    </div>
                )}
                <div>
                    <button
                        className="mt-auto bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md text-center w-full" >
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobShow;