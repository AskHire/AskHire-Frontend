import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Check, AlertCircle } from 'lucide-react';
//import { Alert, AlertDescription } from '@/components/alert';

const CVUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (file) => {
    setError(null);
    
    if (!file) return;
    
    if (!file.type.includes('pdf')) {
      setError('Please upload a PDF file only');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    setIsUploading(true);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }
    
    setIsUploading(false);
    setUploadProgress(0);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Upload Your CV</h2>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div
          onDrop={handleFileDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center
            ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500'}
          `}
        >
          {!file ? (
            <div>
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Drag and drop your CV here or</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                browse files
              </button>
              <p className="text-sm text-gray-500 mt-2">PDF files only, max 5MB</p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-500 mr-3" />
                <div className="text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          )}
        </div>

        {file && !isUploading && (
          <button
            onClick={handleUpload}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center"
          >
            <Upload className="mr-2 h-5 w-5" />
            Upload CV
          </button>
        )}

        {isUploading && (
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVUpload;