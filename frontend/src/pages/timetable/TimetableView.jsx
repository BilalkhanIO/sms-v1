import React, { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import {
  useGetMyTimetableQuery,
  useGetTimetableByClassQuery,
} from '../../api/timetableApi';
import { useGetClassesQuery } from '../../api/classesApi';
import useAuth from '../../hooks/useAuth';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const SUBJECT_COLORS = [
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-purple-100 text-purple-800 border-purple-200',
  'bg-green-100 text-green-800 border-green-200',
  'bg-yellow-100 text-yellow-800 border-yellow-200',
  'bg-pink-100 text-pink-800 border-pink-200',
  'bg-indigo-100 text-indigo-800 border-indigo-200',
  'bg-orange-100 text-orange-800 border-orange-200',
  'bg-teal-100 text-teal-800 border-teal-200',
];

const buildSubjectColorMap = (entries) => {
  const map = {};
  let idx = 0;
  (entries || []).forEach((entry) => {
    const key = entry.subject?._id || entry.subject || entry.subjectName || '';
    if (key && !map[key]) {
      map[key] = SUBJECT_COLORS[idx % SUBJECT_COLORS.length];
      idx += 1;
    }
  });
  return map;
};

// Collect unique periods across all entries, sorted by start time
const extractPeriods = (entries) => {
  const periodMap = {};
  (entries || []).forEach((entry) => {
    const key = entry.period || entry.periodNumber || entry.startTime || '';
    if (key && !periodMap[key]) {
      periodMap[key] = {
        key,
        label: entry.periodLabel || entry.period || `Period ${entry.periodNumber}` || key,
        startTime: entry.startTime || '',
        endTime: entry.endTime || '',
      };
    }
  });
  return Object.values(periodMap).sort((a, b) => {
    if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
    return String(a.key).localeCompare(String(b.key));
  });
};

// Build a lookup: day -> period -> entry
const buildGrid = (entries) => {
  const grid = {};
  (entries || []).forEach((entry) => {
    const day = entry.day || '';
    const period = entry.period || entry.periodNumber || entry.startTime || '';
    if (!grid[day]) grid[day] = {};
    grid[day][period] = entry;
  });
  return grid;
};

const ClassTimetableGrid = ({ classId }) => {
  const { data, isLoading, isError } = useGetTimetableByClassQuery(classId, {
    skip: !classId,
  });
  const entries = data?.data || data?.entries || data || [];
  return <TimetableGrid entries={entries} isLoading={isLoading} isError={isError} />;
};

const MyTimetableGrid = () => {
  const { data, isLoading, isError } = useGetMyTimetableQuery();
  const entries = data?.data || data?.entries || data || [];
  return <TimetableGrid entries={entries} isLoading={isLoading} isError={isError} />;
};

const TimetableGrid = ({ entries, isLoading, isError }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
        Failed to load timetable.
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <CalendarDays className="h-12 w-12 opacity-30 mb-3" />
        <p className="text-sm">No timetable entries found.</p>
      </div>
    );
  }

  const periods = extractPeriods(entries);
  const grid = buildGrid(entries);
  const subjectColorMap = buildSubjectColorMap(entries);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200 w-32">
                Period / Time
              </th>
              {DAYS.map((day) => (
                <th
                  key={day}
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200 min-w-[150px]"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((period) => (
              <tr key={period.key} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 border border-gray-200 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-700">{period.label}</p>
                  {period.startTime && period.endTime && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {period.startTime} – {period.endTime}
                    </p>
                  )}
                </td>
                {DAYS.map((day) => {
                  const entry = grid[day]?.[period.key];
                  const subjectKey =
                    entry?.subject?._id || entry?.subject || entry?.subjectName || '';
                  const colorClass = subjectKey
                    ? subjectColorMap[subjectKey] || SUBJECT_COLORS[0]
                    : '';
                  return (
                    <td
                      key={day}
                      className="px-2 py-2 border border-gray-200 text-center"
                    >
                      {entry ? (
                        <div
                          className={`rounded-md border px-2 py-2 text-left ${colorClass}`}
                        >
                          <p className="text-xs font-semibold leading-tight">
                            {entry.subject?.name || entry.subjectName || '—'}
                          </p>
                          {(entry.teacher?.user?.firstName ||
                            entry.teacherName) && (
                            <p className="text-xs mt-0.5 opacity-75">
                              {entry.teacher?.user?.firstName
                                ? `${entry.teacher.user.firstName} ${entry.teacher.user.lastName || ''}`.trim()
                                : entry.teacherName}
                            </p>
                          )}
                          {entry.room && (
                            <p className="text-xs mt-0.5 opacity-60">
                              Room {entry.room}
                            </p>
                          )}
                          {entry.startTime && entry.endTime && (
                            <p className="text-xs mt-0.5 opacity-60">
                              {entry.startTime} – {entry.endTime}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-md border border-dashed border-gray-200 h-16" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TimetableView = () => {
  const { user } = useAuth();
  const role = user?.role;
  const [selectedClassId, setSelectedClassId] = useState('');

  const { data: classesData, isLoading: classesLoading } = useGetClassesQuery(undefined, {
    skip: role !== 'SCHOOL_ADMIN',
  });
  const classes = classesData?.data || classesData || [];

  return (
    <div>
      <PageHeader title="Timetable" />

      {role === 'SCHOOL_ADMIN' && (
        <div className="mb-6 flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">View timetable for class:</label>
          {classesLoading ? (
            <Spinner size="small" />
          ) : (
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="block w-56 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">— Select a class —</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {role === 'SCHOOL_ADMIN' ? (
        selectedClassId ? (
          <ClassTimetableGrid classId={selectedClassId} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <CalendarDays className="h-12 w-12 opacity-30 mb-3" />
            <p className="text-sm">Select a class above to view its timetable.</p>
          </div>
        )
      ) : (
        <MyTimetableGrid />
      )}
    </div>
  );
};

export default TimetableView;
