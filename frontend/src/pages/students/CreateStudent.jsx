import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import { useCreateStudentMutation } from '../../api/studentApi';
import { useGetClassesQuery } from '../../api/classesApi';
import { useGetParentsQuery } from '../../api/parentApi';

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const errorClass = 'mt-1 text-sm text-red-600';

const CreateStudent = () => {
  const navigate = useNavigate();
  const [createStudent, { isLoading }] = useCreateStudentMutation();
  const { data: classesRaw, isLoading: classesLoading } = useGetClassesQuery();
  const { data: parentsRaw, isLoading: parentsLoading } = useGetParentsQuery();
  const classes = classesRaw?.data || classesRaw || [];
  const parents = parentsRaw?.data || parentsRaw || [];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    admissionNumber: '',
    rollNumber: '',
    class: '',
    dateOfBirth: '',
    gender: '',
    'parentInfo.guardian': '',
    'address.street': '',
    'address.city': '',
    'address.state': '',
    'address.postalCode': '',
    'address.country': 'USA',
    status: 'ACTIVE',
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        admissionNumber: formData.admissionNumber,
        rollNumber: formData.rollNumber,
        class: formData.class,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        status: formData.status,
        parentInfo: { guardian: formData['parentInfo.guardian'] },
        address: {
          street: formData['address.street'],
          city: formData['address.city'],
          state: formData['address.state'],
          postalCode: formData['address.postalCode'],
          country: formData['address.country'],
        },
      };
      await createStudent(payload).unwrap();
      navigate('/dashboard/students');
    } catch (error) {
      const validationErrors = {};
      if (error.data?.errors) {
        error.data.errors.forEach(err => {
          validationErrors[err.path || err.field] = err.msg || err.message;
        });
        setErrors(validationErrors);
      } else {
        setGeneralError(error.data?.message || 'Failed to create student');
      }
    }
  };

  if (classesLoading || parentsLoading) return <Spinner size="large" />;

  return (
    <div>
      <PageHeader title="Create Student" backUrl="/dashboard/students" />

      <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
        {generalError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {generalError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-3">Account Credentials</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>First Name *</label>
                <input className={inputClass} name="firstName" value={formData.firstName} onChange={handleChange} required />
                {errors.firstName && <p className={errorClass}>{errors.firstName}</p>}
              </div>
              <div>
                <label className={labelClass}>Last Name *</label>
                <input className={inputClass} name="lastName" value={formData.lastName} onChange={handleChange} required />
                {errors.lastName && <p className={errorClass}>{errors.lastName}</p>}
              </div>
              <div>
                <label className={labelClass}>Email *</label>
                <input type="email" className={inputClass} name="email" value={formData.email} onChange={handleChange} required />
                {errors.email && <p className={errorClass}>{errors.email}</p>}
              </div>
              <div>
                <label className={labelClass}>Password *</label>
                <input type="password" className={inputClass} name="password" value={formData.password} onChange={handleChange} required minLength={8} placeholder="Min 8 characters" />
                {errors.password && <p className={errorClass}>{errors.password}</p>}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-3">Student Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Admission Number *</label>
                <input className={inputClass} name="admissionNumber" value={formData.admissionNumber} onChange={handleChange} required />
                {errors.admissionNumber && <p className={errorClass}>{errors.admissionNumber}</p>}
              </div>
              <div>
                <label className={labelClass}>Roll Number *</label>
                <input className={inputClass} name="rollNumber" value={formData.rollNumber} onChange={handleChange} required />
                {errors.rollNumber && <p className={errorClass}>{errors.rollNumber}</p>}
              </div>
              <div>
                <label className={labelClass}>Date of Birth *</label>
                <input type="date" className={inputClass} name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                {errors.dateOfBirth && <p className={errorClass}>{errors.dateOfBirth}</p>}
              </div>
              <div>
                <label className={labelClass}>Gender *</label>
                <select className={inputClass} name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.gender && <p className={errorClass}>{errors.gender}</p>}
              </div>
              <div>
                <label className={labelClass}>Class *</label>
                <select className={inputClass} name="class" value={formData.class} onChange={handleChange} required>
                  <option value="">Select class</option>
                  {classes.map(c => <option key={c._id} value={c._id}>{c.name} {c.section}</option>)}
                </select>
                {errors.class && <p className={errorClass}>{errors.class}</p>}
              </div>
              <div>
                <label className={labelClass}>Guardian (Parent) *</label>
                <select className={inputClass} name="parentInfo.guardian" value={formData['parentInfo.guardian']} onChange={handleChange} required>
                  <option value="">Select guardian</option>
                  {parents.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.user?.firstName || ''} {p.user?.lastName || ''}
                    </option>
                  ))}
                </select>
                {errors['parentInfo.guardian'] && <p className={errorClass}>{errors['parentInfo.guardian']}</p>}
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select className={inputClass} name="status" value={formData.status} onChange={handleChange}>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-3">Address</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Street *</label>
                <input className={inputClass} name="address.street" value={formData['address.street']} onChange={handleChange} required />
              </div>
              <div>
                <label className={labelClass}>City *</label>
                <input className={inputClass} name="address.city" value={formData['address.city']} onChange={handleChange} required />
              </div>
              <div>
                <label className={labelClass}>State *</label>
                <input className={inputClass} name="address.state" value={formData['address.state']} onChange={handleChange} required />
              </div>
              <div>
                <label className={labelClass}>Postal Code *</label>
                <input className={inputClass} name="address.postalCode" value={formData['address.postalCode']} onChange={handleChange} required />
              </div>
              <div>
                <label className={labelClass}>Country *</label>
                <input className={inputClass} name="address.country" value={formData['address.country']} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => navigate('/dashboard/students')} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              {isLoading ? 'Creating...' : 'Create Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStudent;
