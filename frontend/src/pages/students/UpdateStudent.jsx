import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { useGetStudentByIdQuery, useUpdateStudentMutation } from '../../api/studentApi';
import { useGetClassesQuery } from '../../api/classesApi';
import { useGetParentsQuery } from '../../api/parentApi';

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

const UpdateStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: studentRaw, isLoading: isLoadingStudent } = useGetStudentByIdQuery(id);
  const { data: classesRaw, isLoading: classesLoading } = useGetClassesQuery();
  const { data: parentsRaw, isLoading: parentsLoading } = useGetParentsQuery();
  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();

  const classes = classesRaw?.data || classesRaw || [];
  const parents = parentsRaw?.data || parentsRaw || [];

  const [formData, setFormData] = useState({
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

  useEffect(() => {
    const s = studentRaw?.data || studentRaw;
    if (s) {
      setFormData({
        admissionNumber: s.admissionNumber || '',
        rollNumber: s.rollNumber || '',
        class: s.class?._id || s.class || '',
        dateOfBirth: s.dateOfBirth ? new Date(s.dateOfBirth).toISOString().split('T')[0] : '',
        gender: s.gender || '',
        'parentInfo.guardian': s.parentInfo?.guardian?._id || s.parentInfo?.guardian || '',
        'address.street': s.address?.street || '',
        'address.city': s.address?.city || '',
        'address.state': s.address?.state || '',
        'address.postalCode': s.address?.postalCode || '',
        'address.country': s.address?.country || 'USA',
        status: s.status || 'ACTIVE',
      });
    }
  }, [studentRaw]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
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
      await updateStudent({ id, ...payload }).unwrap();
      navigate('/dashboard/students');
    } catch (error) {
      const validationErrors = {};
      if (error.data?.errors) {
        error.data.errors.forEach(err => { validationErrors[err.path || err.field] = err.msg || err.message; });
        setErrors(validationErrors);
      }
    }
  };

  if (isLoadingStudent || classesLoading || parentsLoading) return <Spinner size="large" />;

  return (
    <div>
      <PageHeader title="Update Student" backUrl="/dashboard/students" />

      <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Admission Number *</label>
              <input className={inputClass} name="admissionNumber" value={formData.admissionNumber} onChange={handleChange} required />
            </div>
            <div>
              <label className={labelClass}>Roll Number *</label>
              <input className={inputClass} name="rollNumber" value={formData.rollNumber} onChange={handleChange} required />
            </div>
            <div>
              <label className={labelClass}>Date of Birth *</label>
              <input type="date" className={inputClass} name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
            </div>
            <div>
              <label className={labelClass}>Gender *</label>
              <select className={inputClass} name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Class *</label>
              <select className={inputClass} name="class" value={formData.class} onChange={handleChange} required>
                <option value="">Select class</option>
                {classes.map(c => <option key={c._id} value={c._id}>{c.name} {c.section}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Guardian (Parent) *</label>
              <select className={inputClass} name="parentInfo.guardian" value={formData['parentInfo.guardian']} onChange={handleChange} required>
                <option value="">Select guardian</option>
                {parents.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.user?.firstName || p.firstName || ''} {p.user?.lastName || p.lastName || ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select className={inputClass} name="status" value={formData.status} onChange={handleChange}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="GRADUATED">Graduated</option>
                <option value="TRANSFERRED">Transferred</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>

          <h4 className="text-base font-medium text-gray-800 pt-2">Address</h4>
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

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => navigate('/dashboard/students')} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={isUpdating} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              {isUpdating ? 'Saving...' : 'Update Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStudent;
