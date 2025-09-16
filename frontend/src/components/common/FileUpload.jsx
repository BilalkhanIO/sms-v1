import React, { useState, useRef } from 'react';
import { Upload, X, FileIcon, CheckCircle, AlertCircle } from 'lucide-react';

const FileUpload = ({
  accept = ".jpg,.jpeg,.png,.pdf",
  maxSize = 5 * 1024 * 1024, // 5MB
  multiple = false,
  onFileSelect,
  onFileRemove,
  value = [],
  label = "Upload Files",
  description = "Drag and drop files here, or click to select",
  disabled = false,
  className = ""
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({});
  const fileInputRef = useRef(null);

  const files = Array.isArray(value) ? value : value ? [value] : [];

  const validateFile = (file) => {
    const errors = [];
    
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
    }

    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    const acceptedExtensions = accept.split(',').map(ext => ext.trim().toLowerCase());
    
    if (!acceptedExtensions.includes(fileExtension)) {
      errors.push(`File type ${fileExtension} is not allowed`);
    }

    return errors;
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    
    newFiles.forEach(file => {
      const errors = validateFile(file);
      
      if (errors.length > 0) {
        setUploadStatus(prev => ({
          ...prev,
          [file.name]: { status: 'error', errors }
        }));
        return;
      }

      setUploadStatus(prev => ({
        ...prev,
        [file.name]: { status: 'success', errors: [] }
      }));

      if (onFileSelect) {
        onFileSelect(file);
      }
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (disabled) return;
    
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (fileToRemove) => {
    if (onFileRemove) {
      onFileRemove(fileToRemove);
    }
    setUploadStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[fileToRemove.name];
      return newStatus;
    });
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return '🖼️';
    } else if (extension === 'pdf') {
      return '📄';
    } else {
      return '📁';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-gray-400 cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />
        
        <Upload className={`mx-auto h-12 w-12 ${disabled ? 'text-gray-400' : 'text-gray-400'}`} />
        <p className="mt-2 text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-500 mt-1">
          Max size: {Math.round(maxSize / 1024 / 1024)}MB. Accepted: {accept}
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => {
            const status = uploadStatus[file.name];
            const hasError = status?.status === 'error';
            
            return (
              <div
                key={index}
                className={`
                  flex items-center justify-between p-3 rounded border
                  ${hasError ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}
                `}
              >
                <div className="flex items-center flex-1 min-w-0">
                  <span className="mr-3 text-lg">
                    {getFileIcon(file.name)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {hasError && (
                      <div className="mt-1">
                        {status.errors.map((error, errorIndex) => (
                          <p key={errorIndex} className="text-xs text-red-600">
                            {error}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center ml-4">
                  {hasError ? (
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file);
                    }}
                    disabled={disabled}
                    className="text-gray-400 hover:text-red-500 disabled:cursor-not-allowed"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileUpload;