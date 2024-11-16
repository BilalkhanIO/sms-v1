import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useToast } from '../contexts/ToastContext';
import studentService from '../services/studentService';
import { 
  fetchStudents, 
  fetchStudentById,
  updateStudent 
} from '../redux/features/studentSlice';

export const useStudents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const getStudents = useCallback(async (params) => {
    try {
      setLoading(true);
      const result = await dispatch(fetchStudents(params)).unwrap();
      return result;
    } catch (err) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [dispatch, addToast]);

  const getStudentById = useCallback(async (id) => {
    try {
      setLoading(true);
      const result = await dispatch(fetchStudentById(id)).unwrap();
      return result;
    } catch (err) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [dispatch, addToast]);

  const updateStudentData = useCallback(async (id, data) => {
    try {
      setLoading(true);
      const result = await dispatch(updateStudent({ id, data })).unwrap();
      addToast('Student updated successfully', 'success');
      return result;
    } catch (err) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [dispatch, addToast]);

  return {
    loading,
    error,
    getStudents,
    getStudentById,
    updateStudentData
  };
}; 