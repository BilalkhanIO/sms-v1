import React, { useState } from 'react';
import { CalendarOff, PlusCircle, Check, X, Trash2 } from 'lucide-react';
import {
  useGetLeaveRequestsQuery,
  useCreateLeaveRequestMutation,
  useUpdateLeaveRequestMutation,
  useDeleteLeaveRequestMutation,
} from '../../api/leaveApi';
import useAuth from '../../hooks/useAuth';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { useUIStore } from '../../store/zustand/useUIStore';

const LEAVE_TYPES = ['SICK', 'CASUAL', 'EMERGENCY', 'MATERNITY', 'PATERNITY', 'UNPAID', 'OTHER'];
const STATUS_TABS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];

const EMPTY_FORM = {
  leaveType: 'SICK',
  startDate: '',
  endDate: '',
  reason: '',
  applicantType: '',
};

// Map leave statuses to StatusBadge-compatible keys
const STATUS_LABEL_MAP = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
};

const LeaveList = () => {
  const { user, can } = useAuth();
  const openConfirm = useUIStore((s) => s.openConfirm);
  const addToast = useUIStore((s) => s.addToast);

  const isAdmin = user?.role === 'SCHOOL_ADMIN' || user?.role === 'SUPER_ADMIN';

  const [activeTab, setActiveTab] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});

  const queryParams = !isAdmin
    ? {}
    : activeTab !== 'ALL'
    ? { status: activeTab }
    : {};

  const { data, isLoading, isError, error } = useGetLeaveRequestsQuery(queryParams);
  const [createLeaveRequest, { isLoading: isCreating }] = useCreateLeaveRequestMutation();
  const [updateLeaveRequest, { isLoading: isUpdating }] = useUpdateLeaveRequestMutation();
  const [deleteLeaveRequest, { isLoading: isDeleting }] = useDeleteLeaveRequestMutation();

  const allLeaves = data?.data || data || [];

  // For non-admin: filter client-side since backend returns own requests
  const leaveList = isAdmin
    ? allLeaves
    : activeTab !== 'ALL'
    ? allLeaves.filter((l) => l.status === activeTab)
    : allLeaves;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.startDate) errs.startDate = 'Start date is required.';
    if (!form.endDate) errs.endDate = 'End date is required.';
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      errs.endDate = 'End date must be on or after start date.';
    if (!form.reason.trim()) errs.reason = 'Reason is required.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setFormErrors(errs);
      return;
    }
    try {
      const applicantType = user?.role === 'TEACHER' ? 'TEACHER' : 'STUDENT';
      await createLeaveRequest({ ...form, applicantType }).unwrap();
      addToast({ type: 'success', title: 'Leave request submitted' });
      setModalOpen(false);
      setForm(EMPTY_FORM);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Failed to submit request',
        message: err?.data?.message,
      });
    }
  };

  const handleApprove = (leave) => {
    openConfirm({
      title: 'Approve Leave',
      message: `Approve this leave request?`,
      onConfirm: async () => {
        try {
          await updateLeaveRequest({ id: leave._id, status: 'APPROVED' }).unwrap();
          addToast({ type: 'success', title: 'Leave request approved' });
        } catch (err) {
          addToast({ type: 'error', title: 'Failed to approve', message: err?.data?.message });
        }
      },
    });
  };

  const handleReject = (leave) => {
    openConfirm({
      title: 'Reject Leave',
      message: `Reject this leave request?`,
      danger: true,
      onConfirm: async () => {
        try {
          await updateLeaveRequest({ id: leave._id, status: 'REJECTED' }).unwrap();
          addToast({ type: 'success', title: 'Leave request rejected' });
        } catch (err) {
          addToast({ type: 'error', title: 'Failed to reject', message: err?.data?.message });
        }
      },
    });
  };

  const handleDelete = (leave) => {
    openConfirm({
      title: 'Delete Request',
      message: 'Are you sure you want to delete this leave request?',
      danger: true,
      onConfirm: async () => {
        try {
          await deleteLeaveRequest(leave._id).unwrap();
          addToast({ type: 'success', title: 'Leave request deleted' });
        } catch (err) {
          addToast({ type: 'error', title: 'Delete failed', message: err?.data?.message });
        }
      },
    });
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '—');

  const columns = [
    ...(isAdmin
      ? [
          {
            key: 'applicant',
            header: 'Applicant',
            className: 'font-medium text-gray-900',
            render: (l) => {
              const u = l.user || l.applicant;
              if (!u) return '—';
              return u.firstName && u.lastName
                ? `${u.firstName} ${u.lastName}`
                : u.name || u.email || '—';
            },
          },
        ]
      : []),
    {
      key: 'leaveType',
      header: 'Type',
      className: 'text-gray-600',
      render: (l) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
          {l.leaveType || '—'}
        </span>
      ),
    },
    {
      key: 'startDate',
      header: 'From',
      className: 'text-gray-500',
      render: (l) => formatDate(l.startDate),
    },
    {
      key: 'endDate',
      header: 'To',
      className: 'text-gray-500',
      render: (l) => formatDate(l.endDate),
    },
    {
      key: 'reason',
      header: 'Reason',
      className: 'text-gray-500 max-w-xs truncate',
      render: (l) => (
        <span className="truncate block max-w-xs" title={l.reason}>
          {l.reason || '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (l) => <StatusBadge status={STATUS_LABEL_MAP[l.status] || l.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (l) => (
        <div className="flex items-center justify-end gap-1.5">
          {isAdmin && l.status === 'PENDING' && (
            <>
              <button
                onClick={() => handleApprove(l)}
                disabled={isUpdating}
                className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                title="Approve"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleReject(l)}
                disabled={isUpdating}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                title="Reject"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}
          {(isAdmin || l.status === 'PENDING') && (
            <button
              onClick={() => handleDelete(l)}
              disabled={isDeleting}
              className="p-1.5 text-red-400 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
  const inputClass =
    'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  const errorClass = 'text-xs text-red-500 mt-1';

  return (
    <div>
      <PageHeader
        title="Leave Requests"
        action={
          !isAdmin && (
            <Button size="small" onClick={() => setModalOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Apply for Leave
            </Button>
          )
        }
      />

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-5 border-b border-gray-200">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={leaveList}
        keyField="_id"
        isLoading={isLoading}
        error={isError ? error : null}
        emptyMessage="No leave requests found."
        emptyIcon={<CalendarOff className="h-12 w-12 opacity-30" />}
      />

      {/* Apply for Leave Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setForm(EMPTY_FORM);
          setFormErrors({});
        }}
        title="Apply for Leave"
        size="default"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setModalOpen(false);
                setForm(EMPTY_FORM);
                setFormErrors({});
              }}
            >
              Cancel
            </Button>
            <Button type="submit" form="apply-leave-form" isLoading={isCreating}>
              Submit Request
            </Button>
          </>
        }
      >
        <form id="apply-leave-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Leave Type</label>
            <select
              name="leaveType"
              value={form.leaveType}
              onChange={handleChange}
              className={inputClass}
            >
              {LEAVE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className={inputClass}
              />
              {formErrors.startDate && <p className={errorClass}>{formErrors.startDate}</p>}
            </div>
            <div>
              <label className={labelClass}>End Date *</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                min={form.startDate}
                onChange={handleChange}
                className={inputClass}
              />
              {formErrors.endDate && <p className={errorClass}>{formErrors.endDate}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Reason *</label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              rows={3}
              placeholder="Briefly describe the reason for your leave..."
              className={`${inputClass} resize-none`}
            />
            {formErrors.reason && <p className={errorClass}>{formErrors.reason}</p>}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LeaveList;
