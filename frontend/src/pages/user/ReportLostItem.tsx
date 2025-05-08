import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import itemsService, { LostItemData } from '../../services/itemsService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import FormField from '../../components/common/FormField';
import ImageUpload from '../../components/common/ImageUpload';

const ItemSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be at most 100 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be at most 1000 characters'),
  category: Yup.string().required('Category is required'),
  location: Yup.string().required('Location is required'),
  lostDate: Yup.date()
    .required('Lost date is required')
    .max(new Date(), 'Lost date cannot be in the future'),
  contactInfo: Yup.string().required('Contact information is required'),
  image: Yup.mixed(),
});

const categories = [
  'Electronics',
  'Jewelry',
  'Clothing',
  'Documents',
  'Keys',
  'Bags',
  'Wallets',
  'Books',
  'Other',
];

const ReportLostItem = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    title: '',
    description: '',
    category: '',
    location: '',
    lostDate: format(new Date(), 'yyyy-MM-dd'),
    contactInfo: '',
    image: null,
  };

  const handleSubmit = async (values: LostItemData) => {
    setLoading(true);
    try {
      await itemsService.reportLostItem(values);
      toast.success('Lost item reported successfully');
      navigate('/my-reports');
    } catch (error) {
      console.error('Error reporting lost item:', error);
      toast.error('Failed to report lost item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Report Lost Item</h1>
        <p className="mt-1 text-gray-600">
          Provide details about your lost item to help others identify it.
        </p>
      </div>

      <Card>
        <Formik
          initialValues={initialValues}
          validationSchema={ItemSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  id="title"
                  label="Item Title"
                  error={errors.title}
                  touched={touched.title}
                  required
                >
                  <Field
                    id="title"
                    name="title"
                    type="text"
                    placeholder="e.g., Blue Smartphone, Gold Watch"
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.title && touched.title
                        ? 'border-error-300 focus:border-error-500 focus:ring-error-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm`}
                  />
                </FormField>

                <FormField
                  id="category"
                  label="Category"
                  error={errors.category}
                  touched={touched.category}
                  required
                >
                  <Field
                    as="select"
                    id="category"
                    name="category"
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.category && touched.category
                        ? 'border-error-300 focus:border-error-500 focus:ring-error-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Field>
                </FormField>
              </div>

              <FormField
                id="description"
                label="Description"
                error={errors.description}
                touched={touched.description}
                required
              >
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Provide a detailed description of the item, including distinctive features, brand, color, etc."
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.description && touched.description
                      ? 'border-error-300 focus:border-error-500 focus:ring-error-500'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm`}
                />
              </FormField>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  id="location"
                  label="Last Seen Location"
                  error={errors.location}
                  touched={touched.location}
                  required
                >
                  <Field
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g., Central Park, Main Library"
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.location && touched.location
                        ? 'border-error-300 focus:border-error-500 focus:ring-error-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm`}
                  />
                </FormField>

                <FormField
                  id="lostDate"
                  label="Date Lost"
                  error={errors.lostDate}
                  touched={touched.lostDate}
                  required
                >
                  <Field
                    id="lostDate"
                    name="lostDate"
                    type="date"
                    max={format(new Date(), 'yyyy-MM-dd')}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.lostDate && touched.lostDate
                        ? 'border-error-300 focus:border-error-500 focus:ring-error-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm`}
                  />
                </FormField>
              </div>

              <FormField
                id="contactInfo"
                label="Contact Information"
                error={errors.contactInfo}
                touched={touched.contactInfo}
                required
              >
                <Field
                  id="contactInfo"
                  name="contactInfo"
                  type="text"
                  placeholder="Phone number or alternative contact method"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.contactInfo && touched.contactInfo
                      ? 'border-error-300 focus:border-error-500 focus:ring-error-500'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm`}
                />
              </FormField>

              <FormField
                id="image"
                label="Image (Optional)"
                error={errors.image}
                touched={touched.image}
              >
                <ImageUpload
                  value={values.image}
                  onChange={(file) => setFieldValue('image', file)}
                  error={errors.image as string}
                />
              </FormField>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                >
                  Report Lost Item
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default ReportLostItem;