import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  PackageOpen, 
  UserCheck, 
  FileText, 
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import userService from '../../services/userService';
import itemsService from '../../services/itemsService';
import claimsService from '../../services/claimsService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardStats {
  totalUsers: number;
  totalLostItems: number;
  totalFoundItems: number;
  totalClaims: number;
  pendingClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  itemsByCategory: Record<string, number>;
  claimsByStatus: Record<string, number>;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingClaims, setPendingClaims] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard stats
        const dashboardStats = await userService.getDashboardStats();
        setStats(dashboardStats);

        // Fetch pending claims for the quick panel
        const claimsResponse = await claimsService.getAllClaims({ 
          page: 0, 
          size: 5,
          status: 'PENDING' 
        });
        setPendingClaims(claimsResponse.content || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!stats) {
    return <div>Failed to load dashboard data.</div>;
  }

  // Prepare chart data
  const itemsChartData = {
    labels: ['Lost Items', 'Found Items', 'Approved Claims'],
    datasets: [
      {
        label: 'Count',
        data: [stats.totalLostItems, stats.totalFoundItems, stats.approvedClaims],
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)', // primary
          'rgba(20, 184, 166, 0.6)', // secondary
          'rgba(34, 197, 94, 0.6)', // success
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(20, 184, 166)',
          'rgb(34, 197, 94)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const claimsChartData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
      {
        data: [stats.pendingClaims, stats.approvedClaims, stats.rejectedClaims],
        backgroundColor: [
          'rgba(245, 158, 11, 0.6)', // amber-500
          'rgba(34, 197, 94, 0.6)', // green-500
          'rgba(239, 68, 68, 0.6)', // red-500
        ],
        borderColor: [
          'rgb(245, 158, 11)',
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Overview of the Lost and Found system.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary-50 border-l-4 border-l-primary-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Lost Items</p>
              <p className="mt-1 text-3xl font-semibold text-primary-700">{stats.totalLostItems}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full text-primary-600">
              <Package size={24} />
            </div>
          </div>
        </Card>

        <Card className="bg-secondary-50 border-l-4 border-l-secondary-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Found Items</p>
              <p className="mt-1 text-3xl font-semibold text-secondary-700">{stats.totalFoundItems}</p>
            </div>
            <div className="p-3 bg-secondary-100 rounded-full text-secondary-600">
              <PackageOpen size={24} />
            </div>
          </div>
        </Card>

        <Card className="bg-accent-50 border-l-4 border-l-accent-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Claims</p>
              <p className="mt-1 text-3xl font-semibold text-accent-700">{stats.totalClaims}</p>
            </div>
            <div className="p-3 bg-accent-100 rounded-full text-accent-600">
              <Clock size={24} />
            </div>
          </div>
        </Card>

        <Card className="bg-success-50 border-l-4 border-l-success-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Users</p>
              <p className="mt-1 text-3xl font-semibold text-success-700">{stats.totalUsers}</p>
            </div>
            <div className="p-3 bg-success-100 rounded-full text-success-600">
              <UserCheck size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts & Quick Actions Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Bar Chart */}
        <div className="lg:col-span-2">
          <Card title="Items Overview">
            <div className="h-80">
              <Bar
                data={itemsChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                      },
                    },
                  },
                  plugins: {
                    title: {
                      display: true,
                      text: 'Items and Claims Statistics',
                    },
                    legend: {
                      position: 'top',
                    },
                  },
                }}
              />
            </div>
          </Card>
        </div>

        {/* Pie Chart */}
        <div>
          <Card title="Claims Status">
            <div className="h-80 flex flex-col items-center justify-center">
              <Pie
                data={claimsChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions & Pending Claims */}
      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div>
          <Card title="Admin Actions">
            <div className="space-y-4">
              <Button
                as={Link}
                to="/admin/claims"
                variant="primary"
                fullWidth
              >
                <Clock className="mr-2 h-5 w-5" />
                Manage Claims ({stats.pendingClaims} pending)
              </Button>
              <Button
                as={Link}
                to="/admin/users"
                variant="secondary"
                fullWidth
              >
                <UserCheck className="mr-2 h-5 w-5" />
                Manage Users
              </Button>
              <Button
                as={Link}
                to="/admin/reports"
                variant="accent"
                fullWidth
              >
                <FileText className="mr-2 h-5 w-5" />
                Download Reports
              </Button>
              <Button
                as={Link}
                to="/admin/register"
                variant="outline"
                fullWidth
              >
                <UserCheck className="mr-2 h-5 w-5" />
                Register Admin
              </Button>
            </div>
          </Card>
        </div>

        {/* Pending Claims */}
        <div className="lg:col-span-2">
          <Card title="Recent Pending Claims">
            {pendingClaims.length === 0 ? (
              <div className="text-center py-6">
                <Clock className="mx-auto h-10 w-10 text-gray-400" />
                <p className="mt-2 text-gray-500">No pending claims at the moment.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {pendingClaims.map((claim: any) => (
                  <div key={claim.id} className="py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {claim.itemType === 'LOST' ? (
                          <Package className="h-5 w-5 text-gray-500" />
                        ) : (
                          <PackageOpen className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div className="ml-4 flex-grow">
                        <h4 className="text-sm font-medium text-gray-900">
                          {claim.item?.title || 'Unknown Item'}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Claimed by: {claim.user?.name || 'Unknown User'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-success-600 hover:bg-success-700 focus:outline-none"
                          title="Approve"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button 
                          className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-error-600 hover:bg-error-700 focus:outline-none"
                          title="Reject"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-4 text-center">
                  <Link
                    to="/admin/claims"
                    className="text-primary-600 hover:text-primary-500 font-medium text-sm"
                  >
                    View all pending claims →
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;