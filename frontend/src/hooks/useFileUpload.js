import { useState } from 'react';

const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadFile = async (file, endpoint = '/api/upload') => {
    if (!file) {
      throw new Error('No file provided');
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      setProgress(100);
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const uploadMultipleFiles = async (files, endpoint = '/api/upload') => {
    if (!files || files.length === 0) {
      throw new Error('No files provided');
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Upload failed for ${file.name}: ${errorData.message || response.status}`);
        }

        const result = await response.json();
        
        // Update progress
        setProgress(((index + 1) / files.length) * 100);
        
        return { file, result };
      });

      const results = await Promise.all(uploadPromises);
      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setUploading(false);
    setProgress(0);
    setError(null);
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    uploading,
    progress,
    error,
    reset,
  };
};

export default useFileUpload;