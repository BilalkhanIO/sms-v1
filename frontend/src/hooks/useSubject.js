import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useToast } from '../contexts/ToastContext';
import { 
  fetchSubjectById, 
  updateSubject, 
  uploadMaterial 
} from '../redux/features/subjectSlice';
import { validateSubjectData, validateMaterial } from '../utils/validation/subjectValidation';

export const useSubject = (subjectId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const loadSubject = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await dispatch(fetchSubjectById(subjectId)).unwrap();
    } catch (err) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [dispatch, subjectId, addToast]);

  const updateSubjectData = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const validationErrors = validateSubjectData(data);
      if (Object.keys(validationErrors).length > 0) {
        throw new Error('Validation failed');
      }

      await dispatch(updateSubject({ id: subjectId, data })).unwrap();
      addToast('Subject updated successfully', 'success');
    } catch (err) {
      setError(err.message);
      addToast(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dispatch, subjectId, addToast]);

  const uploadMaterialFile = useCallback(async (materialData) => {
    try {
      setLoading(true);
      setError(null);

      const validationErrors = validateMaterial(materialData);
      if (Object.keys(validationErrors).length > 0) {
        throw new Error('Validation failed');
      }

      await dispatch(uploadMaterial({ 
        subjectId, 
        materialData 
      })).unwrap();
      addToast('Material uploaded successfully', 'success');
    } catch (err) {
      setError(err.message);
      addToast(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dispatch, subjectId, addToast]);

  return {
    loading,
    error,
    loadSubject,
    updateSubjectData,
    uploadMaterialFile
  };
};
