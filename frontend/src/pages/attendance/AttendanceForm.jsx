import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { attendanceSchema } from '../../utils/validationSchemas';
import {
  useMarkAttendanceMutation,
  useUpdateAttendanceMutation,
  useGetAttendanceByIdQuery
} from '../../api/attendanceApi';
import { useGetStudentsByClassQuery } from '../../api/studentApi';
import { useGetClassesQuery } from '../../api/classApi';
import Button from '../../components/common/Button';
import FormSection from '../../components/forms/FormSection';
import SelectField from '../../components/forms/SelectField';
import FormError from '../../components/forms/FormError';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import { UserCheck, UserX, Clock } from 'lucide-react';

const AttendanceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [selectedClass, setSelectedClass] = useState('');

  const { data: attendance, isLoading: isLoadingAttendance } = useGetAttendanceByIdQuery(id, {
    skip: !isEditing
  });
  const { data: classes, isLoading: isLoadingClasses } = useGetClassesQuery();
  const { data: students, isLoading: isLoadingStudents } = useGetStudentsByClassQuery(selectedClass, {
    skip: !selectedClass
  });

  const [markAttendance, { isLoading: isMarking }] = useMarkAttendanceMutation();
  const [updateAttendance, { isLoading: isUpdating }] = useUpdateAttendanceMutation();

  const formik = useFormik({
    initialValues: {
      classId: attendance?.classId || '',
      date: attendance?.date || new Date().toISOString().split('T')[0],
      records: attendance?.records || [],
      notes: attendance?.notes || ''
    },
    validationSchema: attendanceSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isEditing) {
          await updateAttendance({ id, ...values }).unwrap();
        } else {
          await markAttendance(values).unwrap();
        }
        navigate('/dashboard/attendance');
      } catch (error) {
        console.error('Failed to save attendance:', error);
      }
    }
  });

  useEffect(() => {
    if (formik.values.classId) {
      setSelectedClass(formik.values.classId);
    }
  }, [formik.values.classId]);

  useEffect(() => {
    if (students && !isEditing) {
      formik.setFieldValue(
        'records',
        students.map(student => ({
          studentId: student.id,
          status: 'present',
          remarks: ''
        }))
      );
    }
  }, [students, isEditing]);

  if ((isEditing && isLoadingAttendance) || isLoadingClasses) {
    return <Spinner size="large" />;
  }

  const statusOptions = [
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' },
    { value: 'excused', label: 'Excused' }
  ];

  const handleBulkAction = (status) => {
    formik.setFieldValue(
      'records',
      formik.values.records.map(record => ({
        ...record,
        status
      }))
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title={isEditing ? 'Edit Attendance' : 'Take Attendance'}
        backButton
      />

      <form onSubmit={formik.handleSubmit} className="max-w-4xl mx-auto">
        <FormSection title="Attendance Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Class"
              name="classId"
              value={formik.values.classId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.classId && formik.errors.classId}
              options={classes?.map(cls => ({
                value: cls.id,
                label: cls.name
              }))}
              disabled={isEditing}
              required
            />

            <input
              type="date"
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`
                w-full px-3 py-2 border rounded-md
                ${formik.touched.date && formik.errors.date
                  ? 'border-red-500'
                  : 'border-gray-300'
                }
              `}
              required
            />
          </div>
        </FormSection>

        {selectedClass && (
          <FormSection title="Student Records">
            <div className="mb-4 flex justify-end space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleBulkAction('present')}
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Mark All Present
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleBulkAction('absent')}
              >
                <UserX className="w-4 h-4 mr-2" />
                Mark All Absent
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students?.map((student, index) => {
                    const record = formik.values.records.find(
                      r => r.studentId === student.id
                    );
                    return (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.rollNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            name={`records.${index}.status`}
                            value={record?.status || 'present'}
                            onChange={formik.handleChange}
                            className="border rounded-md px-3 py-2"
                          >
                            {statusOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            name={`records.${index}.remarks`}
                            value={record?.remarks || ''}
                            onChange={formik.handleChange}
                            placeholder="Add remarks..."
                            className="border rounded-md px-3 py-2 w-full"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </FormSection>
        )}

        <FormSection title="Additional Notes">
          <textarea
            name="notes"
            value={formik.values.notes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={4}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Add any additional notes..."
          />
        </FormSection>

        {formik.errors.submit && <FormError error={formik.errors.submit} />}

        <div className="mt-6 flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/dashboard/attendance')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isMarking || isUpdating}
            disabled={!formik.isValid || !formik.dirty}
          >
            {isEditing ? 'Update Attendance' : 'Save Attendance'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AttendanceForm; 