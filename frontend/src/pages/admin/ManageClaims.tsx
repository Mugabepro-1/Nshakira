import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { 
  CheckCircle, 
  XCircle, 
  Package, 
  PackageOpen, 
  Calendar, 
  User, 
  Clock, 
  FileText,
  Search
} from 'lucide-react';
import claimsService from '../../services/claimsService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import SearchInput from '../../components/common/SearchInput';

interface Claim {
  id: string;
  itemId: string;
  itemType: 'LOST' | 'FOUND';
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  item: {
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    category: string;
  };
}

const ManageClaims = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClaims();
  }, [currentPage, statusFilter, searchTerm]);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: 10,
        status: statusFilter,
        search: searchTerm,
      };

      const response = await claimsService.getAllClaims(params);
      setClaims(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Error fetching claims:', error);
      toast.error('Failed to load claims.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1); // API uses 0-based indexing
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(0); // Reset to first page when filter changes
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setCurrentPage(0); // Reset to first page on new search
  };

  const handleApproveClaim = async (id: string) => {
    setProcessing(prev => ({ ...prev, [id]: true }));
    try {
      await claimsService.approveClaim(id);
      toast.success('Claim approved successfully');
      
      // Update the local state to reflect the change
      setClaims(prevClaims => 
        prevClaims.map(claim => 
          claim.id === id ? { ...claim, status: 'APPROVED' } : claim
        )
      );
      
      // If we're filtering by status, refresh the list
      if (statusFilter === 'PENDING') {
        fetchClaims();
      }
    } catch (error) {
      console.error('Error approving claim:', error);
      toast.error('Failed to approve claim');
    } finally {
      setProcessing(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleRejectClaim = async (id: string) => {
    setProcessing(prev => ({ ...prev, [id]: true }));
    try {
      await claimsService.rejectClaim(id);
      toast.success('Claim rejected successfully');
      
      // Update the local state to reflect the change
      setClaims(prevClaims => 
        prevClaims.map(claim => 
          claim.id === id ? { ...claim, status: 'REJECTED' } : claim
        )
      );
      
      // If we're filtering by status, refresh the list
      if (statusFilter === 'PENDING') {
        fetchClaims();
      }
    } catch (error) {
      console.error('Error rejecting claim:', error);
      toast.error('Failed to reject claim');
    } finally {
      setProcessing(prev => ({ ...prev, [id]: false }));
    }
  };

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
            <CheckCircle className="mr-1 h-3 w-3" />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="mr-1 h-3 w-3" />
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

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Claims</h1>
        <p className="mt-1 text-gray-600">
          Review and respond to user claims for lost and found items.
        </p>
      </div>

      <div className="mb-6 flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0">
        <SearchInput onSearch={handleSearch} placeholder="Search claims..." />
        
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => handleStatusFilterChange('PENDING')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                statusFilter === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              } border`}
            >
              Pending
            </button>
            <button
              onClick={() => handleStatusFilterChange('APPROVED')}
              className={`px-4 py-2 text-sm font-medium ${
                statusFilter === 'APPROVED'
                  ? 'bg-green-100 text-green-800 border-green-200'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              } border-t border-b`}
            >
              Approved
            </button>
            <button
              onClick={() => handleStatusFilterChange('REJECTED')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                statusFilter === 'REJECTED'
                  ? 'bg-red-100 text-red-800 border-red-200'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              } border`}
            >
              Rejected
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : claims.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center">
              <FileText className="h-10 w-10" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No claims found</h3>
            <p className="mt-1 text-gray-500">
              {statusFilter === 'PENDING'
                ? 'There are no pending claims at the moment.'
                : statusFilter === 'APPROVED'
                ? 'There are no approved claims yet.'
                : 'There are no rejected claims yet.'}
            </p>
          </div>
        </Card>
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
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {claim.item?.title || 'Unknown Item'}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        claim.itemType === 'LOST' 
                          ? 'bg-primary-100 text-primary-800' 
                          : 'bg-secondary-100 text-secondary-800'
                      }`}>
                        {claim.itemType === 'LOST' ? 'Lost Item' : 'Found Item'}
                      </span>
                      {getStatusBadge(claim.status)}
                    </div>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="mr-1 h-4 w-4" />
                      <span>Claimed by: {claim.user?.name}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>
                        Claimed on: {format(new Date(claim.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700">Claim Reason:</h4>
                    <p className="mt-1 text-sm text-gray-600">{claim.description}</p>
                  </div>
                  
                  {claim.status === 'PENDING' && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleApproveClaim(claim.id)}
                        loading={processing[claim.id]}
                        disabled={processing[claim.id]}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRejectClaim(claim.id)}
                        loading={processing[claim.id]}
                        disabled={processing[claim.id]}
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage + 1} // API uses 0-based indexing, UI uses 1-based
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ManageClaims;