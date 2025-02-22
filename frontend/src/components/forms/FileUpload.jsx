import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, File, Image } from 'lucide-react';
import { useField } from 'formik';
import Spinner from '../common/Spinner';

const FileUpload = ({
  name,
  label,
  accept,
  multiple = false,
  maxSize = 5000000, // 5MB
  maxFiles = 5,
  showPreview = true,
  description,
  className = '',
}) => {
  const [field, meta, helpers] = useField(name);
  const [uploadProgress, setUploadProgress] = useState({});

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!multiple && acceptedFiles.length > 0) {
        acceptedFiles = [acceptedFiles[0]];
      }

      // Initialize progress for each file
      const newProgress = {};
      acceptedFiles.forEach(file => {
        newProgress[file.name] = 0;
      });
      setUploadProgress(newProgress);

      // Simulate upload progress
      acceptedFiles.forEach(file => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: progress,
          }));
          if (progress >= 100) {
            clearInterval(interval);
          }
        }, 100);
      });

      // Update form field value
      helpers.setValue(multiple ? [...(field.value || []), ...acceptedFiles] : acceptedFiles[0]);
    },
    [multiple, field.value, helpers]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize,
    maxFiles,
  });

  const removeFile = (fileToRemove) => {
    if (multiple) {
      helpers.setValue(field.value.filter(file => file !== fileToRemove));
    } else {
      helpers.setValue(null);
    }
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileToRemove.name];
      return newProgress;
    });
  };

  const renderPreview = (file) => {
    if (!showPreview) return null;

    if (file.type.startsWith('image/')) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="h-16 w-16 object-cover rounded"
        />
      );
    }
    return (
      <File className="h-16 w-16 text-gray-400" />
    );
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div
        {...getRootProps()}
        className={`
          mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md
          ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
          ${meta.error && meta.touched ? 'border-red-500' : ''}
        `}
      >
        <div className="space-y-1 text-center">
          <Image className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <input {...getInputProps()} />
            <p className="pl-1">
              {isDragActive
                ? 'Drop the files here ...'
                : `Drag 'n' drop ${multiple ? 'files' : 'a file'} here, or click to select`}
            </p>
          </div>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      </div>

      {meta.error && meta.touched && (
        <p className="mt-1 text-sm text-red-600">{meta.error}</p>
      )}

      {/* File List */}
      {field.value && (
        <div className="mt-4 space-y-2">
          {(multiple ? field.value : [field.value]).map((file, index) => (
            <div
              key={file.name + index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center space-x-2">
                {renderPreview(file)}
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {uploadProgress[file.name] < 100 ? (
                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress[file.name]}%` }}
                    />
                  </div>
                ) : (
                  <span className="text-green-500 text-sm">Uploaded</span>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(file)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload; 