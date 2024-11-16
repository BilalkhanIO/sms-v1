import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { uploadStudentDocument } from '../../redux/features/studentSlice';
import { DOCUMENT_TYPES } from '../../constants/student';
import { validateStudentDocuments } from '../../utils/validation/studentValidation';

const StudentDocumentUpload = ({ studentId }) => {
  const [selectedFiles, setSelectedFiles] = useState({});
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const handleFileChange = (type, file) => {
    setSelectedFiles(prev => ({ ...prev, [type]: file }));
    // Clear error when file is selected
    setErrors(prev => ({ ...prev, [type]: null }));
  };

  const handleUpload = async (type) => {
    const file = selectedFiles[type];
    if (!file) return;

    const validationErrors = validateStudentDocuments({ [type]: file });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await dispatch(uploadStudentDocument({
        studentId,
        documentType: type,
        file
      })).unwrap();
      
      // Clear file after successful upload
      setSelectedFiles(prev => ({ ...prev, [type]: null }));
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        [type]: error.message || 'Failed to upload document' 
      }));
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(DOCUMENT_TYPES).map(([key, value]) => (
        <div key={key} className="border rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">{value}</h4>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              onChange={(e) => handleFileChange(key, e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <button
              onClick={() => handleUpload(key)}
              disabled={!selectedFiles[key]}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Upload
            </button>
          </div>
          {errors[key] && (
            <p className="mt-1 text-sm text-red-600">{errors[key]}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default StudentDocumentUpload;
