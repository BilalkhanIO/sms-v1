import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeeStats } from '../../redux/features/feeSlice';
import {
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  // Provide default values to prevent undefined errors
  const { stats = {}, loading } = useSelector((state) => state.fee || { stats: {}, loading: false });

  useEffect(() => {
    dispatch(fetchFeeStats());
  }, [dispatch]);

  const statsCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents || 0,
      icon: UserGroupIcon,
      color: 'text-blue-600'
    },
    {
      title: 'Total Revenue',
      value: stats.totalCollection || 0,
      icon: CurrencyDollarIcon,
      color: 'text-green-600'
    },
    {
      title: 'Pending Fees',
      value: stats.totalOutstanding || 0,
      icon: DocumentTextIcon,
      color: 'text-yellow-600'
    },
    {
      title: 'Collection Rate',
      value: `${stats.collectionRate || 0}%`,
      icon: ChartBarIcon,
      color: 'text-purple-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {typeof stat.value === 'number' && stat.title.includes('Revenue') 
                    ? new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(stat.value)
                    : stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add your charts or other dashboard widgets here */}
      </div>
    </div>
  );
};

export default AdminDashboard; 