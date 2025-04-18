import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = '/login' }) => {
  const { user, loading } = useContext(AuthContext);

  // Wait for loading before deciding
  if (loading) return <div className="text-center p-10 text-gray-500">Loading...</div>;

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
