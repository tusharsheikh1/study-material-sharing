import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center p-10 text-gray-500">Loading...</div>;
  }

  const allowedRoles = ['admin', 'faculty', 'cr'];

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default AdminRoute;
