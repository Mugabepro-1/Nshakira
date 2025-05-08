import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { 
  User, 
  UserX, 
  UserCheck, 
  Search,
  Calendar,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { format } from 'date-fns';
import userService from '../../services/userService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import SearchInput from '../../components/common/SearchInput';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  enabled: boolean;
  createdAt: string;
  lastLogin?: string;
}

const ManageUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: 10,
        search: searchTerm,
      };

      const response = await userService.getUsers(params);
      setUsers(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1); // API uses 0-based indexing
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setCurrentPage(0); // Reset to first page on new search
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    setProcessing(prev => ({ ...prev, [userId]: true }));
    try {
      if (currentStatus) {
        await userService.disableUser(userId);
        toast.success('User disabled successfully');
      } else {
        await userService.enableUser(userId);
        toast.success('User enabled successfully');
      }
      
      // Update the local state to reflect the change
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, enabled: !currentStatus } : user
        )
      );
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error(`Failed to ${currentStatus ? 'disable' : 'enable'} user`);
    } finally {
      setProcessing(prev => ({ ...prev, [userId]: false }));
    }
  };

  const getRoleBadge = (role: string) => {
    return role === 'ADMIN' ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        <ShieldAlert className="mr-1 h-3 w-3" />
        Admin
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <User className="mr-1 h-3 w-3" />
        User
      </span>
    );
  };

  const getStatusBadge = (enabled: boolean) => {
    return enabled ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <ShieldCheck className="mr-1 h-3 w-3" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <UserX className="mr-1 h-3 w-3" />
        Disabled
      </span>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <p className="mt-1 text-gray-600">
          View and manage all users registered in the system.
        </p>
      </div>

      <div className="mb-6 flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0">
        <SearchInput onSearch={handleSearch} placeholder="Search users by name or email..." />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : users.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm ? 'No users match your search criteria.' : 'There are no users registered in the system yet.'}
            </p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Joined
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Last Login
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.enabled)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin ? format(new Date(user.lastLogin), 'MMM dd, yyyy') : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {user.role !== 'ADMIN' && (
                        <Button
                          variant={user.enabled ? 'danger' : 'success'}
                          size="sm"
                          onClick={() => handleToggleUserStatus(user.id, user.enabled)}
                          loading={processing[user.id]}
                          disabled={processing[user.id]}
                        >
                          {user.enabled ? (
                            <>
                              <UserX className="mr-1 h-4 w-4" />
                              Disable
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-1 h-4 w-4" />
                              Enable
                            </>
                          )}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Pagination
        currentPage={currentPage + 1} // API uses 0-based indexing, UI uses 1-based
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ManageUsers;