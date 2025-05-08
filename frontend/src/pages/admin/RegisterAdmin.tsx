import { useState } from 'react';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ShieldAlert } from 'lucide-react';
import authService from '../../services/authService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import FormField from '../../components/common/FormField';

const registerSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

const RegisterAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values: {
    name: string;
    email: string;
    password: string;
  }, { resetForm }: { resetForm: () => void }) => {
    setLoading(true);
    try {
      await authService.registerAdmin(values);
      toast.success('Admin user registered successfully');
      setSuccess(true);
      resetForm();
    } catch (error) {
      console.error('Admin registration error:', error);
      toast.error('Failed to register admin user');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Register Admin User</h1>
        <p className="mt-1 text-gray-600">
          Create a new administrator account with full system access.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-center p-6 bg-purple-50 rounded-lg mb-4">
                <ShieldAlert className="h-12 w-12 text-purple-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Administrator Access</h3>
              <div className="text-gray-600 space-y-4">
                <p>
                  Admin users have full system privileges, including:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Managing all users</li>
                  <li>Approving or rejecting claims</li>
                  <li>Generating system reports</li>
                  <li>Creating other admin accounts</li>
                  <li>Accessing all system features</li>
                </ul>
                <div className="pt-4 text-sm text-amber-600 font-medium">
                  Only create admin accounts for trusted personnel who require full system access.
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            {success && (
              <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-success-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-success-800">Registration successful</h3>
                    <div className="mt-2 text-sm text-success-700">
                      <p>The admin user has been registered successfully. They can now log in with their credentials.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Formik
              initialValues={{
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={registerSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="space-y-6">
                  <FormField
                    id="name"
                    label="Full Name"
                    error={errors.name}
                    touched={touched.name}
                    required
                  >
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="John Doe"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.name && touched.name
                          ? 'border-error-300 focus:border-error-500 focus:ring-error-500'
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm`}
                    />
                  </FormField>

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
                      placeholder="admin@example.com"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.email && touched.email
                          ? 'border-error-300 focus:border-error-500 focus:ring-error-500'
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm`}
                    />
                  </FormField>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                        autoComplete="new-password"
                        placeholder="••••••••"
                        className={`appearance-none block w-full px-3 py-2 border ${
                          errors.password && touched.password
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
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      loading={loading}
                    >
                      Register Admin
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterAdmin;