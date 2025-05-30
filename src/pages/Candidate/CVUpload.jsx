import React, { useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from '../../context/AuthContext'; // Adjust path as needed

const CVUpload = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [message, setMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const userId = "F00E071C-FFCB-4D6C-92DB-6444E5C5EFF7";
  const vacancyId = "E745B9BF-DFA7-465E-AACC-45A3E123A199";

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

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
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
      setMessage("CV uploaded successfully!");
      setTimeout(() => {
        navigate('/jobs'); // Redirect back to jobs page after successful upload
      }, 2000);
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

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Header with back button */}
      <button
        onClick={goBack}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Jobs
      </button>

      {/* Job info header */}
      {jobData.jobTitle && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-800">
            Applying for: {jobData.jobTitle}
          </h2>
          <p className="text-blue-600">
            {jobData.location} • {jobData.type}
          </p>
        </div>
      )}

      <div
        className="my-4 p-6 min-h-96 border rounded-2xl shadow-md bg-white space-y-6"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Upload Your CV
        </h2>

        {/* Show drag and drop box only if no preview is shown */}
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

        {/* File Preview */}
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

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Submit CV
      </button>

        {/* Upload Progress Bar */}
        {uploadProgress > 0 && (
          <div className="mt-4 w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <p className="text-center text-sm text-gray-700 mt-1">
              {uploadProgress}%
            </p>
          </div>
        )}

      {/* Message */}
      {message && (
        <div className="mt-4 text-center text-green-600 font-medium">{message}</div>
      )}
    </div>
  );
};

export default CVUpload;