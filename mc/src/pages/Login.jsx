import AuthForm from '../components/AuthForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleSuccess = (message) => {
    toast.success(message);

    // Redirect based on user role
    if (user?.role === 'Admin') {
      navigate('/admin'); // Redirect to admin dashboard
    } else {
      navigate('/'); // Redirect to home for non-admin users
    }
  };

  const handleError = (message) => {
    toast.error(message);
  };

  return (
    <>
      <ToastContainer />
      <AuthForm type="login" onSuccess={handleSuccess} onError={handleError} />
    </>
  );
};

export default Login;