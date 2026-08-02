import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetTeacherByIdQuery } from '../../api/teacherApi';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import { Edit, BookOpen, School } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const TeacherDetails = () => {
  const { id } = useParams();
  const { can } = useAuth();
  const { data, isLoading, error } = useGetTeacherByIdQuery(id);

  if (isLoading) return <Spinner size="large" />;
  if (error || !data) {
    return <div className="text-red-500 p-4">Error: {error?.data?.message || 'Failed to load teacher.'}</div>;
  }

  const teacher = data?.data || data;

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="Teacher Details" backUrl="/dashboard/teachers">
        {can('teachers', 'edit') && (
          <Link to={`/dashboard/teachers/update/${id}`}>
            <Button variant="secondary">
              <Edit className="w-4 h-4 mr-2" />
              Edit Teacher
            </Button>
          </Link>
        )}
      </PageHeader>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Basic Info */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {`${teacher.user?.firstName ?? ''} ${teacher.user?.lastName ?? ''}`.trim() || '—'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{teacher.user?.email || '—'}</p>
            </div>
            <div>
              <p className="text-gray-500">Employee ID</p>
              <p className="font-medium text-gray-900">{teacher.employeeId || '—'}</p>
            </div>
            <div>
              <p className="text-gray-500">Specialization</p>
              <p className="font-medium text-gray-900">{teacher.specialization || '—'}</p>
            </div>
            <div>
              <p className="text-gray-500">Qualification</p>
              <p className="font-medium text-gray-900">{teacher.qualification || '—'}</p>
            </div>
            {teacher.joinDate && (
              <div>
                <p className="text-gray-500">Join Date</p>
                <p className="font-medium text-gray-900">{new Date(teacher.joinDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Assigned Classes */}
        {teacher.assignedClasses?.length > 0 && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <School className="h-5 w-5 text-gray-400" />
              <h3 className="text-base font-semibold text-gray-900">Assigned Classes</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {teacher.assignedClasses.map((cls) => (
                <div key={cls._id} className="px-6 py-3 flex items-center justify-between">
                  <span className="text-sm text-gray-900">{cls.name}{cls.section ? ` — ${cls.section}` : ''}</span>
                  <Link
                    to={`/dashboard/classes/${cls._id}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View Class →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assigned Subjects */}
        {teacher.assignedSubjects?.length > 0 && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-gray-400" />
              <h3 className="text-base font-semibold text-gray-900">Assigned Subjects</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {teacher.assignedSubjects.map((subject) => (
                <div key={subject._id} className="px-6 py-3 flex items-center justify-between">
                  <span className="text-sm text-gray-900">{subject.name}</span>
                  <Link
                    to={`/dashboard/subjects/${subject._id}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View Subject →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDetails;
