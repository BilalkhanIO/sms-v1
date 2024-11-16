import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import dashboardService from '../services/dashboardService';

export const useDashboard = (role) => {
  const [dashboardData, setDashboardData] = useState(null);
  const { loading, error, execute: fetchDashboardData } = useApi(
    dashboardService.getStats
  );

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData(role);
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    if (role) {
      loadDashboardData();
    }
  }, [role, fetchDashboardData]);

  const refreshDashboard = async () => {
    try {
      const data = await fetchDashboardData(role);
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to refresh dashboard data:', error);
    }
  };

  return {
    dashboardData,
    loading,
    error,
    refreshDashboard,
  };
};
