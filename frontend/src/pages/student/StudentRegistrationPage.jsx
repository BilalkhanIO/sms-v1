import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createStudent } from '../../redux/features/studentSlice';
import { useToast } from '../../contexts/ToastContext';

const StudentRegistrationPage = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    
    // Contact Information
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
    
    // Parent/Guardian Information
    parentInfo: {
      fatherName: '',
      fatherOccupation: '',
      fatherContact: '',
      motherName: '',
      motherOccupation: '',
      motherContact: '',
      guardianName: '',
      guardianRelation: '',
      guardianContact: '',
    },
    
    // Academic Information
    academicInfo: {
      previousSchool: '',
      previousClass: '',
      admissionDate: '',
      academicYear: '',
    },
  });

  const dispatch = useDispatch();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createStudent(formData)).unwrap();
      showToast('Student registered successfully', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to register student', 'error');
    }
  };

  const handleInputChange = (e, section = null) => {
    const { name, value } = e.target;
    
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value,
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Student Registration
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Enter student details for registration
            </p>
          </div>

          <form onSubmit={handleSubmit} className="border-t border-gray-200">
            {/* Personal Information */}
            <div className="px-4 py-5 bg-white sm:p-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Parent Information */}
            <div className="px-4 py-5 bg-gray-50 sm:p-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">
                Parent/Guardian Information
              </h4>
              <div className="grid grid-cols-6 gap-6">
                {/* Add parent information fields */}
              </div>
            </div>

            {/* Academic Information */}
            <div className="px-4 py-5 bg-white sm:p-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">
                Academic Information
              </h4>
              <div className="grid grid-cols-6 gap-6">
                {/* Add academic information fields */}
              </div>
            </div>

            {/* Submit Button */}
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistrationPage; 