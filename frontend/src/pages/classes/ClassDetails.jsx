import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetClassByIdQuery } from '../../api/classesApi';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import useAuth from '../../hooks/useAuth';
import { GraduationCap, Users, BookOpen, Edit } from 'lucide-react';

const ClassDetails = () => {
  const { id } = useParams();
  const { can } = useAuth();

  const { data, isLoading, isError, error } = useGetClassByIdQuery(id);

  if (isLoading) return <Spinner size="large" />;
  if (isError || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
        {error?.data?.message || 'Failed to load class details.'}
      </div>
    );
  }

  const classData = data?.data || data;

  return (
    <div>
      <PageHeader
        title={`${classData.name}${classData.section ? ` — ${classData.section}` : ''}`}
        backUrl="/dashboard/classes"
        action={
          can('classes', 'edit') && (
            <Link
              to={`/dashboard/classes/update/${id}`}
              className="flex items-center gap-1.5 px-3 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              <Edit className="h-4 w-4" /> Edit Class
            </Link>
          )
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Class Information</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Academic Year</dt>
              <dd className="font-medium text-gray-900">{classData.academicYear || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Section</dt>
              <dd className="font-medium text-gray-900">{classData.section || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Grade</dt>
              <dd className="font-medium text-gray-900">{classData.grade ? `Grade ${classData.grade}` : '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Capacity</dt>
              <dd className="font-medium text-gray-900">{classData.capacity ?? '—'}</dd>
            </div>
          </dl>
        </div>

        {/* Class Teacher */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-gray-400" /> Class Teacher
          </h3>
          {classData.classTeacher ? (
            <div className="text-sm">
              <p className="font-medium text-gray-900">
                {`${classData.classTeacher.user?.firstName ?? ''} ${classData.classTeacher.user?.lastName ?? ''}`.trim() || '—'}
              </p>
              <p className="text-gray-500 mt-0.5">{classData.classTeacher.user?.email || '—'}</p>
              <Link
                to={`/dashboard/teachers/${classData.classTeacher._id}`}
                className="text-blue-600 hover:underline text-xs mt-2 inline-block"
              >
                View Teacher Profile →
              </Link>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No class teacher assigned.</p>
          )}
        </div>
      </div>

      {/* Students */}
      <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-400" />
            Students ({classData.students?.length ?? 0})
          </h3>
        </div>
        {classData.students?.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {classData.students.map((student) => (
              <div key={student._id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {`${student.user?.firstName ?? ''} ${student.user?.lastName ?? ''}`.trim() || '—'}
                  </p>
                  <p className="text-xs text-gray-400">{student.rollNumber || ''}</p>
                </div>
                <Link
                  to={`/dashboard/students/${student._id}`}
                  className="text-xs text-blue-600 hover:underline"
                >
                  View →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-6 py-8 text-center text-gray-400 text-sm">No students enrolled in this class.</p>
        )}
      </div>

      {/* Subjects */}
      {classData.subjects?.length > 0 && (
        <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-gray-400" /> Subjects
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {classData.subjects.map((subject) => (
              <div key={subject._id} className="px-6 py-3 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{subject.name || '—'}</p>
                <Link
                  to={`/dashboard/subjects/${subject._id}`}
                  className="text-xs text-blue-600 hover:underline"
                >
                  View →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassDetails;
