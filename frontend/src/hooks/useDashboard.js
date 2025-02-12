import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../redux/features/dashboardSlice';

export const useDashboard = (role) => {
  const dispatch = useDispatch();
  const { stats, teacherStats, studentStats, loading, error } = useSelector(
    (state) => state.dashboard 
  );

  const getDashboardData = () => {
    switch (role?.toLowerCase()) {
      case 'teacher':
        return teacherStats;
      case 'student':
        return studentStats;
      default:
        return stats;
    }
  };

  useEffect(() => {
    if (role) {
      dispatch(fetchDashboardStats(role));
    }
  }, [role, dispatch]);

  return {
    dashboardData: getDashboardData(),
    loading: loading.stats,
    error,
  };
};
