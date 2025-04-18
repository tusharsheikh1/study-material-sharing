import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust according to your backend URL
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login)
      console.error('Unauthorized! Redirecting to login...');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Customer Management API calls
export const getCustomers = async (params) => {
  return await api.get('/customers', { params }); // Fetch all customers with optional pagination and sorting
};

export const addCustomer = async (customerData) => {
  return await api.post('/customers', customerData); // Add a new customer
};

export const updateCustomer = async (id, customerData) => {
  return await api.put(`/customers/${id}`, customerData); // Update a customer
};

export const deleteCustomer = async (id) => {
  return await api.delete(`/customers/${id}`); // Delete a customer
};

export const deactivateCustomer = async (id) => {
  return await api.put(`/customers/${id}/deactivate`); // Deactivate a customer
};

export const searchCustomers = async (query) => {
  return await api.get(`/customers/search`, { params: { query } }); // Search customers by name, email, or phone number
};

export default api;