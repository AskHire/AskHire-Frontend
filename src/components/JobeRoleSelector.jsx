// import React, { useState, useEffect } from 'react';
// import { ChevronDown, Search } from 'lucide-react';

// const JobRoleSelector = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedRole, setSelectedRole] = useState('');
//   const [jobRoles, setJobRoles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchJobRoles = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('http://localhost:5175/api/JobRole');
        
//         if (!response.ok) {
//           throw new Error(`API request failed with status ${response.status}`);
//         }
        
//         const data = await response.json();
//         setJobRoles(data);
        
//         // Don't auto-select the first job role anymore
//         // Let user explicitly make a selection
//       } catch (err) {
//         console.error('Error fetching job roles:', err);
//         setError('Failed to load job roles. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobRoles();
//   }, []);

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };
  
//   const selectRole = (role) => {
//     setSelectedRole(role);
//     setIsOpen(false);
//   };
  
//   return (
//     <div className="w-full max-w-3xl p-8 bg-white rounded-3xl shadow-md border border-gray-200">
//       <h1 className="text-3xl font-bold mb-8 ml-4">Select Job Role</h1>
      
//       <div className="relative w-full">
//         <div
//           className="flex items-center justify-between p-4 px-6 rounded-full border border-gray-200 bg-white shadow-sm cursor-pointer"
//           onClick={toggleDropdown}
//         >
//           <div className="flex items-center gap-2">
//             <Search className="text-gray-400" size={20} />
//             <span className="text-lg">
//               {loading ? 'Loading...' : selectedRole || 'Select Job Role'}
//             </span>
//           </div>
//           <ChevronDown className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//         </div>
        
//         {isOpen && !loading && (
//           <div className="absolute w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
//             {error ? (
//               <p className="px-6 py-4 text-red-500">{error}</p>
//             ) : jobRoles.length === 0 ? (
//               <p className="px-6 py-4">No job roles found</p>
//             ) : (
//               <ul className="py-2 max-h-60 overflow-y-auto">
//                 {jobRoles.map((role) => (
//                   <li
//                     key={role.jobId}
//                     className="px-6 py-3 hover:bg-gray-100 cursor-pointer"
//                     onClick={() => selectRole(role.jobTitle)}
//                   >
//                     {role.jobTitle}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default JobRoleSelector;