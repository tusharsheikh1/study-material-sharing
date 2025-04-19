import axios from 'axios';

// ✅ Dynamically choose backend based on environment
const getBaseURL = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost') {
    //return 'http://localhost:5000/api'; // Local backend
  }
  return 'https://study-material-backend-7lpw.onrender.com/api'; // Production backend
};

const api = axios.create({
  baseURL: getBaseURL(),
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized! Redirecting to login...');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Customer Management API calls
export const getCustomers = async (params) => {
  return await api.get('/customers', { params });
};

export const addCustomer = async (customerData) => {
  return await api.post('/customers', customerData);
};

export const updateCustomer = async (id, customerData) => {
  return await api.put(`/customers/${id}`, customerData);
};

export const deleteCustomer = async (id) => {
  return await api.delete(`/customers/${id}`);
};

export const deactivateCustomer = async (id) => {
  return await api.put(`/customers/${id}/deactivate`);
};

export const searchCustomers = async (query) => {
  return await api.get(`/customers/search`, { params: { query } });
};

export default api;
