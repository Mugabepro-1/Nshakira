import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, PackageSearch, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import RouteDebugger from '../components/common/RouteDebugger';

const AppLayout = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Navigation items based on user role
  const navigationItems = [
    // Common items for all authenticated users
    { name: 'Dashboard', path: '/dashboard', roles: ['USER', 'ADMIN'] },
    { name: 'Report Lost Item', path: '/lost/report', roles: ['USER', 'ADMIN'] },
    { name: 'Report Found Item', path: '/found/report', roles: ['USER', 'ADMIN'] },
    { name: 'Lost Items', path: '/lost', roles: ['USER', 'ADMIN'] },
    { name: 'Found Items', path: '/found', roles: ['USER', 'ADMIN'] },
    { name: 'My Reports', path: '/my-reports', roles: ['USER', 'ADMIN'] },
    
    // Admin-only items
    { name: 'Admin Dashboard', path: '/admin/dashboard', roles: ['ADMIN'] },
    { name: 'Manage Claims', path: '/admin/claims', roles: ['ADMIN'] },
    { name: 'Manage Users', path: '/admin/users', roles: ['ADMIN'] },
    { name: 'PDF Reports', path: '/admin/reports', roles: ['ADMIN'] },
    { name: 'Register Admin', path: '/admin/register', roles: ['ADMIN'] },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = isAdmin 
    ? navigationItems 
    : navigationItems.filter(item => item.roles.includes('USER') && !item.roles.includes('ADMIN'));

  if (!isAuthenticated) {
    return null;
  }

  const activeItemClass = "bg-primary-50 text-primary-700 border-l-4 border-primary-500";
  const inactiveItemClass = "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-0 flex z-40 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={closeSidebar}
          aria-hidden="true"
        ></div>
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={closeSidebar}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          {/* Mobile sidebar content */}
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <PackageSearch className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-lg font-semibold text-gray-900">Found & Lost</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    location.pathname === item.path ? activeItemClass : inactiveItemClass
                  }`}
                  onClick={closeSidebar}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Mobile user profile */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || "U"}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-gray-700">{user?.name}</p>
                <p className="text-sm font-medium text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <PackageSearch className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-lg font-semibold text-gray-900">Found & Lost</span>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {filteredNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.path ? activeItemClass : inactiveItemClass
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center w-full">
                <div className="flex-shrink-0">
                  <div className="h-9 w-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-700 truncate">{user?.name}</p>
                  <p className="text-xs font-medium text-gray-500 truncate">{user?.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="ml-auto p-1"
                  aria-label="Log out"
                  title="Log out"
                >
                  <LogOut size={18} className="text-gray-500" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 flex items-center shadow-sm h-16 bg-white">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center ml-4">
            <PackageSearch className="h-6 w-6 text-primary-600" />
            <span className="ml-2 font-semibold text-gray-900">Found & Lost</span>
          </div>
          <div className="ml-auto mr-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="p-2"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={18} className="text-gray-500" />
            </Button>
          </div>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      
      {/* Route Debugger - Remove in production */}
      <RouteDebugger />
    </div>
  );
};

export default AppLayout;