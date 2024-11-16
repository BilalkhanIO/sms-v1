import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useToast } from '../contexts/ToastContext';
import { 
  fetchScheduleById, 
  updateSchedule, 
  addPeriod, 
  updatePeriod, 
  deletePeriod 
} from '../redux/features/scheduleSlice';
import { 
  detectTimeConflicts, 
  detectTeacherConflicts, 
  detectRoomConflicts 
} from '../utils/scheduleUtils';

export const useSchedule = (scheduleId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const loadSchedule = useCallback(async () => {
    try {
      setLoading(true);
      await dispatch(fetchScheduleById(scheduleId)).unwrap();
    } catch (err) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [dispatch, scheduleId, addToast]);

  const checkConflicts = useCallback((period, existingPeriods) => {
    const timeConflict = detectTimeConflicts(existingPeriods, period);
    const teacherConflict = detectTeacherConflicts(existingPeriods, period);
    const roomConflict = detectRoomConflicts(existingPeriods, period);

    return {
      hasConflicts: timeConflict || teacherConflict || roomConflict,
      conflicts: {
        time: timeConflict,
        teacher: teacherConflict,
        room: roomConflict
      }
    };
  }, []);

  const addNewPeriod = useCallback(async (periodData) => {
    try {
      setLoading(true);
      await dispatch(addPeriod({ scheduleId, periodData })).unwrap();
      addToast('Period added successfully', 'success');
    } catch (err) {
      setError(err.message);
      addToast(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dispatch, scheduleId, addToast]);

  const updateExistingPeriod = useCallback(async (periodId, periodData) => {
    try {
      setLoading(true);
      await dispatch(updatePeriod({ 
        scheduleId, 
        periodId, 
        periodData 
      })).unwrap();
      addToast('Period updated successfully', 'success');
    } catch (err) {
      setError(err.message);
      addToast(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dispatch, scheduleId, addToast]);

  const removePeriod = useCallback(async (periodId) => {
    try {
      setLoading(true);
      await dispatch(deletePeriod({ scheduleId, periodId })).unwrap();
      addToast('Period deleted successfully', 'success');
    } catch (err) {
      setError(err.message);
      addToast(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dispatch, scheduleId, addToast]);

  return {
    loading,
    error,
    loadSchedule,
    checkConflicts,
    addNewPeriod,
    updateExistingPeriod,
    removePeriod
  };
};
