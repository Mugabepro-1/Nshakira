import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';

const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .required('OTP is required')
    .matches(/^\d+$/, 'OTP must contain only digits')
    .length(6, 'OTP must be exactly 6 digits'),
});

const VerifyOTP = () => {
  const { verifyOTP, pendingVerification, isAuthenticated, error, clearError } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If no pending verification, redirect to login
  if (!pendingVerification && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (values: { otp: string }) => {
    if (!pendingVerification) return;
    
    setLoading(true);
    clearError();
    try {
      await verifyOTP(pendingVerification.email, values.otp);
      navigate('/dashboard');
    } catch (err) {
      console.error('OTP verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Two-Factor Authentication
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Enter the 6-digit code sent to your email
      </p>

      <Formik
        initialValues={{ otp: '' }}
        validationSchema={otpSchema}
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
                className={`appearance-none block w-full px-3 py-2 border text-center text-lg tracking-widest ${
                  errors.otp && touched.otp
                    ? 'border-error-300 focus:border-error-500 focus:ring-error-500'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm`}
                maxLength={6}
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
              Verify
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default VerifyOTP;