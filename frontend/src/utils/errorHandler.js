import { useToast } from '../contexts/ToastContext';

export const handleApiError = (error, toast) => {
  if (error.response) {
    // Server responded with error
    const message = error.response.data?.message || 'An error occurred';
    toast(message, 'error');
  } else if (error.request) {
    // Request made but no response
    toast('Network error. Please check your connection.', 'error');
  } else {
    // Error in request setup
    toast('An unexpected error occurred.', 'error');
  }
  console.error('API Error:', error);
};

export const useApiErrorHandler = () => {
  const { addToast } = useToast();

  return (error) => handleApiError(error, addToast);
};
