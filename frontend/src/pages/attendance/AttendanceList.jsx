import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Eye, CalendarCheck } from 'lucide-react';
import { useGetAttendanceQuery } from '../../api/attendanceApi';
import { useGetClassesQuery } from '../../api/classesApi';
import useAuth from '../../hooks/useAuth';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';

const AttendanceList = () => {
  const navigate = useNavigate();
  const { can } = useAuth();
  const [filters, setFilters] = useState({
    classId: '',
    date: new Date().toISOString().split('T')[0],
    status: '',
  });

  const { data, isLoading, isError, error } = useGetAttendanceQuery(
    Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
  );
  const { data: classesData } = useGetClassesQuery();

  const attendance = data?.data || data || [];
  const classes = classesData?.data || classesData || [];

  const columns = [
    {
      key: 'student',
      header: 'Student',
      render: (r) => (
        <div>
          <p className="font-medium text-gray-900">
            {r.student?.user?.firstName ?? ''} {r.student?.user?.lastName ?? ''}
          </p>
          {r.student?.rollNumber && (
            <p className="text-xs text-gray-400">{r.student.rollNumber}</p>
          )}
        </div>
      ),
    },
    {
      key: 'class',
      header: 'Class',
      className: 'text-gray-500',
      render: (r) => r.class ? `${r.class.name} ${r.class.section || ''}`.trim() : '—',
    },
    {
      key: 'date',
      header: 'Date',
      className: 'text-gray-500',
      render: (r) => r.date ? new Date(r.date).toLocaleDateString() : '—',
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (r) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/dashboard/attendance/${r._id}`}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Attendance"
        action={
          can('attendance', 'create') && (
            <Button onClick={() => navigate('/dashboard/attendance/mark')} size="small">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Mark Attendance
            </Button>
          )
        }
      />

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={filters.classId}
          onChange={(e) => setFilters((p) => ({ ...p, classId: e.target.value }))}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Classes</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} {c.section || ''}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          {['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters((p) => ({ ...p, date: e.target.value }))}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <DataTable
        columns={columns}
        data={attendance}
        keyField="_id"
        isLoading={isLoading}
        error={isError ? error : null}
        emptyMessage="No attendance records found."
        emptyIcon={<CalendarCheck className="h-12 w-12 opacity-30" />}
      />
    </div>
  );
};

export default AttendanceList;
