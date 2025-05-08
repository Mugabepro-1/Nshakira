import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';

const resetPasswordSchema = Yup.object().shape({
  otp: Yup.string()
    .required('OTP is required')
    .matches(/^\d+$/, 'OTP must contain only digits')
    .length(6, 'OTP must be exactly 6 digits'),
  newPassword: Yup.string()
    .required('New password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});

const ResetPassword = () => {
  const { resetPassword, pendingVerification, error, clearError } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // If no pending verification, redirect to forgot password
  if (!pendingVerification) {
    return <Navigate to="/forgot-password" />;
  }

  const handleSubmit = async (values: { otp: string; newPassword: string }) => {
    if (!pendingVerification) return;
    
    setLoading(true);
    clearError();
    try {
      await resetPassword(
        pendingVerification.email,
        values.otp,
        values.newPassword
      );
      navigate('/login');
    } catch (err) {
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Set a new password
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Enter the verification code sent to your email and your new password.
      </p>

      <Formik
        initialValues={{ otp: '', newPassword: '', confirmPassword: '' }}
        validationSchema={resetPasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="space-y-6">
            <FormField
              id="otp"
              label="Verification Code"
              error={errors.otp}
              touched={touched.otp}
              required
            >
              <Field
                id="otp"
                name="otp"
                type="text"
                placeholder="123456"
                className={`appearance-none block w-full px-3 py-2 border text-center tracking-widest ${
                  errors.otp && touched.otp
                    ? 'border-error-300 focus:border-error-500 focus:ring-error-500'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm`}
                maxLength={6}
              />
            </FormField>

            <FormField
              id="newPassword"
              label="New Password"
              error={errors.newPassword}
              touched={touched.newPassword}
              required
            >
              <Field
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.newPassword && touched.newPassword
                    ? 'border-error-300 focus:border-error-500 focus:ring-error-500'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm`}
              />
            </FormField>

            <FormField
              id="confirmPassword"
              label="Confirm Password"
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
              required
            >
              <Field
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.confirmPassword && touched.confirmPassword
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
              Reset Password
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

export default ResetPassword;