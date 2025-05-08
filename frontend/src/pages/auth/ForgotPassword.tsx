import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const ForgotPassword = () => {
  const { forgotPassword, error, clearError } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string }) => {
    setLoading(true);
    clearError();
    try {
      await forgotPassword(values.email);
      navigate('/reset-password');
    } catch (err) {
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Reset your password
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Enter your email address and we'll send you a code to reset your password.
      </p>

      <Formik
        initialValues={{ email: '' }}
        validationSchema={forgotPasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="space-y-6">
            <FormField
              id="email"
              label="Email address"
              error={errors.email}
              touched={touched.email}
              required
            >
              <Field
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.email && touched.email
                    ? 'border-error-300 focus:border-error-500 focus:ring-error-500'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm`}
              />
            </FormField>

            {error && (
              <div className="px-4 py-3 text-sm text-error-700 bg-error-50 rounded-md border border-error-200">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              Send Reset Code
            </Button>

            <div className="text-center text-sm">
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Back to Login
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPassword;