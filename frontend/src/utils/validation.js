export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return {
    isValid: password.length >= 8,
    message: password.length < 8 ? 'Password must be at least 8 characters' : '',
  };
};

export const validateRequired = (value, fieldName) => {
  return {
    isValid: value && value.trim().length > 0,
    message: !value || value.trim().length === 0 ? `${fieldName} is required` : '',
  };
};

export const validateForm = (values, schema) => {
  const errors = {};
  
  Object.keys(schema).forEach(field => {
    const value = values[field];
    const validations = schema[field];

    validations.forEach(validation => {
      if (validation.required && !value) {
        errors[field] = `${field} is required`;
      } else if (validation.minLength && value.length < validation.minLength) {
        errors[field] = `${field} must be at least ${validation.minLength} characters`;
      } else if (validation.pattern && !validation.pattern.test(value)) {
        errors[field] = validation.message;
      } else if (validation.custom) {
        const customError = validation.custom(value, values);
        if (customError) {
          errors[field] = customError;
        }
      }
    });
  });

  return errors;
};
