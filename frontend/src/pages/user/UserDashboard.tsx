import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Package, PackageOpen } from 'lucide-react';
import itemsService from '../../services/itemsService';
import claimsService from '../../services/claimsService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

interface DashboardStats {
  totalLostItems: number;
  totalFoundItems: number;
  userLostItems: number;
  userFoundItems: number;
  userClaims: number;
}

const UserDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentLostItems, setRecentLostItems] = useState([]);
  const [recentFoundItems, setRecentFoundItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const [lostItems, foundItems, userLostItems, userFoundItems, userClaims] = await Promise.all([
          itemsService.getLostItems({ page: 0, size: 5 }),
          itemsService.getFoundItems({ page: 0, size: 5 }),
          itemsService.getUserLostItems(),
          itemsService.getUserFoundItems(),
          claimsService.getUserClaims()
        ]);

        // Set dashboard stats
        setStats({
          totalLostItems: lostItems.totalElements || 0,
          totalFoundItems: foundItems.totalElements || 0,
          userLostItems: userLostItems.length || 0,
          userFoundItems: userFoundItems.length || 0,
          userClaims: userClaims.length || 0
        });

        // Set recent items
        setRecentLostItems(lostItems.content || []);
        setRecentFoundItems(foundItems.content || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">Welcome to the Found & Lost Items Management System.</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary-50 border-l-4 border-l-primary-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Lost Items</p>
              <p className="mt-1 text-3xl font-semibold text-primary-700">{stats?.totalLostItems}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full text-primary-600">
              <Package size={24} />
            </div>
          </div>
        </Card>

        <Card className="bg-secondary-50 border-l-4 border-l-secondary-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Found Items</p>
              <p className="mt-1 text-3xl font-semibold text-secondary-700">{stats?.totalFoundItems}</p>
            </div>
            <div className="p-3 bg-secondary-100 rounded-full text-secondary-600">
              <PackageOpen size={24} />
            </div>
          </div>
        </Card>

        <Card className="bg-accent-50 border-l-4 border-l-accent-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Your Lost Items</p>
              <p className="mt-1 text-3xl font-semibold text-accent-700">{stats?.userLostItems}</p>
            </div>
            <div className="p-3 bg-accent-100 rounded-full text-accent-600">
              <Package size={24} />
            </div>
          </div>
        </Card>

        <Card className="bg-success-50 border-l-4 border-l-success-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Your Found Items</p>
              <p className="mt-1 text-3xl font-semibold text-success-700">{stats?.userFoundItems}</p>
            </div>
            <div className="p-3 bg-success-100 rounded-full text-success-600">
              <PackageOpen size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <Card title="Report an Item" className="h-full">
          <div className="flex flex-col h-full">
            <p className="text-gray-600 mb-6">
              Report lost or found items to help others recover their belongings.
            </p>
            <div className="mt-auto space-y-4">
              <Link 
                to="/lost/report" 
                className="block w-full" 
                data-testid="report-lost-btn"
                onClick={() => console.log('Navigating to: /lost/report')}
              >
                <Button variant="primary" fullWidth aria-label="Report Lost Item">
                  Report Lost Item
                </Button>
              </Link>              
              <Link 
                to="/found/report" 
                className="block w-full" 
                data-testid="report-found-btn"
                onClick={() => console.log('Navigating to: /found/report')}
              >
                <Button variant="secondary" fullWidth aria-label="Report Found Item">
                  Report Found Item
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card title="Find Items" className="h-full">
          <div className="flex flex-col h-full">
            <p className="text-gray-600 mb-6">
              Search through reported items to find what you're looking for.
            </p>
            <div className="mt-auto space-y-4">
              <Link 
                to="/lost" 
                className="block w-full" 
                data-testid="browse-lost-btn"
                onClick={() => console.log('Navigating to: /lost')}
              >
                <Button variant="accent" fullWidth aria-label="Browse Lost Items">
                  Browse Lost Items
                </Button>
              </Link>       
              <Link 
                to="/found" 
                className="block w-full" 
                data-testid="browse-found-btn"
                onClick={() => console.log('Navigating to: /found')}
              >
                <Button variant="success" fullWidth aria-label="Browse Found Items">
                  Browse Found Items
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Items */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Recent Lost Items">
          {recentLostItems.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recentLostItems.map((item: any) => (
                <li key={item.id} className="py-3">
                  <Link 
                    to={`/lost/${item.id}`}
                    className="block hover:bg-gray-50 rounded-md px-2 py-1 -mx-2 -my-1"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {item.location}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">No lost items reported yet.</p>
          )}
          
          {recentLostItems.length > 0 && (
            <div className="mt-4 text-center">
              <Link
                to="/lost"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View all lost items
              </Link>
            </div>
          )}
        </Card>

        <Card title="Recent Found Items">
          {recentFoundItems.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recentFoundItems.map((item: any) => (
                <li key={item.id} className="py-3">
                  <Link 
                    to={`/found/${item.id}`}
                    className="block hover:bg-gray-50 rounded-md px-2 py-1 -mx-2 -my-1"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-10 w-10 bg-secondary-100 rounded-full flex items-center justify-center">
                        <PackageOpen className="h-5 w-5 text-secondary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {item.location}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">No found items reported yet.</p>
          )}
          
          {recentFoundItems.length > 0 && (
            <div className="mt-4 text-center">
              <Link
                to="/found"
                className="text-sm font-medium text-secondary-600 hover:text-secondary-500"
              >
                View all found items
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;