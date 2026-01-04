import React from 'react';
import { useLocation } from "react-router-dom";
import UserManagement from "../../pages/admin/UserManagement";
import SystemSettings from "../../pages/admin/SystemSettings";
import Reports from "../../pages/admin/Reports";
import AuditLogs from "../../pages/admin/AuditLogs";
import BackupManagement from "../../pages/admin/BackupManagement";
import SuperAdminStatsDashboard from './SuperAdminStatsDashboard';

const SuperAdminDashboard = () => {
  const location = useLocation();

  const renderContent = () => {
    switch (location.pathname) {
      case "/dashboard/admin/user-management":
        return <UserManagement />;
      case "/dashboard/admin/system-settings":
        return <SystemSettings />;
      case "/dashboard/admin/reports":
        return <Reports />;
      case "/dashboard/admin/audit-logs":
        return <AuditLogs />;
      case "/dashboard/admin/backup-management":
        return <BackupManagement />;
      default:
        return <SuperAdminStatsDashboard />;
    }
  };

  return <div>{renderContent()}</div>;
};

export default SuperAdminDashboard;
