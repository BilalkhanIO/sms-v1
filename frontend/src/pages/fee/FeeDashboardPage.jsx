import { 
  ChartBarIcon,
  UserGroupIcon,
  ClipboardDocumentIcon, 
  Cog6ToothIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import FeeStructureForm from '../../components/fee/FeeStructureForm';
import FeePaymentForm from '../../components/fee/FeePaymentForm';
import FeeInvoiceGenerator from '../../components/fee/FeeInvoiceGenerator';
import ReminderAnalytics from '../../components/fee/ReminderAnalytics';
import Modal from '../../components/common/Modal';

const FeeDashboardPage = () => {
  const [stats] = useState({
    totalCollected: "₹1,235,000",
    pendingFees: "₹235,000",
    totalStudents: "450",
    defaulters: "45"
  });

  const [activeModal, setActiveModal] = useState(null);

  const StatCard = ({ title, value, Icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, Icon, onClick }) => (
    <button
      onClick={onClick}
      className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200 text-left w-full"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-6 w-6 text-indigo-600" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Fee Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Overview of fee collection and management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Collected"
            value={stats.totalCollected}
            Icon={ChartBarIcon}
            color="text-green-600"
          />
          <StatCard
            title="Pending Fees"
            value={stats.pendingFees}
            Icon={DocumentTextIcon}
            color="text-yellow-600"
          />
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            Icon={UserGroupIcon}
            color="text-blue-600"
          />
          <StatCard
            title="Defaulters"
            value={stats.defaulters}
            Icon={ClipboardDocumentIcon}
            color="text-red-600"
          />
        </div>

        {/* Analytics Section */}
        <div className="mb-8">
          <ReminderAnalytics />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionCard
              title="Record Payment"
              description="Record new fee payment"
              Icon={BuildingLibraryIcon}
              onClick={() => setActiveModal('payment')}
            />
            <QuickActionCard
              title="Generate Invoices"
              description="Generate fee invoices"
              Icon={DocumentTextIcon}
              onClick={() => setActiveModal('invoice')}
            />
            <QuickActionCard
              title="Fee Structure"
              description="View and modify fee structure"
              Icon={Cog6ToothIcon}
              onClick={() => setActiveModal('structure')}
            />
            <QuickActionCard
              title="Payment Reminders"
              description="Manage payment reminders"
              Icon={BellIcon}
              onClick={() => setActiveModal('reminders')}
            />
          </div>
        </div>

        {/* Modals */}
        {activeModal === 'payment' && (
          <Modal onClose={() => setActiveModal(null)} title="Record Fee Payment">
            <FeePaymentForm onClose={() => setActiveModal(null)} />
          </Modal>
        )}

        {activeModal === 'structure' && (
          <Modal onClose={() => setActiveModal(null)} title="Fee Structure">
            <FeeStructureForm onClose={() => setActiveModal(null)} />
          </Modal>
        )}

        {activeModal === 'invoice' && (
          <Modal onClose={() => setActiveModal(null)} title="Generate Invoices">
            <FeeInvoiceGenerator />
          </Modal>
        )}

        {/* Fee Invoice Generator */}
        <div className="mb-8">
          <FeeInvoiceGenerator />
        </div>
      </div>
    </div>
  );
};

export default FeeDashboardPage;




