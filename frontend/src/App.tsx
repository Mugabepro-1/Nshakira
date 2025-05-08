import { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/routing/ProtectedRoute';
import AdminRoute from './components/routing/AdminRoute';
import { useAuth } from './contexts/AuthContext';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';

// Home Page
const Home = lazy(() => import('./pages/Home'));

// Auth Pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));

// User Pages
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));
const ReportLostItem = lazy(() => import('./pages/user/ReportLostItem'));
const ReportFoundItem = lazy(() => import('./pages/user/ReportFoundItem'));
const LostItems = lazy(() => import('./pages/user/LostItems'));
const FoundItems = lazy(() => import('./pages/user/FoundItems'));
const LostItemDetails = lazy(() => import('./pages/user/LostItemDetails'));
const FoundItemDetails = lazy(() => import('./pages/user/FoundItemDetails'));
const MyReports = lazy(() => import('./pages/user/MyReports'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ManageClaims = lazy(() => import('./pages/admin/ManageClaims'));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'));
const PDFReports = lazy(() => import('./pages/admin/PDFReports'));
const RegisterAdmin = lazy(() => import('./pages/admin/RegisterAdmin'));

// Error Pages
const NotFound = lazy(() => import('./pages/errors/NotFound'));
const ServerError = lazy(() => import('./pages/errors/ServerError'));

function App() {
  const { isAuthenticated, loading, error } = useAuth();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        {/* Public Home Page */}
        <Route path="/" element={!isAuthenticated ? <Home /> : <Navigate to="/dashboard" />} />

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
          <Route path="/reset-password" element={!isAuthenticated ? <ResetPassword /> : <Navigate to="/dashboard" />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<AppLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/lost/report" element={<ReportLostItem />} />
            <Route path="/found/report" element={<ReportFoundItem />} />
            <Route path="/lost" element={<LostItems />} />
            <Route path="/found" element={<FoundItems />} />
            <Route path="/lost/:id" element={<LostItemDetails />} />
            <Route path="/found/:id" element={<FoundItemDetails />} />
            <Route path="/my-reports" element={<MyReports />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/claims" element={<ManageClaims />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/reports" element={<PDFReports />} />
            <Route path="/admin/register" element={<RegisterAdmin />} />
          </Route>
        </Route>

        {/* Error Routes */}
        <Route path="/500" element={<ServerError />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </Suspense>
  );
}

export default App;