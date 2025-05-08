import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Package, Calendar, MapPin, User, Info, Phone } from 'lucide-react';
import { format } from 'date-fns';
import itemsService from '../../services/itemsService';
import claimsService from '../../services/claimsService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import FormField from '../../components/common/FormField';

const claimSchema = Yup.object().shape({
  description: Yup.string()
    .required('Claim description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be at most 500 characters'),
});

const LostItemDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [claimLoading, setClaimLoading] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await itemsService.getLostItemById(id);
        setItem(data);
      } catch (error) {
        console.error('Error fetching lost item details:', error);
        toast.error('Failed to load item details');
        navigate('/lost');
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id, navigate]);

  const handleClaim = async (values: { description: string }) => {
    if (!id) return;
    
    setClaimLoading(true);
    try {
      await claimsService.claimLostItem(id, { description: values.description });
      toast.success('Claim submitted successfully');
      setShowClaimForm(false);
      // Refresh item details to show claim status
      const updatedItem = await itemsService.getLostItemById(id);
      setItem(updatedItem);
    } catch (error) {
      console.error('Error claiming lost item:', error);
      toast.error('Failed to submit claim');
    } finally {
      setClaimLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Item not found</h2>
        <p className="mt-2 text-gray-600">The requested item does not exist or has been removed.</p>
        <Button as={Link} to="/lost" variant="primary" className="mt-4">
          Back to Lost Items
        </Button>
      </div>
    );
  }

  const formattedDate = item.lostDate 
    ? format(new Date(item.lostDate), 'MMMM dd, yyyy')
    : 'Unknown date';

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center">
          <Link to="/lost" className="text-primary-600 hover:text-primary-700 mr-2">
            Lost Items
          </Link>
          <span className="text-gray-500">/</span>
          <span className="ml-2 text-gray-500 truncate">{item.title}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">{item.title}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <div className="space-y-6">
              {/* Image */}
              <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-200">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package className="h-16 w-16 text-gray-400" />
                    <p className="ml-2 text-gray-500">No image available</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{item.description}</p>
              </div>

              {/* Claim Controls */}
              {item.canBeClaimed && !showClaimForm && (
                <div className="border-t border-gray-200 pt-4">
                  <Button
                    variant="primary"
                    onClick={() => setShowClaimForm(true)}
                    fullWidth
                  >
                    Claim This Item
                  </Button>
                  <p className="mt-2 text-sm text-gray-500 text-center">
                    If this is your lost item, you can submit a claim to the finder.
                  </p>
                </div>
              )}

              {/* Claim Form */}
              {showClaimForm && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Claim</h3>
                  <Formik
                    initialValues={{ description: '' }}
                    validationSchema={claimSchema}
                    onSubmit={handleClaim}
                  >
                    {({ errors, touched }) => (
                      <Form>
                        <FormField
                          id="description"
                          label="Why do you believe this is your item?"
                          error={errors.description}
                          touched={touched.description}
                          required
                        >
                          <Field
                            as="textarea"
                            id="description"
                            name="description"
                            rows={4}
                            placeholder="Provide specific details about the item that would prove it belongs to you. The more specific details you can provide, the better your chances of getting your item back."
                            className={`appearance-none block w-full px-3 py-2 border ${
                              errors.description && touched.description
                                ? 'border-error-300 focus:border-error-500 focus:ring-error-500'
                                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm`}
                          />
                        </FormField>

                        <div className="flex justify-end space-x-4 mt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowClaimForm(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="primary"
                            loading={claimLoading}
                          >
                            Submit Claim
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              )}

              {/* Already Claimed Message */}
              {item.claimed && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <Info className="h-5 w-5 text-yellow-400" />
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          This item has already been claimed and is pending approval.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div>
          <Card title="Item Details">
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Lost Date</p>
                  <p className="text-gray-900">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-gray-900">{item.location}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Package className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="text-gray-900">{item.category}</p>
                </div>
              </div>

              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Reported By</p>
                  <p className="text-gray-900">{item.user?.name || 'Anonymous'}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact</p>
                  <p className="text-gray-900">{item.contactInfo}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  {item.canBeClaimed ? (
                    "This item can be claimed if you believe it's yours."
                  ) : item.claimed ? (
                    "This item has been claimed and is awaiting approval."
                  ) : (
                    "This item has been approved and returned to its owner."
                  )}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LostItemDetails;