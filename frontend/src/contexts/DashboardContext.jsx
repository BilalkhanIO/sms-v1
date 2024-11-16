import { createContext, useContext, useState } from 'react';
import { useApi } from '../hooks/useApi';
import dashboardService from '../services/dashboardService';

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { loading, error, execute } = useApi(dashboardService.getStats);

  const refreshDashboard = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const value = {
    loading,
    error,
    refreshDashboard,
    execute,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
};
