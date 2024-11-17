import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import dashboardService from '../services/dashboardService';

export const useDashboard = (role) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getStats(role);
      setDashboardData(response.data);
    } catch (err) {
      const errorMessage = err.message || 'Failed to load dashboard data';
      setError(errorMessage);
      console.error('Dashboard error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role) {
      refreshDashboard();
    }
  }, [role]);

  return { dashboardData, loading, error, refreshDashboard };
};
