import { useState, useCallback } from 'react';

export const useApi = (apiFunc) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunc(...args);
      return response.data;
    } catch (error) {
      setError(error.message || 'An error occurred');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  return { loading, error, execute };
};
