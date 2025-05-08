import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Package, PackageOpen, Calendar, MapPin, Check, Clock, X } from 'lucide-react';
import itemsService from '../../services/itemsService';
import claimsService from '../../services/claimsService';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';

const MyReports = () => {
  const [lostItems, setLostItems] = useState<any[]>([]);
  const [foundItems, setFoundItems] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('lost');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserReports = async () => {
      setLoading(true);
      try {
        const [lostData, foundData, claimsData] = await Promise.all([
          itemsService.getUserLostItems(),
          itemsService.getUserFoundItems(),
          claimsService.getUserClaims()
        ]);
        
        setLostItems(lostData);
        setFoundItems(foundData);
        setClaims(claimsData);
      } catch (error) {
        console.error('Error fetching user reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReports();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="mr-1 h-3 w-3" />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="mr-1 h-3 w-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
        <p className="mt-1 text-gray-600">
          View all your reported lost and found items, and your claims.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('lost')}
            className={`${
              activeTab === 'lost'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Lost Items ({lostItems.length})
          </button>
          <button
            onClick={() => setActiveTab('found')}
            className={`${
              activeTab === 'found'
                ? 'border-secondary-500 text-secondary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Found Items ({foundItems.length})
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`${
              activeTab === 'claims'
                ? 'border-accent-500 text-accent-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            My Claims ({claims.length})
          </button>
        </nav>
      </div>

      {/* Lost Items */}
      {activeTab === 'lost' && (
        <div>
          {lostItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No lost items reported</h3>
              <p className="mt-1 text-gray-500">You haven't reported any lost items yet.</p>
              <div className="mt-6">
                <Button as={Link} to="/lost/report" variant="primary">
                  Report a Lost Item
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {lostItems.map((item) => (
                <Card key={item.id} hoverable>
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                      <div className="h-24 w-24 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package className="h-10 w-10 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                        {item.claimed ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="mr-1 h-3 w-3" />
                            Claimed
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {item.description}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Calendar className="mr-1 h-4 w-4" />
                        Lost on {format(new Date(item.lostDate), 'MMM dd, yyyy')}
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <MapPin className="mr-1 h-4 w-4" />
                        {item.location}
                      </div>
                      <div className="mt-4">
                        <Link
                          to={`/lost/${item.id}`}
                          className="text-primary-600 hover:text-primary-500 font-medium text-sm"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Found Items */}
      {activeTab === 'found' && (
        <div>
          {foundItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <PackageOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No found items reported</h3>
              <p className="mt-1 text-gray-500">You haven't reported any found items yet.</p>
              <div className="mt-6">
                <Button as={Link} to="/found/report" variant="secondary">
                  Report a Found Item
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {foundItems.map((item) => (
                <Card key={item.id} hoverable>
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                      <div className="h-24 w-24 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <PackageOpen className="h-10 w-10 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                        {item.claimed ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="mr-1 h-3 w-3" />
                            Claimed
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {item.description}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Calendar className="mr-1 h-4 w-4" />
                        Found on {format(new Date(item.foundDate), 'MMM dd, yyyy')}
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <MapPin className="mr-1 h-4 w-4" />
                        {item.location}
                      </div>
                      <div className="mt-4">
                        <Link
                          to={`/found/${item.id}`}
                          className="text-secondary-600 hover:text-secondary-500 font-medium text-sm"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Claims */}
      {activeTab === 'claims' && (
        <div>
          {claims.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No claims submitted</h3>
              <p className="mt-1 text-gray-500">You haven't submitted any claims yet.</p>
              <div className="mt-6 space-x-4">
                <Button as={Link} to="/lost" variant="outline">
                  Browse Lost Items
                </Button>
                <Button as={Link} to="/found" variant="outline">
                  Browse Found Items
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {claims.map((claim) => (
                <Card key={claim.id} hoverable>
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                      <div className="h-24 w-24 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                        {claim.item?.imageUrl ? (
                          <img
                            src={claim.item.imageUrl}
                            alt={claim.item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : claim.itemType === 'LOST' ? (
                          <Package className="h-10 w-10 text-gray-400" />
                        ) : (
                          <PackageOpen className="h-10 w-10 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {claim.item?.title || 'Unknown Item'}
                        </h3>
                        {getStatusBadge(claim.status)}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        <span className="font-medium">Type:</span>{' '}
                        {claim.itemType === 'LOST' ? 'Lost Item' : 'Found Item'}
                      </div>
                      <div className="mt-1 text-sm text-gray-500 line-clamp-2">
                        <span className="font-medium">Your claim:</span> {claim.description}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Calendar className="mr-1 h-4 w-4" />
                        Claimed on {format(new Date(claim.createdAt), 'MMM dd, yyyy')}
                      </div>
                      <div className="mt-4">
                        <Link
                          to={claim.itemType === 'LOST' ? `/lost/${claim.itemId}` : `/found/${claim.itemId}`}
                          className="text-accent-600 hover:text-accent-500 font-medium text-sm"
                        >
                          View Item Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyReports;