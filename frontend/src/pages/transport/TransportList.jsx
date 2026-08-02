import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bus,
  PlusCircle,
  Trash2,
  Users,
  Phone,
  DollarSign,
  Hash,
} from 'lucide-react';
import {
  useGetRoutesQuery,
  useCreateRouteMutation,
  useDeleteRouteMutation,
} from '../../api/transportApi';
import useAuth from '../../hooks/useAuth';
import PageHeader from '../../components/common/PageHeader';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { useUIStore } from '../../store/zustand/useUIStore';

const VEHICLE_TYPES = ['BUS', 'VAN', 'MINIBUS'];

const EMPTY_FORM = {
  name: '',
  'vehicle.number': '',
  'vehicle.type': 'BUS',
  'vehicle.capacity': '',
  'driver.name': '',
  'driver.phone': '',
  monthlyFee: '',
};

const TransportList = () => {
  const { can } = useAuth();
  const openConfirm = useUIStore((s) => s.openConfirm);
  const addToast = useUIStore((s) => s.addToast);

  const { data: routes, isLoading, isError, error } = useGetRoutesQuery();
  const [createRoute, { isLoading: isCreating }] = useCreateRouteMutation();
  const [deleteRoute, { isLoading: isDeleting }] = useDeleteRouteMutation();

  const routeList = routes?.data || routes || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Route name is required.';
    if (!form['vehicle.number'].trim()) errs['vehicle.number'] = 'Vehicle number is required.';
    if (!form['vehicle.capacity']) errs['vehicle.capacity'] = 'Capacity is required.';
    if (!form['driver.name'].trim()) errs['driver.name'] = 'Driver name is required.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setFormErrors(errs);
      return;
    }
    const payload = {
      name: form.name,
      vehicle: {
        number: form['vehicle.number'],
        type: form['vehicle.type'],
        capacity: Number(form['vehicle.capacity']),
        driver: {
          name: form['driver.name'],
          phone: form['driver.phone'],
        },
      },
      monthlyFee: form.monthlyFee ? Number(form.monthlyFee) : undefined,
    };
    try {
      await createRoute(payload).unwrap();
      addToast({ type: 'success', title: 'Route created successfully' });
      setModalOpen(false);
      setForm(EMPTY_FORM);
    } catch (err) {
      addToast({ type: 'error', title: 'Failed to create route', message: err?.data?.message });
    }
  };

  const handleDelete = (route) => {
    openConfirm({
      title: 'Delete Route',
      message: `Are you sure you want to delete "${route.name}"?`,
      danger: true,
      onConfirm: async () => {
        try {
          await deleteRoute(route._id).unwrap();
          addToast({ type: 'success', title: 'Route deleted' });
        } catch (err) {
          addToast({ type: 'error', title: 'Delete failed', message: err?.data?.message });
        }
      },
    });
  };

  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
  const inputClass =
    'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  const errorClass = 'text-xs text-red-500 mt-1';

  return (
    <div>
      <PageHeader
        title="Transport Routes"
        action={
          can('transport', 'create') && (
            <Button size="small" onClick={() => setModalOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Add Route
            </Button>
          )
        }
      />

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error?.data?.message || 'Failed to load transport routes.'}
        </div>
      )}

      {!isLoading && !isError && routeList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Bus className="h-12 w-12 opacity-30 mb-3" />
          <p className="text-sm">No transport routes found.</p>
        </div>
      )}

      {!isLoading && !isError && routeList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {routeList.map((route) => (
            <div
              key={route._id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-5 flex flex-col gap-4"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-base">{route.name}</h3>
                  <span className="inline-block mt-1 text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                    {route.vehicle?.type || 'BUS'}
                  </span>
                </div>
                <Bus className="h-8 w-8 text-blue-400 flex-shrink-0" />
              </div>

              {/* Details */}
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Hash className="h-3.5 w-3.5" />
                  <span className="truncate">{route.vehicle?.number || '—'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Users className="h-3.5 w-3.5" />
                  <span>
                    {route.assignedStudents?.length ?? 0} / {route.vehicle?.capacity ?? '—'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 col-span-2">
                  <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">
                    {route.vehicle?.driver?.name || '—'}
                    {route.vehicle?.driver?.phone ? ` · ${route.vehicle.driver.phone}` : ''}
                  </span>
                </div>
                {route.monthlyFee != null && (
                  <div className="flex items-center gap-1.5 text-gray-500 col-span-2">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span>PKR {route.monthlyFee}/month</span>
                  </div>
                )}
              </dl>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <Link
                  to={`/dashboard/transport/${route._id}`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Manage Students →
                </Link>
                {can('transport', 'delete') && (
                  <button
                    onClick={() => handleDelete(route)}
                    disabled={isDeleting}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded disabled:opacity-50"
                    title="Delete route"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Route Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setForm(EMPTY_FORM);
          setFormErrors({});
        }}
        title="Add Transport Route"
        size="lg"
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
            <Button type="submit" form="add-route-form" isLoading={isCreating}>
              Create Route
            </Button>
          </>
        }
      >
        <form id="add-route-form" onSubmit={handleSubmit} className="space-y-4">
          {/* Route Name */}
          <div>
            <label className={labelClass}>Route Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Route A - North Campus"
              className={inputClass}
            />
            {formErrors.name && <p className={errorClass}>{formErrors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Vehicle Number */}
            <div>
              <label className={labelClass}>Vehicle Number *</label>
              <input
                name="vehicle.number"
                value={form['vehicle.number']}
                onChange={handleChange}
                placeholder="e.g. ABC-1234"
                className={inputClass}
              />
              {formErrors['vehicle.number'] && (
                <p className={errorClass}>{formErrors['vehicle.number']}</p>
              )}
            </div>

            {/* Vehicle Type */}
            <div>
              <label className={labelClass}>Vehicle Type</label>
              <select
                name="vehicle.type"
                value={form['vehicle.type']}
                onChange={handleChange}
                className={inputClass}
              >
                {VEHICLE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Capacity */}
            <div>
              <label className={labelClass}>Capacity *</label>
              <input
                name="vehicle.capacity"
                type="number"
                min="1"
                value={form['vehicle.capacity']}
                onChange={handleChange}
                placeholder="e.g. 40"
                className={inputClass}
              />
              {formErrors['vehicle.capacity'] && (
                <p className={errorClass}>{formErrors['vehicle.capacity']}</p>
              )}
            </div>

            {/* Monthly Fee */}
            <div>
              <label className={labelClass}>Monthly Fee (PKR)</label>
              <input
                name="monthlyFee"
                type="number"
                min="0"
                value={form.monthlyFee}
                onChange={handleChange}
                placeholder="e.g. 2000"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Driver Name */}
            <div>
              <label className={labelClass}>Driver Name *</label>
              <input
                name="driver.name"
                value={form['driver.name']}
                onChange={handleChange}
                placeholder="Full name"
                className={inputClass}
              />
              {formErrors['driver.name'] && (
                <p className={errorClass}>{formErrors['driver.name']}</p>
              )}
            </div>

            {/* Driver Phone */}
            <div>
              <label className={labelClass}>Driver Phone</label>
              <input
                name="driver.phone"
                value={form['driver.phone']}
                onChange={handleChange}
                placeholder="e.g. 0300-1234567"
                className={inputClass}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TransportList;
