import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Edit, CheckCircle, XCircle } from 'lucide-react';
import { useGetClassesQuery } from '../../api/classesApi';
import { useGetMyTimetableQuery } from '../../api/timetableApi';
import useAuth from '../../hooks/useAuth';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';

// Sub-component that checks if a given class has a timetable
// We fetch all timetables via individual class queries — however since
// the API doesn't have a "list all timetables" endpoint, we surface
// timetable status from a field on the class object or we rely on the
// class list data which may include a hasTimetable flag from the backend.
// We show an Edit button for each class row regardless.

const TimetableStatusCell = ({ hasTimetable }) => {
  if (hasTimetable) {
    return (
      <span className="inline-flex items-center gap-1.5 text-green-700 text-sm">
        <CheckCircle className="h-4 w-4" />
        Has Timetable
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-gray-400 text-sm">
      <XCircle className="h-4 w-4" />
      Not Set
    </span>
  );
};

const TimetableManage = () => {
  const navigate = useNavigate();
  const { can } = useAuth();

  const { data: classesData, isLoading, isError, error } = useGetClassesQuery();
  const classes = classesData?.data || classesData || [];

  const columns = [
    {
      key: 'name',
      header: 'Class',
      className: 'font-medium text-gray-900',
      render: (cls) => cls.name || '—',
    },
    {
      key: 'grade',
      header: 'Grade / Section',
      className: 'text-gray-500',
      render: (cls) => {
        const parts = [cls.grade, cls.section].filter(Boolean);
        return parts.length ? parts.join(' — ') : '—';
      },
    },
    {
      key: 'students',
      header: 'Students',
      className: 'text-gray-500',
      render: (cls) => cls.studentCount ?? cls.students?.length ?? '—',
    },
    {
      key: 'timetableStatus',
      header: 'Timetable Status',
      render: (cls) => (
        <TimetableStatusCell hasTimetable={!!cls.hasTimetable || !!cls.timetable} />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (cls) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            size="small"
            variant="secondary"
            onClick={() => navigate(`/dashboard/timetable/class/${cls._id}/edit`)}
            title="Edit Timetable"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit Timetable
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Manage Timetables" />

      <div className="mb-4 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-700">
        Select a class and click <strong>Edit Timetable</strong> to configure its weekly schedule.
      </div>

      <DataTable
        columns={columns}
        data={classes}
        keyField="_id"
        isLoading={isLoading}
        error={isError ? error : null}
        emptyMessage="No classes found."
        emptyIcon={<CalendarDays className="h-12 w-12 opacity-30" />}
      />
    </div>
  );
};

export default TimetableManage;
