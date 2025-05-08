import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const { login, error, clearError } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    clearError();
    try {
      await login(values.email, values.password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Log in to your account
      </h2>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginSchema}
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

            <FormField
              id="password"
              label="Password"
              error={errors.password}
              touched={touched.password}
              required
            >
              <Field
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.password && touched.password
                    ? 'border-error-300 focus:border-error-500 focus:ring-error-500'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm`}
              />
            </FormField>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

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
              Sign in
            </Button>

            <div className="text-center text-sm">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;