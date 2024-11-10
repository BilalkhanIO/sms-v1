import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { processPayment, fetchInvoices } from '../../redux/features/feeSlice';
import FeePaymentForm from '../../components/fee/FeePaymentForm';
import { CashIcon, CreditCardIcon } from '@heroicons/react/outline';

const FeePaymentPage = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const dispatch = useDispatch();
  const { invoices, loading } = useSelector((state) => state.fee);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  const handlePayment = async (paymentData) => {
    try {
      await dispatch(processPayment({
        invoiceId: selectedInvoice,
        ...paymentData,
      })).unwrap();
      
      // Handle successful payment
      setSelectedInvoice(null);
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Fee Payment</h1>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CashIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Total Collected
              </h3>
              <p className="text-2xl font-semibold text-green-600">$10,000</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CreditCardIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Pending Payments
              </h3>
              <p className="text-2xl font-semibold text-blue-600">15</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Selection */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Select Invoice
        </h2>
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedInvoice === invoice.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedInvoice(invoice.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {invoice.student.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Invoice #{invoice.number}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    ${invoice.amount}
                  </p>
                  <p className="text-sm text-gray-500">
                    Due: {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Form */}
      {selectedInvoice && (
        <div className="bg-white shadow rounded-lg">
          <FeePaymentForm
            invoice={invoices.find((inv) => inv.id === selectedInvoice)}
            onSubmit={handlePayment}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default FeePaymentPage; 