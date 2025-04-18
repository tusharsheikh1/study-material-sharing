import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '../context/AuthContext';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import api from '../utils/api';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");
  const { login, user, loading, isAdmin, isFaculty, isCr } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogoUrl = async () => {
      try {
        const response = await api.get("/logos/logo");
        setLogoUrl(response.data.value);
      } catch (error) {
        console.error("Error fetching logo URL:", error);
      }
    };
    fetchLogoUrl();
  }, []);

  useEffect(() => {
    if (!loading && user) {
      if (isAdmin() || isFaculty() || isCr()) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        toast.error('Access denied. You do not have permission to access this page.');
      }
    }
  }, [user, loading, navigate, isAdmin, isFaculty, isCr]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      if (rememberMe) {
        localStorage.setItem('rememberMe', JSON.stringify(formData));
      } else {
        localStorage.removeItem('rememberMe');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    const savedCredentials = JSON.parse(localStorage.getItem('rememberMe'));
    if (savedCredentials) {
      setFormData(savedCredentials);
      setRememberMe(true);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-300 to-gray-500">
      <ToastContainer />
      <div className="w-full max-w-md p-8 bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-lg">
        {logoUrl && (
          <div className="flex justify-center mb-6">
            <img src={logoUrl} alt="Admin Logo" className="h-16 w-auto object-contain" />
          </div>
        )}
        <h2 className="text-4xl font-extrabold text-center text-gray-800">Admin Login</h2>
        <p className="mt-2 text-sm text-center text-gray-600">Sign in to access the admin panel.</p>
        {error && <p className="mt-4 text-sm text-center text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your admin email"
              required
              className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your admin password"
              required
              className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500 hover:text-blue-500 transition duration-200"
            >
              {showPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Remember Me
            </label>
            <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
