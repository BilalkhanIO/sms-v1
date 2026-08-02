import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  RefreshCw,
  Database,
  Mail,
  Shield,
  Bell,
  FileText,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  useGetSettingsQuery,
  useUpdateSettingMutation,
} from '../../api/settingsApi';
import Spinner from '../../components/common/Spinner';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({});

  const {
    data: fetchedSettings,
    isLoading: isLoadingSettings,
    error: settingsError,
  } = useGetSettingsQuery();
  const [
    updateSetting,
    { isLoading: isUpdating, error: updateError },
  ] = useUpdateSettingMutation();

  useEffect(() => {
    if (fetchedSettings) {
      const settingsList = fetchedSettings?.data || fetchedSettings;
      if (!Array.isArray(settingsList)) return;
      const settingsByCategory = settingsList.reduce((acc, setting) => {
        const [category, key] = setting.settingName.split('.');
        if (!acc[category]) {
          acc[category] = {};
        }
        acc[category][key] = setting.settingValue;
        return acc;
      }, {});
      setSettings(settingsByCategory);
    }
  }, [fetchedSettings]);

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'academic', label: 'Academic', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'backup', label: 'Backup', icon: Database }
  ];

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    const updatedSettings = Object.entries(settings).flatMap(
      ([category, values]) =>
        Object.entries(values).map(([key, value]) => ({
          settingName: `${category}.${key}`,
          settingValue: value,
        }))
    );

    try {
      await Promise.all(
        updatedSettings.map((setting) => updateSetting(setting).unwrap())
      );
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  if (isLoadingSettings) {
    return <Spinner />;
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            School Name
          </label>
          <input
            type="text"
            value={settings.general?.schoolName || ''}
            onChange={(e) =>
              handleSettingChange('general', 'schoolName', e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            School Code
          </label>
          <input
            type="text"
            value={settings.general?.schoolCode || ''}
            onChange={(e) =>
              handleSettingChange('general', 'schoolCode', e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Academic Year
          </label>
          <input
            type="text"
            value={settings.general?.academicYear || ''}
            onChange={(e) =>
              handleSettingChange('general', 'academicYear', e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={settings.general?.timezone || ''}
            onChange={(e) =>
              handleSettingChange('general', 'timezone', e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="UTC">UTC</option>
            <option value="EST">Eastern Time</option>
            <option value="PST">Pacific Time</option>
            <option value="GMT">Greenwich Mean Time</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={settings.general?.language || ''}
            onChange={(e) =>
              handleSettingChange('general', 'language', e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={settings.general?.currency || ''}
            onChange={(e) =>
              handleSettingChange('general', 'currency', e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="INR">INR</option>
          </select>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          File Upload Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max File Size (MB)
            </label>
            <input
              type="number"
              value={settings.general?.maxFileSize || ''}
              onChange={(e) =>
                handleSettingChange('general', 'maxFileSize', e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allowed File Types
            </label>
            <input
              type="text"
              value={settings.general?.allowedFileTypes || ''}
              onChange={(e) =>
                handleSettingChange(
                  'general',
                  'allowedFileTypes',
                  e.target.value
                )
              }
              placeholder="jpg,jpeg,png,pdf,doc,docx"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAcademicSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grading System
          </label>
          <select
            value={settings.academic?.gradingSystem || ''}
            onChange={(e) =>
              handleSettingChange('academic', 'gradingSystem', e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="percentage">Percentage</option>
            <option value="letter">Letter Grade</option>
            <option value="gpa">GPA</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passing Grade
          </label>
          <input
            type="number"
            value={settings.academic?.passingGrade || ''}
            onChange={(e) =>
              handleSettingChange('academic', 'passingGrade', e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Grade
          </label>
          <input
            type="number"
            value={settings.academic?.maxGrade || ''}
            onChange={(e) =>
              handleSettingChange('academic', 'maxGrade', e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Exam Duration (minutes)
          </label>
          <input
            type="number"
            value={settings.academic?.examDuration || ''}
            onChange={(e) =>
              handleSettingChange('academic', 'examDuration', e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Required Attendance (%)
          </label>
          <input
            type="number"
            value={settings.academic?.attendanceRequired || ''}
            onChange={(e) =>
              handleSettingChange(
                'academic',
                'attendanceRequired',
                e.target.value
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Absences
          </label>
          <input
            type="number"
            value={settings.academic?.maxAbsences || ''}
            onChange={(e) =>
              handleSettingChange('academic', 'maxAbsences', e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(settings.notifications || {}).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div>
              <h3 className="text-sm font-medium text-gray-900 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <p className="text-sm text-gray-500">
                {key === 'emailNotifications' && 'Send notifications via email'}
                {key === 'smsNotifications' && 'Send notifications via SMS'}
                {key === 'pushNotifications' && 'Send push notifications'}
                {key === 'loginAlerts' && 'Alert on user login/logout'}
                {key === 'examReminders' &&
                  'Remind users about upcoming exams'}
                {key === 'feeReminders' && 'Remind about pending fees'}
                {key === 'attendanceAlerts' && 'Alert about attendance issues'}
                {key === 'systemMaintenance' &&
                  'Notify about system maintenance'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) =>
                  handleSettingChange(
                    'notifications',
                    key,
                    e.target.checked
                  )
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password Min Length
          </label>
          <input
            type="number"
            value={settings.security?.passwordMinLength || ''}
            onChange={(e) =>
              handleSettingChange(
                'security',
                'passwordMinLength',
                e.target.value
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            value={settings.security?.sessionTimeout || ''}
            onChange={(e) =>
              handleSettingChange('security', 'sessionTimeout', e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Login Attempts
          </label>
          <input
            type="number"
            value={settings.security?.maxLoginAttempts || ''}
            onChange={(e) =>
              handleSettingChange(
                'security',
                'maxLoginAttempts',
                e.target.value
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lockout Duration (minutes)
          </label>
          <input
            type="number"
            value={settings.security?.lockoutDuration || ''}
            onChange={(e) =>
              handleSettingChange(
                'security',
                'lockoutDuration',
                e.target.value
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Password Requirements
        </h3>
        <div className="space-y-4">
          {Object.entries(settings.security || {})
            .filter(([key]) => key.startsWith('password'))
            .map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <h3 className="text-sm font-medium text-gray-900 capitalize">
                    {key.replace('password', '').replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {key === 'passwordRequireSpecial' &&
                      'Require special characters'}
                    {key === 'passwordRequireNumbers' && 'Require numbers'}
                    {key === 'passwordRequireUppercase' &&
                      'Require uppercase letters'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      handleSettingChange('security', key, e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SMTP Host
          </label>
          <input
            type="text"
            value={settings.email?.smtpHost || ''}
            onChange={(e) =>
              handleSettingChange('email', 'smtpHost', e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SMTP Port
          </label>
          <input
            type="number"
            value={settings.email?.smtpPort || ''}
            onChange={(e) =>
              handleSettingChange('email', 'smtpPort', e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SMTP Username
          </label>
          <input
            type="text"
            value={settings.email?.smtpUsername || ''}
            onChange={(e) =>
              handleSettingChange('email', 'smtpUsername', e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SMTP Password
          </label>
          <input
            type="password"
            value={settings.email?.smtpPassword || ''}
            onChange={(e) =>
              handleSettingChange('email', 'smtpPassword', e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From Email
          </label>
          <input
            type="email"
            value={settings.email?.fromEmail || ''}
            onChange={(e) =>
              handleSettingChange('email', 'fromEmail', e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From Name
          </label>
          <input
            type="text"
            value={settings.email?.fromName || ''}
            onChange={(e) =>
              handleSettingChange('email', 'fromName', e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="text-sm font-medium text-gray-900">SMTP Secure</h3>
            <p className="text-sm text-gray-500">
              Use SSL/TLS for secure connection
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.email?.smtpSecure || false}
              onChange={(e) =>
                handleSettingChange('email', 'smtpSecure', e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Backup Frequency
          </label>
          <select
            value={settings.backup?.backupFrequency || ''}
            onChange={(e) =>
              handleSettingChange('backup', 'backupFrequency', e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Backup Time
          </label>
          <input
            type="time"
            value={settings.backup?.backupTime || ''}
            onChange={(e) =>
              handleSettingChange('backup', 'backupTime', e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Retention Days
          </label>
          <input
            type="number"
            value={settings.backup?.retentionDays || ''}
            onChange={(e) =>
              handleSettingChange('backup', 'retentionDays', e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Backup Location
          </label>
          <input
            type="text"
            value={settings.backup?.backupLocation || ''}
            onChange={(e) =>
              handleSettingChange('backup', 'backupLocation', e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Backup Options
        </h3>
        <div className="space-y-4">
          {Object.entries(settings.backup || {})
            .filter(([key]) => typeof settings.backup[key] === 'boolean')
            .map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <h3 className="text-sm font-medium text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {key === 'autoBackup' && 'Automatically create backups'}
                    {key === 'cloudBackup' && 'Store backups in cloud storage'}
                    {key === 'localBackup' && 'Store backups locally'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      handleSettingChange('backup', key, e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'academic':
        return renderAcademicSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'email':
        return renderEmailSettings();
      case 'backup':
        return renderBackupSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">
            Configure system-wide settings and preferences
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {updateError && (
            <div className="flex items-center text-red-600">
              <XCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">Failed to save settings</span>
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;