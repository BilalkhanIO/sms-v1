import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAttendanceQuery } from '../../api/attendanceApi';
import { useGetClassesQuery } from '../../api/classApi';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import { UserCheck, Search, Filter } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const AttendanceList = () => {
  const { isTeacher, isAdmin } = useAuth();
  const [filters, setFilters] = useState({
    classId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'all'
  });

  const { data: attendance, isLoading, error } = useGetAttendanceQuery(filters);
  const { data: classes } = useGetClassesQuery();

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  const statusTypes = [
    { value: 'all', label: 'All Status' },
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' },
    { value: 'excused', label: 'Excused' }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="Attendance">
        {(isTeacher || isAdmin) && (
          <Link to="/dashboard/attendance/create">
            <Button>
              <UserCheck className="w-4 h-4 mr-2" />
              Take Attendance
            </Button>
          </Link>
        )}
      </PageHeader>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          value={filters.classId}
          onChange={(e) => setFilters(prev => ({ ...prev, classId: e.target.value }))}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">All Classes</option>
          {classes?.map(cls => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className="border rounded-lg px-4 py-2"
        >
          {statusTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
          className="border rounded-lg px-4 py-2"
        />
      </div>

      {/* Attendance List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendance?.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {record.student.firstName} {record.student.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {record.student.rollNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.class.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      record.status === 'present' ? 'bg-green-100 text-green-800' :
                      record.status === 'absent' ? 'bg-red-100 text-red-800' :
                      record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/dashboard/attendance/${record.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </Link>
                    {(isTeacher || isAdmin) && (
                      <Link
                        to={`/dashboard/attendance/${record.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!attendance || attendance.length === 0) && (
          <div className="p-6 text-center text-gray-500">
            No attendance records found for the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceList; 