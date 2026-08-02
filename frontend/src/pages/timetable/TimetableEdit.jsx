import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, Clock } from 'lucide-react';
import {
  useGetTimetableByClassQuery,
  useCreateTimetableMutation,
  useUpdateTimetableMutation,
} from '../../api/timetableApi';
import { useGetSubjectsByClassQuery } from '../../api/subjectApi';
import { useGetTeachersQuery } from '../../api/teacherApi';
import { useGetClassByIdQuery } from '../../api/classesApi';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
const DAY_LABELS = { MONDAY: 'Monday', TUESDAY: 'Tuesday', WEDNESDAY: 'Wednesday', THURSDAY: 'Thursday', FRIDAY: 'Friday' };
const PERIOD_TYPES = ['LESSON', 'BREAK', 'LUNCH', 'FREE'];

const emptyPeriod = (periodNumber) => ({
  periodNumber,
  startTime: '',
  endTime: '',
  type: 'LESSON',
  subject: '',
  teacher: '',
  room: '',
});

const emptySchedule = () =>
  DAYS.map((day) => ({ day, periods: [emptyPeriod(1)] }));

const normalizePeriod = (p, idx) => ({
  periodNumber: p.periodNumber ?? idx + 1,
  startTime: p.startTime || '',
  endTime: p.endTime || '',
  type: p.type || 'LESSON',
  subject: p.subject?._id || p.subject || '',
  teacher: p.teacher?._id || p.teacher || '',
  room: p.room || '',
});

const normalizeSchedule = (rawSchedule) =>
  DAYS.map((day) => {
    const existing = rawSchedule?.find((s) => s.day === day);
    return {
      day,
      periods: existing?.periods?.length
        ? existing.periods.map(normalizePeriod)
        : [emptyPeriod(1)],
    };
  });

const inputCls = 'w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500';
const selectCls = `${inputCls} bg-white`;

const PeriodRow = ({ period, onChange, onRemove, subjects, teachers, canRemove }) => {
  const handle = (field) => (e) => onChange({ ...period, [field]: e.target.value });

  return (
    <div className="grid grid-cols-12 gap-2 items-start py-2 border-b border-gray-100 last:border-0">
      {/* Period # */}
      <div className="col-span-1">
        <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
          {period.periodNumber}
        </span>
      </div>

      {/* Start / End time */}
      <div className="col-span-2">
        <input type="time" className={inputCls} value={period.startTime} onChange={handle('startTime')} />
      </div>
      <div className="col-span-2">
        <input type="time" className={inputCls} value={period.endTime} onChange={handle('endTime')} />
      </div>

      {/* Type */}
      <div className="col-span-2">
        <select className={selectCls} value={period.type} onChange={handle('type')}>
          {PERIOD_TYPES.map((t) => (
            <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
          ))}
        </select>
      </div>

      {/* Subject */}
      <div className="col-span-2">
        <select className={selectCls} value={period.subject} onChange={handle('subject')} disabled={period.type !== 'LESSON'}>
          <option value="">— Subject</option>
          {subjects?.map((s) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Teacher */}
      <div className="col-span-2">
        <select className={selectCls} value={period.teacher} onChange={handle('teacher')} disabled={period.type !== 'LESSON'}>
          <option value="">— Teacher</option>
          {teachers?.map((t) => (
            <option key={t._id} value={t._id}>
              {t.user?.firstName} {t.user?.lastName}
            </option>
          ))}
        </select>
      </div>

      {/* Room + remove */}
      <div className="col-span-1 flex gap-1 items-center">
        <input
          className={`${inputCls} w-full`}
          placeholder="Rm"
          value={period.room}
          onChange={handle('room')}
          disabled={period.type !== 'LESSON'}
        />
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

const DaySection = ({ daySchedule, subjects, teachers, onChange }) => {
  const { day, periods } = daySchedule;

  const updatePeriod = (idx, updated) => {
    const next = periods.map((p, i) => (i === idx ? updated : p));
    onChange({ day, periods: next });
  };

  const addPeriod = () => {
    onChange({
      day,
      periods: [...periods, emptyPeriod(periods.length + 1)],
    });
  };

  const removePeriod = (idx) => {
    const next = periods
      .filter((_, i) => i !== idx)
      .map((p, i) => ({ ...p, periodNumber: i + 1 }));
    onChange({ day, periods: next });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">{DAY_LABELS[day]}</h3>
        <span className="text-xs text-gray-400">{periods.length} period{periods.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="px-4 pt-1 pb-2">
        {/* Header row */}
        <div className="grid grid-cols-12 gap-2 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wide border-b border-gray-100">
          <div className="col-span-1">#</div>
          <div className="col-span-2">Start</div>
          <div className="col-span-2">End</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Subject</div>
          <div className="col-span-2">Teacher</div>
          <div className="col-span-1">Room</div>
        </div>

        {periods.map((period, idx) => (
          <PeriodRow
            key={idx}
            period={period}
            subjects={subjects}
            teachers={teachers}
            canRemove={periods.length > 1}
            onChange={(updated) => updatePeriod(idx, updated)}
            onRemove={() => removePeriod(idx)}
          />
        ))}

        <button
          type="button"
          onClick={addPeriod}
          className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Period
        </button>
      </div>
    </div>
  );
};

const TimetableEdit = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const { data: classData } = useGetClassByIdQuery(classId, { skip: !classId });
  const className = classData?.name || classData?.data?.name || '';

  const { data: timetableData, isLoading: isLoadingTimetable } = useGetTimetableByClassQuery(classId, { skip: !classId });
  const existingTimetable = timetableData?.data || timetableData;
  const timetableId = existingTimetable?._id;

  const { data: subjectsRaw } = useGetSubjectsByClassQuery(classId, { skip: !classId });
  const subjects = subjectsRaw?.data || subjectsRaw || [];

  const { data: teachersRaw } = useGetTeachersQuery();
  const teachers = teachersRaw?.data || teachersRaw || [];

  const [createTimetable, { isLoading: isCreating }] = useCreateTimetableMutation();
  const [updateTimetable, { isLoading: isUpdating }] = useUpdateTimetableMutation();

  const [effectiveFrom, setEffectiveFrom] = useState('');
  const [effectiveTo, setEffectiveTo] = useState('');
  const [schedule, setSchedule] = useState(emptySchedule());
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (existingTimetable) {
      setEffectiveFrom(
        existingTimetable.effectiveFrom
          ? new Date(existingTimetable.effectiveFrom).toISOString().split('T')[0]
          : ''
      );
      setEffectiveTo(
        existingTimetable.effectiveTo
          ? new Date(existingTimetable.effectiveTo).toISOString().split('T')[0]
          : ''
      );
      setSchedule(normalizeSchedule(existingTimetable.schedule));
    }
  }, [existingTimetable]);

  const updateDay = (updatedDay) => {
    setSchedule((prev) =>
      prev.map((d) => (d.day === updatedDay.day ? updatedDay : d))
    );
  };

  const handleSave = async () => {
    setSaveError('');
    if (!effectiveFrom) {
      setSaveError('Effective from date is required.');
      return;
    }

    const payload = {
      class: classId,
      effectiveFrom,
      effectiveTo: effectiveTo || undefined,
      schedule: schedule.map((d) => ({
        day: d.day,
        periods: d.periods.map((p) => ({
          periodNumber: p.periodNumber,
          startTime: p.startTime,
          endTime: p.endTime,
          type: p.type,
          ...(p.type === 'LESSON' && {
            subject: p.subject || undefined,
            teacher: p.teacher || undefined,
            room: p.room || undefined,
          }),
        })),
      })),
    };

    try {
      if (timetableId) {
        await updateTimetable({ id: timetableId, ...payload }).unwrap();
      } else {
        await createTimetable(payload).unwrap();
      }
      navigate('/dashboard/timetable/manage');
    } catch (err) {
      setSaveError(err?.data?.message || 'Failed to save timetable.');
    }
  };

  if (isLoadingTimetable) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  const isSaving = isCreating || isUpdating;

  return (
    <div>
      <PageHeader
        title={`${timetableId ? 'Edit' : 'Create'} Timetable${className ? ` — ${className}` : ''}`}
        backUrl="/dashboard/timetable/manage"
      />

      {/* Effective dates */}
      <div className="mb-6 bg-white rounded-lg border border-gray-200 px-4 py-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Schedule period:</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">From</label>
            <input
              type="date"
              value={effectiveFrom}
              onChange={(e) => setEffectiveFrom(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">To (optional)</label>
            <input
              type="date"
              value={effectiveTo}
              onChange={(e) => setEffectiveTo(e.target.value)}
              min={effectiveFrom}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Per-day schedule */}
      <div className="space-y-4">
        {schedule.map((daySchedule) => (
          <DaySection
            key={daySchedule.day}
            daySchedule={daySchedule}
            subjects={subjects}
            teachers={teachers}
            onChange={updateDay}
          />
        ))}
      </div>

      {saveError && (
        <p className="mt-4 text-sm text-red-600">{saveError}</p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate('/dashboard/timetable/manage')}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <Button onClick={handleSave} isLoading={isSaving} disabled={isSaving}>
          <Save className="h-4 w-4 mr-1.5" />
          {timetableId ? 'Update Timetable' : 'Create Timetable'}
        </Button>
      </div>
    </div>
  );
};

export default TimetableEdit;
