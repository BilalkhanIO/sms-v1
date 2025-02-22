// src/components/forms/Form.jsx

import React from 'react';
import { Formik, Form as FormikForm } from 'formik';
import Button from '../common/Button';

const Form = ({
  initialValues,
  validationSchema,
  onSubmit,
  children,
  submitButton = 'Submit',
  isSubmitting = false,
  enableReinitialize = false,
  className = '',
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize={enableReinitialize}
    >
      {({ isSubmitting: formikSubmitting }) => (
        <FormikForm className={`space-y-6 ${className}`}>
          {typeof children === 'function' 
            ? children({ isSubmitting: isSubmitting || formikSubmitting })
            : children}
          
          {submitButton && (
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting || formikSubmitting}
                isLoading={isSubmitting || formikSubmitting}
              >
                {submitButton}
              </Button>
            </div>
          )}
        </FormikForm>
      )}
    </Formik>
  );
};

export default Form;