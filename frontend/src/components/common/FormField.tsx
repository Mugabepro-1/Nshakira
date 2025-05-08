import { ReactNode } from 'react';
import { FormikErrors } from 'formik';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
  touched?: boolean;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

const FormField = ({
  id,
  label,
  error,
  touched,
  required = false,
  className = '',
  children,
}: FormFieldProps) => {
  const showError = touched && error;

  return (
    <div className={`mb-4 ${className}`}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-error-500 ml-1">*</span>}
      </label>
      {children}
      {showError && (
        <p className="mt-1 text-sm text-error-600">
          {typeof error === 'string' ? error : 'Invalid input'}
        </p>
      )}
    </div>
  );
};

export default FormField;