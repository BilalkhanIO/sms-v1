import React, { useState } from 'react';
import { useGetAuditLogsQuery } from '../../api/auditLogsApi';
import {
  Activity,
  Search,
  Download,
  AlertTriangle,
  XCircle,
  Clock,
  User,
  Shield,
  Database,
  Trash2,
  Edit,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { useDebounce } from 'use-debounce';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const AuditLogs = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const { data, isLoading, isError, error, refetch } = useGetAuditLogsQuery({
    page,
    limit,
    search: debouncedSearchTerm,
    action: actionFilter,
    entity: entityFilter,
    startDate: dateFilter,
  });

  const logs = data?.data || [];
  const totalPages = data?.pages || 1;

  const logActions = [
    'LOGIN', 'LOGOUT', 'USER_CREATE', 'USER_UPDATE', 'USER_DELETE',
    'SCHOOL_CREATE', 'SCHOOL_UPDATE', 'SCHOOL_DELETE',
    'SYSTEM_SETTINGS_UPDATE', 'BACKUP_CREATE', 'REPORT_GENERATE'
  ];

  const logEntities = [
      'User', 'School', 'SystemSettings', 'Backup', 'Report'
  ]


  const getStatusColor = (status) => {
    const colors = {
      'SUCCESS': 'text-green-600',
      'FAILURE': 'text-red-600',
    };
    return colors[status] || 'text-gray-600';
  };

  const getActionIcon = (action) => {
    const icons = {
      'LOGIN': User, 'LOGOUT': User, 'USER_CREATE': Plus, 'USER_UPDATE': Edit, 'USER_DELETE': Trash2,
      'SCHOOL_CREATE': Plus, 'SCHOOL_UPDATE': Edit, 'SCHOOL_DELETE': Trash2,
      'SYSTEM_SETTINGS_UPDATE': Edit, 'BACKUP_CREATE': Database, 'REPORT_GENERATE': Download,
    };
    return icons[action] || Activity;
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Action', 'Entity', 'User', 'Details', 'IP Address', 'Status'],
      ...logs.map(log => [
        new Date(log.createdAt).toISOString(),
        log.action,
        log.entity,
        log.user?.email || 'N/A',
        log.details,
        log.ipAddress,
        log.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };


  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage message={error.data?.message || 'Failed to load audit logs.'} />;

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
            <p className="text-gray-600">Monitor system activities and security events</p>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={exportLogs} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
            <button onClick={refetch} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search details..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
              <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Actions</option>
                {logActions.map(action => <option key={action} value={action}>{action}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Entity</label>
              <select value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Entities</option>
                {logEntities.map(entity => <option key={entity} value={entity}>{entity}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => {
                const ActionIcon = getActionIcon(log.action);
                return (
                    <tr key={log._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-400"/>
                          {new Date(log.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <ActionIcon className="w-4 h-4 mr-2 text-gray-400"/>
                          <span className="text-sm font-medium text-gray-900">{log.action}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.entity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.user?.email || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getStatusColor(log.status)}`}>{log.status}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{log.details}</td>
                    </tr>
                );
              })}
              </tbody>
            </table>
          </div>
          {logs.length === 0 && (
              <div className="text-center py-12">
                <Activity className="mx-auto h-12 w-12 text-gray-400"/>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No logs found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
              </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-4">
            <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
            >
                Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
            >
                Next
            </button>
        </div>
      </div>
  );
};

export default AuditLogs;