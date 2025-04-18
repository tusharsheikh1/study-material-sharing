import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const UserRoute = ({ children, allowedRoles = ['student', 'cr', 'faculty'] }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center p-10 text-gray-500">Loading...</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default UserRoute;
