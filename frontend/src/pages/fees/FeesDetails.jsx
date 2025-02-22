import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetFeeByIdQuery, useDeleteFeeMutation, useGetPaymentHistoryQuery } from '../../api/feesApi';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import { DollarSign, Calendar, User, FileText, Trash, Edit, Receipt } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Modal from '../../components/common/Modal';

const FeesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: fee, isLoading: isLoadingFee } = useGetFeeByIdQuery(id);
  const { data: payments, isLoading: isLoadingPayments } = useGetPaymentHistoryQuery(id);
  const [deleteFee, { isLoading: isDeleting }] = useDeleteFeeMutation();

  if (isLoadingFee || isLoadingPayments) {
    return <Spinner size="large" />;
  }

  const handleDelete = async () => {
    try {
      await deleteFee(id).unwrap();
      navigate('/dashboard/fees');
    } catch (error) {
      console.error('Failed to delete fee:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Fee Details"
        backUrl="/dashboard/fees"
      >
        {isAdmin && (
          <div className="flex space-x-4">
            <Link to={`/dashboard/fees/${id}/payment`}>
              <Button variant="primary">
                <Receipt className="w-4 h-4 mr-2" />
                Record Payment
              </Button>
            </Link>
            <Link to={`/dashboard/fees/${id}/edit`}>
              <Button variant="secondary">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </PageHeader>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Basic Information */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{fee.title}</h2>
              <p className="mt-1 text-gray-600">{fee.description}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(fee.status)}`}>
              {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium">${fee.amount.toFixed(2)}</p>
                {fee.status === 'partial' && (
                  <p className="text-sm text-gray-500">
                    Paid: ${fee.paidAmount.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="font-medium">
                  {new Date(fee.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">
                  {fee.type.charAt(0).toUpperCase() + fee.type.slice(1)} Fee
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Student Information */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Student Information</h3>
          <div className="flex items-start space-x-4">
            <User className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="font-medium text-gray-900">
                {fee.student.firstName} {fee.student.lastName}
              </p>
              <p className="text-gray-500">Class: {fee.student.class?.name}</p>
              <p className="text-gray-500">Roll Number: {fee.student.rollNumber}</p>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Payment History</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {payments?.map((payment) => (
              <div key={payment.id} className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">
                      ${payment.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {payment.paymentMethod} - {payment.transactionId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">
                      {new Date(payment.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Recorded by: {payment.recordedBy}
                    </p>
                  </div>
                </div>
                {payment.notes && (
                  <p className="mt-2 text-sm text-gray-600">{payment.notes}</p>
                )}
              </div>
            ))}
            {(!payments || payments.length === 0) && (
              <div className="px-6 py-4 text-gray-500">
                No payment records found.
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Fee"
      >
        <div className="p-6">
          <p className="text-gray-600">
            Are you sure you want to delete this fee? This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end space-x-4">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FeesDetails; 