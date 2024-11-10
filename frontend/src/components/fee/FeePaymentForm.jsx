import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { recordFeePayment } from '../../redux/features/feeSlice';

const FeePaymentForm = ({ invoice, onClose }) => {
  const [formData, setFormData] = useState({
    amount: invoice?.amount || '',
    paymentMethod: 'CASH', // CASH, BANK_TRANSFER, CARD
    paymentDate: new Date().toISOString().split('T')[0],
    transactionId: '',
    remarks: '',
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    if (!formData.paymentDate) newErrors.paymentDate = 'Payment date is required';
    if (formData.paymentMethod !== 'CASH' && !formData.transactionId) {
      newErrors.transactionId = 'Transaction ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await dispatch(
        recordFeePayment({
          invoiceId: invoice.id,
          ...formData,
        })
      ).unwrap();
      onClose();
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: parseFloat(e.target.value) })
              }
              className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Method
          </label>
          <select
            value={formData.paymentMethod}
            onChange={(e) =>
              setFormData({ ...formData, paymentMethod: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="CASH">Cash</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CARD">Card Payment</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Date
          </label>
          <input
            type="date"
            value={formData.paymentDate}
            onChange={(e) =>
              setFormData({ ...formData, paymentDate: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.paymentDate && (
            <p className="mt-1 text-sm text-red-600">{errors.paymentDate}</p>
          )}
        </div>

        {formData.paymentMethod !== 'CASH' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Transaction ID
            </label>
            <input
              type="text"
              value={formData.transactionId}
              onChange={(e) =>
                setFormData({ ...formData, transactionId: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.transactionId && (
              <p className="mt-1 text-sm text-red-600">{errors.transactionId}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Remarks
          </label>
          <textarea
            value={formData.remarks}
            onChange={(e) =>
              setFormData({ ...formData, remarks: e.target.value })
            }
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {errors.submit && (
        <p className="text-sm text-red-600">{errors.submit}</p>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
        >
          Record Payment
        </button>
      </div>
    </form>
  );
};

export default FeePaymentForm; 