import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Eye, Edit, Trash2, CreditCard, DollarSign } from 'lucide-react';
import { useGetFeesQuery, useDeleteFeeMutation } from '../../api/feesApi';
import useAuth from '../../hooks/useAuth';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { useUIStore } from '../../store/zustand/useUIStore';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAID', label: 'Paid' },
  { value: 'PARTIAL', label: 'Partial' },
  { value: 'OVERDUE', label: 'Overdue' },
  { value: 'WAIVED', label: 'Waived' },
];

const FeesList = () => {
  const navigate = useNavigate();
  const { can } = useAuth();
  const openConfirm = useUIStore((s) => s.openConfirm);
  const addToast = useUIStore((s) => s.addToast);
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading, isError, error } = useGetFeesQuery(statusFilter ? { status: statusFilter } : undefined);
  const [deleteFee, { isLoading: isDeleting }] = useDeleteFeeMutation();

  const fees = data?.data || data || [];

  const handleDelete = (fee) => {
    openConfirm({
      title: 'Delete Fee',
      message: `Are you sure you want to delete this fee record?`,
      danger: true,
      onConfirm: async () => {
        try {
          await deleteFee(fee._id).unwrap();
          addToast({ type: 'success', title: 'Fee record deleted' });
        } catch (err) {
          addToast({ type: 'error', title: 'Delete failed', message: err.data?.message });
        }
      },
    });
  };

  const columns = [
    {
      key: 'type',
      header: 'Fee Details',
      render: (f) => (
        <div>
          <p className="font-medium text-gray-900">{f.type}</p>
          {f.description && (
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
              {f.description.length > 60 ? `${f.description.slice(0, 60)}…` : f.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'student',
      header: 'Student',
      className: 'text-gray-500',
      render: (f) => {
        const name = `${f.student?.user?.firstName ?? ''} ${f.student?.user?.lastName ?? ''}`.trim();
        return name || '—';
      },
    },
    {
      key: 'amount',
      header: 'Amount',
      className: 'font-medium text-gray-900',
      render: (f) => (
        <div>
          <p>${Number(f.amount || 0).toFixed(2)}</p>
          {f.status === 'PARTIAL' && f.paidAmount != null && (
            <p className="text-xs text-gray-400">Paid: ${Number(f.paidAmount).toFixed(2)}</p>
          )}
        </div>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      className: 'text-gray-500',
      render: (f) => f.dueDate ? new Date(f.dueDate).toLocaleDateString() : '—',
    },
    {
      key: 'status',
      header: 'Status',
      render: (f) => <StatusBadge status={f.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (f) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/dashboard/fees/${f._id}`}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </Link>
          {can('fees', 'edit') && (
            <>
              <Link
                to={`/dashboard/fees/${f._id}/edit`}
                className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded"
                title="Edit"
              >
                <Edit className="h-4 w-4" />
              </Link>
              {f.status !== 'PAID' && (
                <Link
                  to={`/dashboard/fees/${f._id}/pay`}
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                  title="Record Payment"
                >
                  <DollarSign className="h-4 w-4" />
                </Link>
              )}
            </>
          )}
          {can('fees', 'delete') && (
            <button
              onClick={() => handleDelete(f)}
              disabled={isDeleting}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Fees"
        action={
          can('fees', 'create') && (
            <Button onClick={() => navigate('/dashboard/fees/create')} size="small">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Add Fee
            </Button>
          )
        }
      />

      {/* Status Filter */}
      <div className="mb-4 flex gap-2 flex-wrap">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              statusFilter === opt.value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={fees}
        keyField="_id"
        isLoading={isLoading}
        error={isError ? error : null}
        emptyMessage="No fee records found."
        emptyIcon={<CreditCard className="h-12 w-12 opacity-30" />}
      />
    </div>
  );
};

export default FeesList;
