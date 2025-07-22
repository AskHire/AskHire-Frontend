// import React, { useState, useRef } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from '../../context/AuthContext';

// const CVUpload = () => {
//   const { id } = useParams(); // vacancyId
//   const { currentUser } = useAuth();
//   const [file, setFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState("");
//   const [message, setMessage] = useState("");
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const fileInputRef = useRef(null);
//   const navigate = useNavigate();

//   const handleFileSelect = (selectedFile) => {
//     if (selectedFile) {
//       setFile(selectedFile);
//       const url = URL.createObjectURL(selectedFile);
//       setPreviewUrl(url);
//       setMessage("");
//       setUploadProgress(0);
//     }
//   };

//   const handleFileChange = (e) => {
//     handleFileSelect(e.target.files[0]);
//   };

//   const handleRemove = () => {
//     setFile(null);
//     setPreviewUrl("");
//     setUploadProgress(0);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setMessage("Please select a file first.");
//       return;
//     }

//     if (!currentUser?.id) {
//       setMessage("Please log in to upload your CV.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await axios.post(
//         `http://localhost:5190/api/CandidateFile/upload?userId=${currentUser.id}&vacancyId=${id}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           onUploadProgress: (progressEvent) => {
//             const percent = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             setUploadProgress(percent);
//           },
//         }
//       );

//       const { applicationId, message } = response.data;
//       setMessage(message || "CV uploaded successfully!");

//       // Navigate to CongratulationsCard2 with applicationId
//       navigate(`/candidate/congratulations/${applicationId}`);

//     } catch (error) {
//       console.error(error);
//       setMessage(error.response?.data?.message || "Error uploading CV.");
//       setUploadProgress(0);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const droppedFile = e.dataTransfer.files[0];
//     handleFileSelect(droppedFile);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   return (
//     <div
//       className="max-w-5xl mx-auto my-4 mt-10 p-6 min-h-96 border rounded-2xl shadow-md bg-white space-y-6"
//       onDrop={handleDrop}
//       onDragOver={handleDragOver}
//     >
//       <h2 className="text-3xl font-bold text-gray-800 text-center">Upload Your CV</h2>

//       {!previewUrl && (
//         <div
//           className="border-2 border-dashed border-gray-300 p-20 text-center rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
//           onClick={() => fileInputRef.current?.click()}
//         >
//           <p className="text-blue-700 font-semibold">
//             Drag and drop your CV here, or click to browse
//           </p>
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept=".pdf"
//             onChange={handleFileChange}
//             className="hidden"
//           />
//         </div>
//       )}

//       {previewUrl && (
//         <div className="mt-4">
//           <p className="text-gray-700 font-medium mb-2">Preview:</p>
//           <iframe
//             src={previewUrl}
//             title="CV Preview"
//             className="w-full h-[80vh] border rounded-md"
//           ></iframe>

//           <button
//             onClick={handleRemove}
//             className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
//           >
//             Remove File
//           </button>
//         </div>
//       )}

//       <button
//         onClick={handleUpload}
//         disabled={!currentUser?.id}
//         className={`w-full py-2 px-4 rounded-lg transition duration-300 ${
//           currentUser?.id 
//             ? 'bg-blue-500 text-white hover:bg-blue-600'
//             : 'bg-gray-400 text-gray-700 cursor-not-allowed'
//         }`}
//       >
//         {currentUser?.id ? 'Submit CV' : 'Please log in to upload'}
//       </button>

//       {uploadProgress > 0 && (
//         <div className="mt-4 w-full bg-gray-200 rounded-full h-4">
//           <div
//             className="bg-blue-500 h-4 rounded-full transition-all duration-300 ease-in-out"
//             style={{ width: `${uploadProgress}%` }}
//           ></div>
//           <p className="text-center text-sm text-gray-700 mt-1">{uploadProgress}%</p>
//         </div>
//       )}

//       {message && (
//         <div className={`mt-4 text-center font-medium ${
//           message.includes('success') ? 'text-green-600' : 'text-red-500'
//         }`}>
//           {message}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CVUpload;

import React, { useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';

const CVUpload = () => {
  const { id } = useParams(); // vacancyId
  const { currentUser } = useAuth();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [message, setMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setMessage("");
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e) => {
    handleFileSelect(e.target.files[0]);
  };

  const handleRemove = () => {
    setFile(null);
    setPreviewUrl("");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    if (!currentUser?.id) {
      setMessage("Please log in to upload your CV.");
      return;
    }

    try {
      // Check if CV already exists
      const checkResponse = await axios.get(
        `http://localhost:5190/api/CandidateFile/check`,
        {
          params: {
            userId: currentUser.id,
            vacancyId: id,
          },
        }
      );

      if (checkResponse.data.exists) {
        setMessage("You have already uploaded a CV for this vacancy.");
        return;
      }

      // Proceed to upload
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `http://localhost:5190/api/CandidateFile/upload?userId=${currentUser.id}&vacancyId=${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );

      const { applicationId, message } = response.data;
      setMessage(message || "CV uploaded successfully!");

      // Navigate to CongratulationsCard2 with applicationId
      navigate(`/candidate/congratulations/${applicationId}`);

    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Error uploading CV.");
      setUploadProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="max-w-5xl mx-auto my-4 mt-10 p-6 min-h-96 border rounded-2xl shadow-md bg-white space-y-6"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h2 className="text-3xl font-bold text-gray-800 text-center">Upload Your CV</h2>

      {!previewUrl && (
        <div
          className="border-2 border-dashed border-gray-300 p-20 text-center rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <p className="text-blue-700 font-semibold">
            Drag and drop your CV here, or click to browse
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {previewUrl && (
        <div className="mt-4">
          <p className="text-gray-700 font-medium mb-2">Preview:</p>
          <iframe
            src={previewUrl}
            title="CV Preview"
            className="w-full h-[80vh] border rounded-md"
          ></iframe>

          <button
            onClick={handleRemove}
            className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Remove File
          </button>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!currentUser?.id}
        className={`w-full py-2 px-4 rounded-lg transition duration-300 ${
          currentUser?.id 
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-400 text-gray-700 cursor-not-allowed'
        }`}
      >
        {currentUser?.id ? 'Submit CV' : 'Please log in to upload'}
      </button>

      {uploadProgress > 0 && (
        <div className="mt-4 w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${uploadProgress}%` }}
          ></div>
          <p className="text-center text-sm text-gray-700 mt-1">{uploadProgress}%</p>
        </div>
      )}

      {message && (
        <div className={`mt-4 text-center font-medium ${
          message.includes('success') ? 'text-green-600' : 'text-red-500'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default CVUpload;

// import React, { useState, useRef } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from '../../context/AuthContext';

// const CVUpload = () => {
//   const { id } = useParams(); // vacancyId
//   const { currentUser } = useAuth();
//   const [file, setFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState("");
//   const [message, setMessage] = useState("");
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [loading, setLoading] = useState(false); // ⬅️ Prevent multiple uploads
//   const fileInputRef = useRef(null);
//   const navigate = useNavigate();

//   const handleFileSelect = (selectedFile) => {
//     if (selectedFile) {
//       setFile(selectedFile);
//       const url = URL.createObjectURL(selectedFile);
//       setPreviewUrl(url);
//       setMessage("");
//       setUploadProgress(0);
//     }
//   };

//   const handleFileChange = (e) => {
//     handleFileSelect(e.target.files[0]);
//   };

//   const handleRemove = () => {
//     setFile(null);
//     setPreviewUrl("");
//     setUploadProgress(0);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setMessage("Please select a file first.");
//       return;
//     }

//     if (!currentUser?.id) {
//       setMessage("Please log in to upload your CV.");
//       return;
//     }

//     setLoading(true); // ⬅️ Lock upload/remove buttons

//     try {
//       const checkResponse = await axios.get(
//         `http://localhost:5190/api/CandidateFile/check`,
//         {
//           params: {
//             userId: currentUser.id,
//             vacancyId: id,
//           },
//         }
//       );

//       if (checkResponse.data.exists) {
//         setMessage("You have already uploaded a CV for this vacancy.");
//         setLoading(false);
//         return;
//       }

//       const formData = new FormData();
//       formData.append("file", file);

//       const response = await axios.post(
//         `http://localhost:5190/api/CandidateFile/upload?userId=${currentUser.id}&vacancyId=${id}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           onUploadProgress: (progressEvent) => {
//             const percent = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             setUploadProgress(percent);
//           },
//         }
//       );

//       const { applicationId, message } = response.data;
//       setMessage(message || "CV uploaded successfully!");
//       navigate(`/candidate/congratulations/${applicationId}`);
//     } catch (error) {
//       console.error(error);
//       setMessage(error.response?.data?.message || "Error uploading CV.");
//       setUploadProgress(0);
//     } finally {
//       setLoading(false); // ⬅️ Unlock buttons
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const droppedFile = e.dataTransfer.files[0];
//     handleFileSelect(droppedFile);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   return (
//     <div
//       className="max-w-5xl mx-auto my-4 mt-10 p-6 min-h-96 border rounded-2xl shadow-md bg-white space-y-6"
//       onDrop={handleDrop}
//       onDragOver={handleDragOver}
//     >
//       <h2 className="text-3xl font-bold text-gray-800 text-center">Upload Your CV</h2>

//       {!previewUrl && (
//         <div
//           className="border-2 border-dashed border-gray-300 p-20 text-center rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
//           onClick={() => fileInputRef.current?.click()}
//         >
//           <p className="text-blue-700 font-semibold">
//             Drag and drop your CV here, or click to browse
//           </p>
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept=".pdf"
//             onChange={handleFileChange}
//             className="hidden"
//           />
//         </div>
//       )}

//       {previewUrl && (
//         <div className="mt-4">
//           <p className="text-gray-700 font-medium mb-2">Preview:</p>
//           <iframe
//             src={previewUrl}
//             title="CV Preview"
//             className="w-full h-[80vh] border rounded-md"
//           ></iframe>

//           <button
//             onClick={handleRemove}
//             disabled={loading}
//             className={`mt-4 w-full py-2 px-4 rounded-lg transition duration-300 ${
//               loading
//                 ? 'bg-red-300 text-white cursor-not-allowed'
//                 : 'bg-red-500 text-white hover:bg-red-600'
//             }`}
//           >
//             Remove File
//           </button>
//         </div>
//       )}

//       <button
//         onClick={handleUpload}
//         disabled={!currentUser?.id || loading}
//         className={`w-full py-2 px-4 rounded-lg transition duration-300 ${
//           currentUser?.id && !loading
//             ? 'bg-blue-500 text-white hover:bg-blue-600'
//             : 'bg-gray-400 text-gray-700 cursor-not-allowed'
//         }`}
//       >
//         {loading ? 'Uploading...' : currentUser?.id ? 'Submit CV' : 'Please log in to upload'}
//       </button>

//       {uploadProgress > 0 && (
//         <div className="mt-4 w-full bg-gray-200 rounded-full h-4">
//           <div
//             className="bg-blue-500 h-4 rounded-full transition-all duration-300 ease-in-out"
//             style={{ width: `${uploadProgress}%` }}
//           ></div>
//           <p className="text-center text-sm text-gray-700 mt-1">{uploadProgress}%</p>
//         </div>
//       )}

//       {message && (
//         <div className={`mt-4 text-center font-medium ${
//           message.includes('success') ? 'text-green-600' : 'text-red-500'
//         }`}>
//           {message}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CVUpload;
