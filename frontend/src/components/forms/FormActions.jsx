import React from 'react';
import { useFormikContext } from 'formik';
import Button from '../common/Button';

const FormActions = ({
  submitText = 'Submit',
  cancelText = 'Cancel',
  onCancel,
  showCancel = true,
  align = 'right',
  className = '',
}) => {
  const { isSubmitting, dirty } = useFormikContext();

  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div className={`
      flex items-center gap-4 pt-4 mt-6
      border-t border-gray-200
      ${alignmentClasses[align]}
      ${className}
    `}>
      {showCancel && (
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {cancelText}
        </Button>
      )}
      
      <Button
        type="submit"
        disabled={isSubmitting || !dirty}
        isLoading={isSubmitting}
      >
        {submitText}
      </Button>
    </div>
  );
};

export default FormActions; 