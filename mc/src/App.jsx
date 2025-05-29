import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import GlobalSpinner from './components/GlobalSpinner';

// Public Pages (Only Auth-related pages remain public)
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import WaitingApproval from './pages/WaitingApproval';

// Protected Pages (Now require authentication)
import Home from './pages/Home';
import Profile from './pages/Profile'; // New Profile Page
import Leaderboard from './pages/Leaderboard';
import DeveloperProfile from './pages/DeveloperProfile';
import PublicFacultyPage from './pages/PublicFacultyPage';
import PublicStaffPage from './pages/PublicStaffPage';
import DocumentPage from './pages/DocumentPage';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import HelpCenter from './pages/HelpCenter';
import Resources from './pages/Resources';

// Admin
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import MediaUpload from './components/MediaUpload';
import LogoUpload from './components/LogoUpload';
import UserApproval from './pages/Admin/UserApproval';
import RoleAssignment from './pages/Admin/RoleAssignment';
import AllMaterialManagement from './pages/Admin/AllMaterialManagement';
import CourseManager from './pages/Admin/CourseManager';
import FacultyPage from './pages/Admin/FacultyPage';
import StaffPage from './pages/Admin/StaffPage';

// User
import ProtectedRoute from './components/ProtectedRoute';
import UserRoute from './components/UserRoute';
import UserLayout from './components/UserLayout';
import StudentDashboard from './pages/StudentDashboard';
import StudentUploadHistory from './pages/StudentUploadHistory';
import NotesOrQuestionUpload from './components/NotesOrQuestionUpload';
import UserProfile from './pages/UserProfile';
import FindMaterials from './pages/FindMaterials';

const RouteWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    className="min-h-screen"
  >
    {children}
  </motion.div>
);

const Layout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isUserRoute = location.pathname.startsWith('/user');
  const isProfileRoute = location.pathname.startsWith('/profile');

  // List of all public auth routes where Navbar and Footer should be hidden
  const publicAuthRoutes = [
    '/login',
    '/admin',
    '/register',
    '/verify-otp',
    '/forgot-password',
    '/reset-password',
    '/waiting-approval',
  ];

  const isPublicAuthRoute = publicAuthRoutes.includes(location.pathname);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 1);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {isLoading && <GlobalSpinner />}

      {/* Show Navbar only if NOT admin route, NOT user route, and NOT public auth route */}
      {!isAdminRoute && !isUserRoute && !isPublicAuthRoute && <Navbar />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes - Only Authentication Related */}
          <Route path="/login" element={<RouteWrapper><Login /></RouteWrapper>} />
          <Route path="/admin" element={<RouteWrapper><AdminLogin /></RouteWrapper>} />
          <Route path="/register" element={<RouteWrapper><Register /></RouteWrapper>} />
          <Route path="/verify-otp" element={<RouteWrapper><VerifyOtp /></RouteWrapper>} />
          <Route path="/forgot-password" element={<RouteWrapper><ForgotPassword /></RouteWrapper>} />
          <Route path="/reset-password" element={<RouteWrapper><ResetPassword /></RouteWrapper>} />
          <Route path="/waiting-approval" element={<RouteWrapper><WaitingApproval /></RouteWrapper>} />

          {/* Protected Public Routes - Require Authentication */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={['student', 'cr', 'faculty', 'admin']}>
                <RouteWrapper><Home /></RouteWrapper>
              </ProtectedRoute>
            }
          />
          
          {/* Profile Routes - New Enhanced Profile System */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['student', 'cr', 'faculty', 'admin']}>
                <RouteWrapper><Profile /></RouteWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute allowedRoles={['student', 'cr', 'faculty', 'admin']}>
                <RouteWrapper><Profile /></RouteWrapper>
              </ProtectedRoute>
            }
          />
          
          {/* Other Protected Public Routes */}
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute allowedRoles={['student', 'cr', 'faculty', 'admin']}>
                <RouteWrapper><Leaderboard /></RouteWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/developers"
            element={
              <ProtectedRoute allowedRoles={['student', 'cr', 'faculty', 'admin']}>
                <RouteWrapper><DeveloperProfile /></RouteWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty"
            element={
              <ProtectedRoute allowedRoles={['student', 'cr', 'faculty', 'admin']}>
                <RouteWrapper><PublicFacultyPage /></RouteWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={['student', 'cr', 'faculty', 'admin']}>
                <RouteWrapper><PublicStaffPage /></RouteWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/preview"
            element={
              <ProtectedRoute allowedRoles={['student', 'cr', 'faculty', 'admin']}>
                <RouteWrapper><DocumentPage /></RouteWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute allowedRoles={['student', 'cr', 'faculty', 'admin']}>
                <RouteWrapper><About /></RouteWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <ProtectedRoute allowedRoles={['student', 'cr', 'faculty', 'admin']}>
                <RouteWrapper><PrivacyPolicy /></RouteWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/terms"
            element={
              <ProtectedRoute allowedRoles={['student', 'cr', 'faculty', 'admin']}>
                <RouteWrapper><TermsConditions /></RouteWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/help-center"
            element={
              <ProtectedRoute allowedRoles={['student', 'cr', 'faculty', 'admin']}>
                <RouteWrapper><HelpCenter /></RouteWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute allowedRoles={['student', 'cr', 'faculty', 'admin']}>
                <RouteWrapper><Resources /></RouteWrapper>
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
                    <Route path="media-upload" element={<ProtectedRoute allowedRoles={['admin']}><MediaUpload /></ProtectedRoute>} />
                    <Route path="settings/logo" element={<ProtectedRoute allowedRoles={['admin', 'faculty', 'cr']}><LogoUpload /></ProtectedRoute>} />
                    <Route path="approvals" element={<ProtectedRoute allowedRoles={['admin']}><UserApproval /></ProtectedRoute>} />
                    <Route path="roles" element={<ProtectedRoute allowedRoles={['admin']}><RoleAssignment /></ProtectedRoute>} />
                    <Route path="materials" element={<ProtectedRoute allowedRoles={['admin']}><AllMaterialManagement /></ProtectedRoute>} />
                    <Route path="courses" element={<ProtectedRoute allowedRoles={['admin']}><CourseManager /></ProtectedRoute>} />
                    <Route path="faculty" element={<ProtectedRoute allowedRoles={['admin']}><FacultyPage /></ProtectedRoute>} />
                    <Route path="staff" element={<ProtectedRoute allowedRoles={['admin']}><StaffPage /></ProtectedRoute>} />
                  </Routes>
                </AdminLayout>
              </AdminRoute>
            }
          />

          {/* User Dashboard Routes */}
          <Route
            path="/user/*"
            element={
              <UserRoute>
                <UserLayout>
                  <Routes>
                    <Route path="dashboard" element={<ProtectedRoute allowedRoles={['student', 'cr']}><StudentDashboard /></ProtectedRoute>} />
                    <Route path="uploads" element={<ProtectedRoute allowedRoles={['student', 'cr']}><StudentUploadHistory /></ProtectedRoute>} />
                    <Route path="upload" element={<ProtectedRoute allowedRoles={['student', 'cr', 'faculty']}><NotesOrQuestionUpload /></ProtectedRoute>} />
                    <Route path="profile" element={<ProtectedRoute allowedRoles={['student', 'cr', 'faculty']}><UserProfile /></ProtectedRoute>} />
                    <Route path="find" element={<ProtectedRoute allowedRoles={['student', 'cr', 'faculty']}><FindMaterials /></ProtectedRoute>} />
                  </Routes>
                  <div className="sm:hidden">
                    <MobileBottomNav />
                  </div>
                </UserLayout>
              </UserRoute>
            }
          />

          {/* Catch-all route for 404 */}
          <Route 
            path="*" 
            element={
              <RouteWrapper>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                    <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Page Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                      The page you're looking for doesn't exist or has been moved.
                    </p>
                    <a
                      href="/"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Go Home
                    </a>
                  </div>
                </div>
              </RouteWrapper>
            } 
          />
        </Routes>
      </AnimatePresence>

      {/* Show Footer only if NOT admin route, NOT user route, and NOT public auth route */}
      {!isAdminRoute && !isUserRoute && !isPublicAuthRoute && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
};

export default App;