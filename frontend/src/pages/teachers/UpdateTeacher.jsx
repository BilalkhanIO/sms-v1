import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { useGetTeacherByIdQuery, useUpdateTeacherMutation } from '../../api/teacherApi';

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

const UpdateTeacher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: teacherRaw, isLoading: isLoadingTeacher } = useGetTeacherByIdQuery(id);
  const [updateTeacher, { isLoading: isUpdating }] = useUpdateTeacherMutation();

  const [formData, setFormData] = useState({
    employeeId: '',
    qualification: '',
    specialization: '',
    address: '',
    'contactInfo.phone': '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const t = teacherRaw?.data || teacherRaw;
    if (t) {
      setFormData({
        employeeId: t.employeeId || '',
        qualification: t.qualification || '',
        specialization: t.specialization || '',
        address: t.address || '',
        'contactInfo.phone': t.contactInfo?.phone || '',
      });
    }
  }, [teacherRaw]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        employeeId: formData.employeeId,
        qualification: formData.qualification,
        specialization: formData.specialization,
        address: formData.address,
        contactInfo: { phone: formData['contactInfo.phone'] },
      };
      await updateTeacher({ id, ...payload }).unwrap();
      navigate('/dashboard/teachers');
    } catch (error) {
      const validationErrors = {};
      if (error.data?.errors) {
        error.data.errors.forEach(err => { validationErrors[err.path || err.field] = err.msg || err.message; });
        setErrors(validationErrors);
      }
    }
  };

  if (isLoadingTeacher) return <Spinner size="large" />;

  const teacher = teacherRaw?.data || teacherRaw;

  return (
    <div>
      <PageHeader
        title={`Update Teacher: ${teacher?.user?.firstName || ''} ${teacher?.user?.lastName || ''}`}
        backUrl="/dashboard/teachers"
      />

      <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Employee ID *</label>
            <input className={inputClass} name="employeeId" value={formData.employeeId} onChange={handleChange} required />
            {errors.employeeId && <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>}
          </div>
          <div>
            <label className={labelClass}>Qualification *</label>
            <input className={inputClass} name="qualification" value={formData.qualification} onChange={handleChange} required />
          </div>
          <div>
            <label className={labelClass}>Specialization *</label>
            <input className={inputClass} name="specialization" value={formData.specialization} onChange={handleChange} required />
          </div>
          <div>
            <label className={labelClass}>Address *</label>
            <input className={inputClass} name="address" value={formData.address} onChange={handleChange} required />
          </div>
          <div>
            <label className={labelClass}>Phone Number *</label>
            <input className={inputClass} name="contactInfo.phone" value={formData['contactInfo.phone']} onChange={handleChange} required />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => navigate('/dashboard/teachers')} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={isUpdating} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              {isUpdating ? 'Saving...' : 'Update Teacher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTeacher;
