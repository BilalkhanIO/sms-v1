import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateStudent } from '../../redux/features/studentSlice';
import { useToast } from '../../contexts/ToastContext';

const StudentProfileForm = ({ student, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: student.firstName || '',
    lastName: student.lastName || '',
    dateOfBirth: student.dateOfBirth?.split('T')[0] || '',
    gender: student.gender || '',
    bloodGroup: student.bloodGroup || '',
    
    address: {
      street: student.address?.street || '',
      city: student.address?.city || '',
      state: student.address?.state || '',
      country: student.address?.country || '',
      postalCode: student.address?.postalCode || '',
    },
    
    parentInfo: {
      fatherName: student.parentInfo?.fatherName || '',
      fatherOccupation: student.parentInfo?.fatherOccupation || '',
      fatherContact: student.parentInfo?.fatherContact || '',
      motherName: student.parentInfo?.motherName || '',
      motherOccupation: student.parentInfo?.motherOccupation || '',
      motherContact: student.parentInfo?.motherContact || '',
      guardianName: student.parentInfo?.guardianName || '',
      guardianRelation: student.parentInfo?.guardianRelation || '',
      guardianContact: student.parentInfo?.guardianContact || '',
    },
  });

  const dispatch = useDispatch();
  const { showToast } = useToast();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateStudent({
        studentId: student.id,
        studentData: formData,
      })).unwrap();
      showToast('Student profile updated successfully', 'success');
      onClose?.();
    } catch (error) {
      showToast(error.message || 'Failed to update student profile', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white px-4 py-5 sm:p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h4>
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label className="block text-sm font-medium text-gray-700">
              Blood Group
            </label>
            <input
              type="text"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-gray-50 px-4 py-5 sm:p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Address Information</h4>
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6">
            <label className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              type="text"
              name="street"
              value={formData.address.street}
              onChange={(e) => handleInputChange(e, 'address')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.address.city}
              onChange={(e) => handleInputChange(e, 'address')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label className="block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              name="state"
              value={formData.address.state}
              onChange={(e) => handleInputChange(e, 'address')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.address.country}
              onChange={(e) => handleInputChange(e, 'address')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label className="block text-sm font-medium text-gray-700">
              Postal Code
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.address.postalCode}
              onChange={(e) => handleInputChange(e, 'address')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Parent Information */}
      <div className="bg-white px-4 py-5 sm:p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Parent/Guardian Information</h4>
        <div className="grid grid-cols-6 gap-6">
          {/* Parent fields */}
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <button
          type="button"
          onClick={onClose}
          className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default StudentProfileForm; 