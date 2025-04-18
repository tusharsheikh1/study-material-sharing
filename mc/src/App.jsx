import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import '@fortawesome/fontawesome-free/css/all.min.css';


import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import WaitingApproval from './pages/WaitingApproval';
import Leaderboard from './pages/Leaderboard';

// 👇 Developer Profile Page
import DeveloperProfile from './pages/DeveloperProfile';

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

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {!isAdminRoute && !isUserRoute && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes with Animation */}
          <Route path="/" element={<RouteWrapper><Home /></RouteWrapper>} />
          <Route path="/login" element={<RouteWrapper><Login /></RouteWrapper>} />
          <Route path="/admin" element={<RouteWrapper><AdminLogin /></RouteWrapper>} />
          <Route path="/register" element={<RouteWrapper><Register /></RouteWrapper>} />
          <Route path="/verify-otp" element={<RouteWrapper><VerifyOtp /></RouteWrapper>} />
          <Route path="/forgot-password" element={<RouteWrapper><ForgotPassword /></RouteWrapper>} />
          <Route path="/reset-password" element={<RouteWrapper><ResetPassword /></RouteWrapper>} />
          <Route path="/waiting-approval" element={<RouteWrapper><WaitingApproval /></RouteWrapper>} />
          <Route path="/leaderboard" element={<RouteWrapper><Leaderboard /></RouteWrapper>} />
          <Route path="/developers" element={<RouteWrapper><DeveloperProfile /></RouteWrapper>} /> {/* ✅ New Route */}

          {/* Admin Protected Routes */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route
                      path="users"
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <UserManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="media-upload"
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <MediaUpload />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="settings/logo"
                      element={
                        <ProtectedRoute allowedRoles={['admin', 'faculty', 'cr']}>
                          <LogoUpload />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="approvals"
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <UserApproval />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="roles"
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <RoleAssignment />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="materials"
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <AllMaterialManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="courses"
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <CourseManager />
                        </ProtectedRoute>
                      }
                    />
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
                    <Route
                      path="dashboard"
                      element={
                        <ProtectedRoute allowedRoles={['student', 'cr']}>
                          <StudentDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="uploads"
                      element={
                        <ProtectedRoute allowedRoles={['student', 'cr']}>
                          <StudentUploadHistory />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="upload"
                      element={
                        <ProtectedRoute allowedRoles={['student', 'cr', 'faculty']}>
                          <NotesOrQuestionUpload />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="profile"
                      element={
                        <ProtectedRoute allowedRoles={['student', 'cr', 'faculty']}>
                          <UserProfile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="find"
                      element={
                        <ProtectedRoute allowedRoles={['student', 'cr', 'faculty']}>
                          <FindMaterials />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </UserLayout>
              </UserRoute>
            }
          />
        </Routes>
      </AnimatePresence>
      {!isAdminRoute && !isUserRoute && <Footer />}
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
