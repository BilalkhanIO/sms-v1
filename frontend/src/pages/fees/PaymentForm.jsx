import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { paymentSchema } from '../../utils/validationSchemas';
import { useRecordPaymentMutation, useGetFeeByIdQuery } from '../../api/feesApi';
import Button from '../../components/common/Button';
import FormSection from '../../components/forms/FormSection';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';
import FormError from '../../components/forms/FormError';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';

const PaymentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: fee, isLoading: isLoadingFee } = useGetFeeByIdQuery(id);
  const [recordPayment, { isLoading: isRecording }] = useRecordPaymentMutation();

  const formik = useFormik({
    initialValues: {
      amount: '',
      paymentMethod: 'cash',
      transactionId: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    },
    validationSchema: paymentSchema,
    onSubmit: async (values) => {
      try {
        await recordPayment({
          feeId: id,
          ...values,
          amount: parseFloat(values.amount)
        }).unwrap();
        navigate(`/dashboard/fees/${id}`);
      } catch (error) {
        console.error('Failed to record payment:', error);
      }
    },
  });

  if (isLoadingFee) {
    return <Spinner size="large" />;
  }

  const remainingAmount = fee.amount - (fee.paidAmount || 0);
  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'online', label: 'Online Payment' }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Record Payment"
        backUrl={`/dashboard/fees/${id}`}
      />

      <div className="max-w-4xl mx-auto">
        {/* Fee Summary */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Fee Title</p>
              <p className="font-medium text-gray-900">{fee.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Student</p>
              <p className="font-medium text-gray-900">
                {fee.student.firstName} {fee.student.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Remaining Amount</p>
              <p className="font-medium text-gray-900">
                ${remainingAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <FormSection>
            <InputField
              label="Payment Amount"
              name="amount"
              type="number"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.amount && formik.errors.amount}
              required
              min={0}
              max={remainingAmount}
              step={0.01}
            />

            <SelectField
              label="Payment Method"
              name="paymentMethod"
              value={paymentMethods.find(method => method.value === formik.values.paymentMethod)}
              onChange={option => formik.setFieldValue('paymentMethod', option?.value)}
              onBlur={() => formik.setFieldTouched('paymentMethod')}
              error={formik.touched.paymentMethod && formik.errors.paymentMethod}
              options={paymentMethods}
              required
            />

            <InputField
              label="Transaction ID"
              name="transactionId"
              value={formik.values.transactionId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.transactionId && formik.errors.transactionId}
              placeholder="Enter transaction ID, cheque number, etc."
            />

            <InputField
              label="Payment Date"
              name="date"
              type="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.date && formik.errors.date}
              required
            />

            <InputField
              label="Notes"
              name="notes"
              value={formik.values.notes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.notes && formik.errors.notes}
              multiline
              rows={4}
              placeholder="Add any additional notes about the payment"
            />
          </FormSection>

          <div className="mt-6 flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/dashboard/fees/${id}`)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isRecording}
              disabled={!formik.isValid || !formik.dirty}
            >
              Record Payment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm; 