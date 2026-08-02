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
import { useGetClassesQuery } from '../../api/classesApi';
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
  const { data: classesRaw, isLoading: isLoadingClasses } = useGetClassesQuery();
  const { data: studentsRaw, isLoading: isLoadingStudents } = useGetStudentsByClassQuery(selectedClass, {
    skip: !selectedClass
  });
  const classes = classesRaw?.data || classesRaw || [];
  const students = studentsRaw?.data || studentsRaw || [];

  const [markAttendance, { isLoading: isMarking }] = useMarkAttendanceMutation();
  const [updateAttendance, { isLoading: isUpdating }] = useUpdateAttendanceMutation();

  const formik = useFormik({
    initialValues: {
      classId: attendance?.data?.classId || attendance?.classId || '',
      date: attendance?.data?.date ? new Date(attendance.data.date).toISOString().split('T')[0] : attendance?.date ? new Date(attendance.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      students: attendance?.data?.students || attendance?.students || [],
      notes: attendance?.data?.notes || attendance?.notes || ''
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
    if (students.length && !isEditing) {
      formik.setFieldValue(
        'students',
        students.map(student => ({
          studentId: student._id,
          status: 'PRESENT',
          remarks: ''
        }))
      );
    }
  }, [students, isEditing]);

  if ((isEditing && isLoadingAttendance) || isLoadingClasses) {
    return <Spinner size="large" />;
  }

  const statusOptions = [
    { value: 'PRESENT', label: 'Present' },
    { value: 'ABSENT', label: 'Absent' },
    { value: 'LATE', label: 'Late' },
    { value: 'EXCUSED', label: 'Excused' }
  ];

  const handleBulkAction = (status) => {
    formik.setFieldValue(
      'students',
      formik.values.students.map(record => ({
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
              options={classes.map(cls => ({
                value: cls._id,
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
                onClick={() => handleBulkAction('PRESENT')}
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Mark All Present
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleBulkAction('ABSENT')}
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
                  {students.map((student, index) => {
                    const record = formik.values.students.find(
                      r => r.studentId === student._id
                    );
                    const firstName = student.user?.firstName || '';
                    const lastName = student.user?.lastName || '';
                    return (
                      <tr key={student._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {firstName} {lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.rollNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            name={`students.${index}.status`}
                            value={record?.status || 'PRESENT'}
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
                            name={`students.${index}.remarks`}
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