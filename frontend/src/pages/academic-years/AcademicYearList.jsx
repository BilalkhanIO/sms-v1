import React, { useState } from 'react';
import { PlusCircle, CalendarRange, CheckCircle, Edit, Trash2, Star } from 'lucide-react';
import {
  useGetAcademicYearsQuery,
  useCreateAcademicYearMutation,
  useUpdateAcademicYearMutation,
  useDeleteAcademicYearMutation,
  useSetActiveYearMutation,
} from '../../api/academicYearApi';
import useAuth from '../../hooks/useAuth';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { useUIStore } from '../../store/zustand/useUIStore';

const EMPTY_FORM = { name: '', startDate: '', endDate: '', isActive: false };

const AcademicYearList = () => {
  const { can } = useAuth();
  const openConfirm = useUIStore((s) => s.openConfirm);
  const addToast = useUIStore((s) => s.addToast);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const { data, isLoading, isError, error } = useGetAcademicYearsQuery();
  const [createYear] = useCreateAcademicYearMutation();
  const [updateYear] = useUpdateAcademicYearMutation();
  const [deleteYear] = useDeleteAcademicYearMutation();
  const [setActive] = useSetActiveYearMutation();

  const years = data?.data || data || [];

  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (y) => { setEditItem(y); setForm({ name: y.name, startDate: y.startDate?.slice(0, 10), endDate: y.endDate?.slice(0, 10), isActive: y.isActive }); setModalOpen(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await updateYear({ id: editItem._id, ...form }).unwrap();
        addToast({ type: 'success', title: 'Academic year updated' });
      } else {
        await createYear(form).unwrap();
        addToast({ type: 'success', title: 'Academic year created' });
      }
      setModalOpen(false);
    } catch (err) {
      addToast({ type: 'error', title: 'Save failed', message: err.data?.message });
    }
  };

  const handleDelete = (y) => {
    openConfirm({
      title: 'Delete Academic Year',
      message: `Delete "${y.name}"? This cannot be undone.`,
      danger: true,
      onConfirm: async () => {
        try {
          await deleteYear(y._id).unwrap();
          addToast({ type: 'success', title: 'Deleted' });
        } catch (err) {
          addToast({ type: 'error', title: 'Delete failed', message: err.data?.message });
        }
      },
    });
  };

  const handleActivate = async (y) => {
    try {
      await setActive(y._id).unwrap();
      addToast({ type: 'success', title: `"${y.name}" set as active year` });
    } catch (err) {
      addToast({ type: 'error', title: 'Failed', message: err.data?.message });
    }
  };

  const columns = [
    {
      key: 'name', header: 'Year Name',
      render: (y) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{y.name}</span>
          {y.isActive && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Active</span>}
        </div>
      ),
    },
    { key: 'startDate', header: 'Start', className: 'text-gray-500', render: (y) => y.startDate ? new Date(y.startDate).toLocaleDateString() : '—' },
    { key: 'endDate', header: 'End', className: 'text-gray-500', render: (y) => y.endDate ? new Date(y.endDate).toLocaleDateString() : '—' },
    { key: 'terms', header: 'Terms', className: 'text-gray-500', render: (y) => y.terms?.length ?? 0 },
    {
      key: 'actions', header: 'Actions', headerClassName: 'text-right', className: 'text-right',
      render: (y) => (
        <div className="flex items-center justify-end gap-2">
          {!y.isActive && can('academicYears', 'edit') && (
            <button onClick={() => handleActivate(y)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Set Active">
              <Star className="h-4 w-4" />
            </button>
          )}
          {can('academicYears', 'edit') && (
            <button onClick={() => openEdit(y)} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded" title="Edit">
              <Edit className="h-4 w-4" />
            </button>
          )}
          {can('academicYears', 'delete') && !y.isActive && (
            <button onClick={() => handleDelete(y)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
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
        title="Academic Years"
        action={can('academicYears', 'create') && (
          <Button onClick={openCreate} size="small"><PlusCircle className="h-4 w-4 mr-1.5" />Add Year</Button>
        )}
      />

      <DataTable
        columns={columns} data={years} keyField="_id"
        isLoading={isLoading} error={isError ? error : null}
        emptyMessage="No academic years configured."
        emptyIcon={<CalendarRange className="h-12 w-12 opacity-30" />}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Academic Year' : 'New Academic Year'} size="default">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year Name</label>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required placeholder="e.g. 2024-2025" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} className="rounded" />
            <label htmlFor="isActive" className="text-sm text-gray-700">Set as active year</label>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AcademicYearList;
