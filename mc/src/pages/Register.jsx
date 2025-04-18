import AuthForm from '../components/AuthForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const handleSuccess = (message) => {
    toast.success(message);
  };

  const handleError = (message) => {
    toast.error(message);
  };

  return (
    <>
      <ToastContainer />
      <AuthForm type="register" onSuccess={handleSuccess} onError={handleError} />
    </>
  );
};

export default Register;