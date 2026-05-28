import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Bus,
  ArrowLeft,
  Users,
  Phone,
  Hash,
  DollarSign,
  MapPin,
  Plus,
  Trash2,
  X,
  UserMinus,
} from 'lucide-react';
import {
  useGetRouteByIdQuery,
  useUpdateRouteMutation,
  useAssignStudentMutation,
  useRemoveStudentMutation,
} from '../../api/transportApi';
import useAuth from '../../hooks/useAuth';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import { useUIStore } from '../../store/zustand/useUIStore';

const TransportDetails = () => {
  const { id } = useParams();
  const { can } = useAuth();
  const openConfirm = useUIStore((s) => s.openConfirm);
  const addToast = useUIStore((s) => s.addToast);

  const { data: routeData, isLoading, isError, error } = useGetRouteByIdQuery(id);
  const [updateRoute, { isLoading: isUpdating }] = useUpdateRouteMutation();
  const [assignStudent, { isLoading: isAssigning }] = useAssignStudentMutation();
  const [removeStudent, { isLoading: isRemoving }] = useRemoveStudentMutation();

  const route = routeData?.data || routeData || null;

  // Stops state — local editable list synced from route
  const [stops, setStops] = useState(null);
  const [newStop, setNewStop] = useState('');
  const [stopsSaving, setStopsSaving] = useState(false);

  // If stops is null, use the route's stops array
  const displayStops = stops ?? route?.stops ?? [];

  // Assign student modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [studentIdInput, setStudentIdInput] = useState('');

  const handleAddStop = () => {
    const trimmed = newStop.trim();
    if (!trimmed) return;
    setStops([...displayStops, trimmed]);
    setNewStop('');
  };

  const handleRemoveStop = (index) => {
    setStops(displayStops.filter((_, i) => i !== index));
  };

  const handleSaveStops = async () => {
    setStopsSaving(true);
    try {
      await updateRoute({ id, stops: displayStops }).unwrap();
      addToast({ type: 'success', title: 'Stops updated successfully' });
      setStops(null); // reset local override; will re-read from cache
    } catch (err) {
      addToast({ type: 'error', title: 'Failed to save stops', message: err?.data?.message });
    } finally {
      setStopsSaving(false);
    }
  };

  const stopsAreDirty = stops !== null;

  const handleAssignStudent = async (e) => {
    e.preventDefault();
    const sid = studentIdInput.trim();
    if (!sid) return;
    try {
      await assignStudent({ routeId: id, studentId: sid }).unwrap();
      addToast({ type: 'success', title: 'Student assigned to route' });
      setAssignModalOpen(false);
      setStudentIdInput('');
    } catch (err) {
      addToast({ type: 'error', title: 'Failed to assign student', message: err?.data?.message });
    }
  };

  const handleRemoveStudent = (student) => {
    const name =
      student.firstName && student.lastName
        ? `${student.firstName} ${student.lastName}`
        : student._id;
    openConfirm({
      title: 'Remove Student',
      message: `Remove "${name}" from this route?`,
      danger: true,
      onConfirm: async () => {
        try {
          await removeStudent({ routeId: id, studentId: student._id }).unwrap();
          addToast({ type: 'success', title: 'Student removed from route' });
        } catch (err) {
          addToast({ type: 'error', title: 'Failed to remove student', message: err?.data?.message });
        }
      },
    });
  };

  const inputClass =
    'flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (isError || !route) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
        {error?.data?.message || 'Failed to load route details.'}
      </div>
    );
  }

  const assignedStudents = route.students || [];

  return (
    <div>
      <PageHeader
        title={route.name}
        backUrl="/dashboard/transport"
        action={
          can('transport', 'edit') && (
            <Button size="small" onClick={() => setAssignModalOpen(true)}>
              <Users className="h-4 w-4 mr-1.5" />
              Assign Student
            </Button>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — Route info + stops */}
        <div className="lg:col-span-1 space-y-5">
          {/* Route Details Card */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bus className="h-5 w-5 text-blue-500" />
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Route Details
              </h2>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Hash className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="font-medium text-gray-500 w-28 shrink-0">Vehicle No.</span>
                <span className="text-gray-900">{route.vehicle?.number || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Bus className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="font-medium text-gray-500 w-28 shrink-0">Type</span>
                <span className="text-gray-900">{route.vehicle?.type || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="font-medium text-gray-500 w-28 shrink-0">Capacity</span>
                <span className="text-gray-900">
                  {assignedStudents.length} / {route.vehicle?.capacity ?? '—'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="font-medium text-gray-500 w-28 shrink-0">Driver</span>
                <span className="text-gray-900">{route.driver?.name || '—'}</span>
              </div>
              {route.driver?.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="font-medium text-gray-500 w-28 shrink-0">Phone</span>
                  <span className="text-gray-900">{route.driver.phone}</span>
                </div>
              )}
              {route.monthlyFee != null && (
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="font-medium text-gray-500 w-28 shrink-0">Monthly Fee</span>
                  <span className="text-gray-900">PKR {route.monthlyFee}</span>
                </div>
              )}
            </dl>
          </div>

          {/* Stops Card */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-green-500" />
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Stops
              </h2>
            </div>

            {displayStops.length === 0 && (
              <p className="text-sm text-gray-400 mb-3">No stops added yet.</p>
            )}

            <ul className="space-y-2 mb-3">
              {displayStops.map((stop, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-medium shrink-0">
                      {index + 1}
                    </span>
                    {stop}
                  </div>
                  {can('transport', 'edit') && (
                    <button
                      onClick={() => handleRemoveStop(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove stop"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {can('transport', 'edit') && (
              <>
                <div className="flex gap-2">
                  <input
                    value={newStop}
                    onChange={(e) => setNewStop(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddStop())}
                    placeholder="Add a stop..."
                    className={inputClass}
                  />
                  <button
                    onClick={handleAddStop}
                    className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    title="Add stop"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {stopsAreDirty && (
                  <Button
                    className="mt-3 w-full"
                    size="small"
                    onClick={handleSaveStops}
                    isLoading={stopsSaving || isUpdating}
                  >
                    Save Stops
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right column — Assigned Students */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Assigned Students
                </h2>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {assignedStudents.length} / {route.vehicle?.capacity ?? '∞'}
              </span>
            </div>

            {assignedStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Users className="h-10 w-10 opacity-30 mb-2" />
                <p className="text-sm">No students assigned to this route.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {assignedStudents.map((student) => {
                  const fullName =
                    student.firstName && student.lastName
                      ? `${student.firstName} ${student.lastName}`
                      : student.name || student._id;
                  const initials = fullName
                    .split(' ')
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase();

                  return (
                    <div
                      key={student._id}
                      className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold shrink-0">
                          {initials}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{fullName}</p>
                          {student.email && (
                            <p className="text-xs text-gray-500">{student.email}</p>
                          )}
                          {student.rollNumber && (
                            <p className="text-xs text-gray-400">Roll #{student.rollNumber}</p>
                          )}
                        </div>
                      </div>
                      {can('transport', 'edit') && (
                        <button
                          onClick={() => handleRemoveStudent(student)}
                          disabled={isRemoving}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          title="Remove from route"
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assign Student Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => {
          setAssignModalOpen(false);
          setStudentIdInput('');
        }}
        title="Assign Student to Route"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setAssignModalOpen(false);
                setStudentIdInput('');
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="assign-student-form"
              isLoading={isAssigning}
            >
              Assign
            </Button>
          </>
        }
      >
        <form id="assign-student-form" onSubmit={handleAssignStudent} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student ID
            </label>
            <input
              value={studentIdInput}
              onChange={(e) => setStudentIdInput(e.target.value)}
              placeholder="Enter student ID"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">
              Enter the MongoDB ObjectId of the student to assign.
            </p>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TransportDetails;
