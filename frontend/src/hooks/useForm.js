import { useState, useCallback } from 'react';
import { validateForm } from '../utils/validation';

export const useForm = (initialValues, validationSchema) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const validate = useCallback(() => {
    const validationErrors = validateForm(values, validationSchema);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [values, validationSchema]);

  const handleSubmit = useCallback((onSubmit) => async (e) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(values);
    }
  }, [validate, values]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    setErrors,
  };
};
