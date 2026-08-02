import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  Trash2, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  HardDrive,
  Cloud,
  Server,
  FileText,
  Settings,
  Play,
  Pause,
  StopCircle,
  Calendar,
  Shield,
  Eye
} from 'lucide-react';
import {
  useGetBackupsQuery,
  useCreateBackupMutation,
  useRestoreBackupMutation,
  useDeleteBackupMutation,
  useGetBackupSettingsQuery,
  useUpdateBackupSettingsMutation
} from '../../api/backupApi';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../hooks/useToast';

const BackupManagement = () => {
  const { toast } = useToast();
  const { data: backupsRaw, isLoading: isLoadingBackups, refetch } = useGetBackupsQuery();
  const backups = backupsRaw?.data || backupsRaw || [];
  const [createBackup, { isLoading: isCreatingBackup }] = useCreateBackupMutation();
  const [restoreBackup, { isLoading: isRestoring }] = useRestoreBackupMutation();
  const [deleteBackup] = useDeleteBackupMutation();
  const { data: backupSettingsData, isLoading: isLoadingSettings } = useGetBackupSettingsQuery();
  const [updateBackupSettings] = useUpdateBackupSettingsMutation();

  const [selectedBackup, setSelectedBackup] = useState(null);
  const [backupSettings, setBackupSettings] = useState(backupSettingsData || {
    autoBackup: true,
    frequency: 'daily',
    time: '02:00',
    retention: 30,
    cloudBackup: false,
    localBackup: true,
    compression: true,
    encryption: true
  });

  React.useEffect(() => {
    if (backupSettingsData) {
      setBackupSettings(backupSettingsData);
    }
  }, [backupSettingsData]);

  const handleCreateBackup = async (type = 'FULL') => {
    try {
      await createBackup(type).unwrap();
      toast({
        title: "Success",
        description: "Backup created successfully.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create backup.",
        variant: "destructive",
      });
      console.error('Failed to create backup:', error);
    }
  };

  const handleRestoreBackup = async (backupId) => {
    try {
      await restoreBackup(backupId).unwrap();
      toast({
        title: "Success",
        description: "Backup restored successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to restore backup.",
        variant: "destructive",
      });
      console.error('Failed to restore backup:', error);
    }
  };

  const handleDeleteBackup = async (backupId) => {
    if (window.confirm('Are you sure you want to delete this backup? This action cannot be undone.')) {
      try {
        await deleteBackup(backupId).unwrap();
        toast({
          title: "Success",
          description: "Backup deleted successfully.",
        });
        refetch();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete backup.",
          variant: "destructive",
        });
        console.error('Failed to delete backup:', error);
      }
    }
  };

  const downloadBackup = (backupId) => {
    // Simulate download
    console.log('Downloading backup:', backupId);
  };

  const getStatusColor = (status) => {
    const colors = {
      'COMPLETED': 'text-green-600 bg-green-100',
      'IN_PROGRESS': 'text-blue-600 bg-blue-100',
      'FAILED': 'text-red-600 bg-red-100',
      'SCHEDULED': 'text-yellow-600 bg-yellow-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'FULL': Database,
      'INCREMENTAL': RefreshCw,
      'DATABASE': Server,
      'SCHEDULED': Calendar
    };
    return icons[type] || Database;
  };

  const getLocationIcon = (location) => {
    return location === 'CLOUD' ? Cloud : HardDrive;
  };

  const formatFileSize = (size) => {
    return size;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  if (isLoadingBackups || isLoadingSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Backup Management</h1>
          <p className="text-gray-600">Manage system backups and data recovery</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleCreateBackup('FULL')}
            disabled={isCreatingBackup}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isCreatingBackup ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Create Backup
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Database className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Backups</p>
              <p className="text-2xl font-bold text-gray-900">{backups?.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Successful</p>
              <p className="text-2xl font-bold text-gray-900">
                {backups?.filter(b => b.status === 'COMPLETED').length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-gray-900">
                {backups?.filter(b => b.status === 'FAILED').length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <HardDrive className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Size</p>
              <p className="text-2xl font-bold text-gray-900">
                {backups?.reduce((total, backup) => {
                  const size = parseFloat(backup.size);
                  return total + (isNaN(size) ? 0 : size);
                }, 0).toFixed(1) || 0} GB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Backup Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => handleCreateBackup('FULL')}
              disabled={isCreatingBackup}
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors disabled:opacity-50"
            >
              <Database className="w-5 h-5 mr-2" />
              <span>Full Backup</span>
            </button>
            <button className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors">
              <Settings className="w-5 h-5 mr-2" />
              <span>Schedule Backup</span>
            </button>
          </div>
        </div>
      </div>

      {/* Backup Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Backup Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Auto Backup</h4>
                <p className="text-sm text-gray-500">Enable automatic backups</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={backupSettings.autoBackup}
                  onChange={(e) => setBackupSettings(prev => ({ ...prev, autoBackup: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Cloud Backup</h4>
                <p className="text-sm text-gray-500">Store backups in cloud</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={backupSettings.cloudBackup}
                  onChange={(e) => setBackupSettings(prev => ({ ...prev, cloudBackup: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Compression</h4>
                <p className="text-sm text-gray-500">Compress backup files</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={backupSettings.compression}
                  onChange={(e) => setBackupSettings(prev => ({ ...prev, compression: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Encryption</h4>
                <p className="text-sm text-gray-500">Encrypt backup files</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={backupSettings.encryption}
                  onChange={(e) => setBackupSettings(prev => ({ ...prev, encryption: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Backup List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Backup History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {backups?.map((backup) => {
                  const TypeIcon = getTypeIcon(backup.type);
                  const LocationIcon = getLocationIcon(backup.location);
                  return (
                    <tr key={backup.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <TypeIcon className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{backup.name}</div>
                            <div className="text-sm text-gray-500">{backup.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {backup.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatFileSize(backup.size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(backup.status)}`}>
                          {backup.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <LocationIcon className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">{backup.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(backup.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {backup.status === 'COMPLETED' && (
                            <>
                              <button
                                onClick={() => downloadBackup(backup.id)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRestoreBackup(backup.id)}
                                disabled={isRestoring}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                title="Restore"
                              >
                                <Upload className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setSelectedBackup(backup)}
                            className="text-gray-600 hover:text-gray-900"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBackup(backup.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Backup Details Modal */}
      {selectedBackup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Backup Details</h3>
                <button
                  onClick={() => setSelectedBackup(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900">{selectedBackup.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="text-sm text-gray-900">{selectedBackup.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Size</label>
                  <p className="text-sm text-gray-900">{selectedBackup.size}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedBackup.status)}`}>
                    {selectedBackup.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="text-sm text-gray-900">{selectedBackup.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedBackup.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-900">{selectedBackup.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupManagement;
