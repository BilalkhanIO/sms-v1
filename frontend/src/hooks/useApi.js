import { useState, useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';

export const useApi = (apiFunc) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunc(...args);
      return response;
    } catch (err) {
      setError(err);
      addToast(err.message || 'An error occurred', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunc, addToast]);

  return {
    loading,
    error,
    execute,
  };
};
