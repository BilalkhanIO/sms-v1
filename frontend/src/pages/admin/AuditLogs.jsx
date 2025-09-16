import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Shield,
  Database,
  Mail,
  Calendar,
  FileText,
  Trash2,
  Edit,
  Plus,
  RefreshCw
} from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockLogs = [
      {
        id: 1,
        timestamp: new Date('2024-01-15T10:30:00Z'),
        type: 'LOGIN',
        severity: 'INFO',
        user: 'admin@school.com',
        userId: 'user123',
        action: 'User logged in successfully',
        details: 'Login from IP: 192.168.1.100',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'SUCCESS'
      },
      {
        id: 2,
        timestamp: new Date('2024-01-15T10:25:00Z'),
        type: 'USER_CREATE',
        severity: 'INFO',
        user: 'admin@school.com',
        userId: 'user123',
        action: 'Created new user',
        details: 'Created student: John Doe (john.doe@student.com)',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'SUCCESS'
      },
      {
        id: 3,
        timestamp: new Date('2024-01-15T10:20:00Z'),
        type: 'LOGIN_FAILED',
        severity: 'WARNING',
        user: 'unknown@school.com',
        userId: null,
        action: 'Failed login attempt',
        details: 'Invalid password for user: unknown@school.com',
        ipAddress: '192.168.1.200',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'FAILED'
      },
      {
        id: 4,
        timestamp: new Date('2024-01-15T10:15:00Z'),
        type: 'DATA_EXPORT',
        severity: 'INFO',
        user: 'admin@school.com',
        userId: 'user123',
        action: 'Exported student data',
        details: 'Exported 150 student records to CSV',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'SUCCESS'
      },
      {
        id: 5,
        timestamp: new Date('2024-01-15T10:10:00Z'),
        type: 'PERMISSION_DENIED',
        severity: 'WARNING',
        user: 'teacher@school.com',
        userId: 'user456',
        action: 'Access denied',
        details: 'Attempted to access admin panel without permission',
        ipAddress: '192.168.1.150',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'DENIED'
      },
      {
        id: 6,
        timestamp: new Date('2024-01-15T10:05:00Z'),
        type: 'SYSTEM_ERROR',
        severity: 'ERROR',
        user: 'system',
        userId: null,
        action: 'Database connection error',
        details: 'Failed to connect to MongoDB cluster',
        ipAddress: '127.0.0.1',
        userAgent: 'System',
        status: 'ERROR'
      },
      {
        id: 7,
        timestamp: new Date('2024-01-15T10:00:00Z'),
        type: 'USER_UPDATE',
        severity: 'INFO',
        user: 'admin@school.com',
        userId: 'user123',
        action: 'Updated user profile',
        details: 'Updated profile for student: Jane Smith',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'SUCCESS'
      },
      {
        id: 8,
        timestamp: new Date('2024-01-15T09:55:00Z'),
        type: 'SECURITY_ALERT',
        severity: 'CRITICAL',
        user: 'unknown@school.com',
        userId: null,
        action: 'Multiple failed login attempts',
        details: '5 failed login attempts from IP: 192.168.1.200',
        ipAddress: '192.168.1.200',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'ALERT'
      }
    ];
    
    setTimeout(() => {
      setLogs(mockLogs);
      setIsLoading(false);
    }, 1000);
  }, []);

  const logTypes = ['LOGIN', 'LOGOUT', 'USER_CREATE', 'USER_UPDATE', 'USER_DELETE', 'LOGIN_FAILED', 'PERMISSION_DENIED', 'DATA_EXPORT', 'SYSTEM_ERROR', 'SECURITY_ALERT'];
  const severities = ['INFO', 'WARNING', 'ERROR', 'CRITICAL'];
  const statuses = ['SUCCESS', 'FAILED', 'DENIED', 'ERROR', 'ALERT'];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || log.type === typeFilter;
    const matchesUser = !userFilter || log.user === userFilter;
    const matchesSeverity = !severityFilter || log.severity === severityFilter;
    const matchesDate = !dateFilter || log.timestamp.toDateString() === new Date(dateFilter).toDateString();
    
    return matchesSearch && matchesType && matchesUser && matchesSeverity && matchesDate;
  });

  const getSeverityColor = (severity) => {
    const colors = {
      'INFO': 'bg-blue-100 text-blue-800',
      'WARNING': 'bg-yellow-100 text-yellow-800',
      'ERROR': 'bg-red-100 text-red-800',
      'CRITICAL': 'bg-red-200 text-red-900'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      'SUCCESS': 'text-green-600',
      'FAILED': 'text-red-600',
      'DENIED': 'text-yellow-600',
      'ERROR': 'text-red-600',
      'ALERT': 'text-orange-600'
    };
    return colors[status] || 'text-gray-600';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'LOGIN': User,
      'LOGOUT': User,
      'USER_CREATE': Plus,
      'USER_UPDATE': Edit,
      'USER_DELETE': Trash2,
      'LOGIN_FAILED': XCircle,
      'PERMISSION_DENIED': Shield,
      'DATA_EXPORT': Download,
      'SYSTEM_ERROR': Database,
      'SECURITY_ALERT': AlertTriangle
    };
    return icons[type] || Activity;
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Type', 'Severity', 'User', 'Action', 'Details', 'IP Address', 'Status'],
      ...filteredLogs.map(log => [
        log.timestamp.toISOString(),
        log.type,
        log.severity,
        log.user,
        log.action,
        log.details,
        log.ipAddress,
        log.status
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600">Monitor system activities and security events</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportLogs}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Warnings</p>
              <p className="text-2xl font-bold text-gray-900">
                {logs.filter(log => log.severity === 'WARNING').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Errors</p>
              <p className="text-2xl font-bold text-gray-900">
                {logs.filter(log => log.severity === 'ERROR' || log.severity === 'CRITICAL').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Security Alerts</p>
              <p className="text-2xl font-bold text-gray-900">
                {logs.filter(log => log.type === 'SECURITY_ALERT').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {logTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Severities</option>
              {severities.map(severity => (
                <option key={severity} value={severity}>{severity}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Users</option>
              {[...new Set(logs.map(log => log.user))].map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => {
                const TypeIcon = getTypeIcon(log.type);
                return (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {log.timestamp.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TypeIcon className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{log.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {log.details}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Activity className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No logs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || typeFilter || severityFilter || userFilter || dateFilter
                ? 'Try adjusting your search criteria.'
                : 'No audit logs available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;