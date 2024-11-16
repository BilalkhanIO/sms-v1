import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerStudent } from '../../redux/features/studentSlice';
import { validateStudentForm } from '../../utils/validation/studentValidation';
import FileUpload from '../common/FileUpload';
import { useToast } from '../../contexts/ToastContext';

const StudentRegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    guardianInfo: {
      name: '',
      relationship: '',
      phone: '',
      email: '',
      occupation: '',
    },
    academicInfo: {
      admissionDate: new Date().toISOString().split('T')[0],
      class: '',
      section: '',
      rollNumber: '',
      previousSchool: '',
    },
    documents: {
      photo: null,
      birthCertificate: null,
      previousSchoolCertificate: null,
    }
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateStudentForm(formData);
    
    if (Object.keys(validationErrors).length === 0) {
      try {
        const formDataToSend = new FormData();
        
        // Append all text data
        Object.keys(formData).forEach(key => {
          if (key !== 'documents') {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          }
        });
        
        // Append files
        Object.keys(formData.documents).forEach(key => {
          if (formData.documents[key]) {
            formDataToSend.append(key, formData.documents[key]);
          }
        });

        await dispatch(registerStudent(formDataToSend)).unwrap();
        addToast('Student registered successfully', 'success');
        navigate('/students');
      } catch (error) {
        addToast(error.message || 'Failed to register student', 'error');
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleInputChange = (e, section = null) => {
    const { name, value } = e.target;
    
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          {/* Add other personal information fields */}
        </div>
      </div>

      {/* Academic Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Academic Information
        </h3>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {/* Add academic information fields */}
        </div>
      </div>

      {/* Guardian Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Guardian Information
        </h3>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {/* Add guardian information fields */}
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Documents
        </h3>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
          <FileUpload
            label="Student Photo"
            accept="image/*"
            onChange={(file) => setFormData(prev => ({
              ...prev,
              documents: { ...prev.documents, photo: file }
            }))}
            error={errors.photo}
          />
          {/* Add other document upload fields */}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate('/students')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
        >
          Register Student
        </button>
      </div>
    </form>
  );
};

export default StudentRegistrationForm; 