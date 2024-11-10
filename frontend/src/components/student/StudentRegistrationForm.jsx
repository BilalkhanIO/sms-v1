import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStudent } from '../../redux/features/studentSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import { validateStudentForm } from '../../utils/validation/studentValidation';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const StudentRegistrationForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.student);
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: '',
    lastName: '',
    rollNumber: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',

    // Contact Information
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },

    // Academic Information
    admissionDate: new Date().toISOString().split('T')[0],
    currentClass: '',
    section: '',
    academicYear: '',
    previousSchool: {
      name: '',
      address: '',
      leavingDate: '',
    },

    // Parent/Guardian Information
    parentInfo: {
      father: {
        name: '',
        occupation: '',
        phone: '',
        email: '',
      },
      mother: {
        name: '',
        occupation: '',
        phone: '',
        email: '',
      },
      guardian: {
        name: '',
        relationship: '',
        phone: '',
        email: '',
      },
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleParentInfoChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      parentInfo: {
        ...prev.parentInfo,
        [parent]: {
          ...prev.parentInfo[parent],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateStudentForm(formData);
    
    if (Object.keys(errors).length === 0) {
      try {
        await dispatch(createStudent(formData)).unwrap();
        toast.success('Student registered successfully');
        navigate('/students');
      } catch (error) {
        toast.error(error.message || 'Failed to register student');
      }
    } else {
      setErrors(errors);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="text"
            name="rollNumber"
            placeholder="Roll Number"
            value={formData.rollNumber}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="input-field"
            required
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="">Select Blood Group</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="text"
            name="address.street"
            placeholder="Street Address"
            value={formData.address.street}
            onChange={handleChange}
            className="input-field md:col-span-2"
          />
          <input
            type="text"
            name="address.city"
            placeholder="City"
            value={formData.address.city}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="text"
            name="address.state"
            placeholder="State"
            value={formData.address.state}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="text"
            name="address.postalCode"
            placeholder="Postal Code"
            value={formData.address.postalCode}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="text"
            name="address.country"
            placeholder="Country"
            value={formData.address.country}
            onChange={handleChange}
            className="input-field"
          />
        </div>
      </div>

      {/* Academic Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Academic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            name="admissionDate"
            value={formData.admissionDate}
            onChange={handleChange}
            className="input-field"
            required
          />
          <select
            name="currentClass"
            value={formData.currentClass}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="">Select Class</option>
            {/* Add class options dynamically from your class data */}
          </select>
          <input
            type="text"
            name="section"
            placeholder="Section"
            value={formData.section}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="text"
            name="academicYear"
            placeholder="Academic Year"
            value={formData.academicYear}
            onChange={handleChange}
            className="input-field"
            required
          />
          
          {/* Previous School Information */}
          <div className="col-span-2">
            <h4 className="text-md font-medium mb-3">Previous School Information (Optional)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="previousSchool.name"
                placeholder="Previous School Name"
                value={formData.previousSchool.name}
                onChange={handleChange}
                className="input-field"
              />
              <input
                type="text"
                name="previousSchool.address"
                placeholder="Previous School Address"
                value={formData.previousSchool.address}
                onChange={handleChange}
                className="input-field"
              />
              <input
                type="date"
                name="previousSchool.leavingDate"
                value={formData.previousSchool.leavingDate}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Parent Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Parent/Guardian Information</h3>
        
        {/* Father's Information */}
        <div className="mb-6">
          <h4 className="text-md font-medium mb-3">Father's Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Father's Name"
              value={formData.parentInfo.father.name}
              onChange={(e) => handleParentInfoChange('father', 'name', e.target.value)}
              className="input-field"
              required
            />
            <input
              type="text"
              placeholder="Father's Occupation"
              value={formData.parentInfo.father.occupation}
              onChange={(e) => handleParentInfoChange('father', 'occupation', e.target.value)}
              className="input-field"
            />
            <input
              type="tel"
              placeholder="Father's Phone"
              value={formData.parentInfo.father.phone}
              onChange={(e) => handleParentInfoChange('father', 'phone', e.target.value)}
              className="input-field"
              required
            />
            <input
              type="email"
              placeholder="Father's Email"
              value={formData.parentInfo.father.email}
              onChange={(e) => handleParentInfoChange('father', 'email', e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        {/* Mother's Information */}
        <div className="mb-6">
          <h4 className="text-md font-medium mb-3">Mother's Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Mother's Name"
              value={formData.parentInfo.mother.name}
              onChange={(e) => handleParentInfoChange('mother', 'name', e.target.value)}
              className="input-field"
              required
            />
            <input
              type="text"
              placeholder="Mother's Occupation"
              value={formData.parentInfo.mother.occupation}
              onChange={(e) => handleParentInfoChange('mother', 'occupation', e.target.value)}
              className="input-field"
            />
            <input
              type="tel"
              placeholder="Mother's Phone"
              value={formData.parentInfo.mother.phone}
              onChange={(e) => handleParentInfoChange('mother', 'phone', e.target.value)}
              className="input-field"
              required
            />
            <input
              type="email"
              placeholder="Mother's Email"
              value={formData.parentInfo.mother.email}
              onChange={(e) => handleParentInfoChange('mother', 'email', e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        {/* Guardian's Information */}
        <div>
          <h4 className="text-md font-medium mb-3">Guardian's Information (Optional)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Guardian's Name"
              value={formData.parentInfo.guardian.name}
              onChange={(e) => handleParentInfoChange('guardian', 'name', e.target.value)}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Relationship with Student"
              value={formData.parentInfo.guardian.relationship}
              onChange={(e) => handleParentInfoChange('guardian', 'relationship', e.target.value)}
              className="input-field"
            />
            <input
              type="tel"
              placeholder="Guardian's Phone"
              value={formData.parentInfo.guardian.phone}
              onChange={(e) => handleParentInfoChange('guardian', 'phone', e.target.value)}
              className="input-field"
            />
            <input
              type="email"
              placeholder="Guardian's Email"
              value={formData.parentInfo.guardian.email}
              onChange={(e) => handleParentInfoChange('guardian', 'email', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Form Submission */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => setFormData(initialFormData)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Reset Form
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? 'Registering...' : 'Register Student'}
        </button>
      </div>
    </form>
  );
};

export default StudentRegistrationForm; 