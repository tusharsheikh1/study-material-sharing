import axios from 'axios';

// ✅ Automatically detect base URL depending on environment
const getBaseURL = () => {
  const hostname = window.location.hostname;

  if (hostname === 'localhost') {
    return 'http://localhost:5000/api'; // Local backend
  }

  // Default to production backend
  return 'https://study-material-backend-7lpw.onrender.com/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // ✅ Required for sending cookies or auth headers
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

// ✅ Customer Management API
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

// ✅ Material Management API
export const getMaterials = async ({
  batch = '',
  semester = '',
  materialType = '',
  uploadedBy = '',
  courseId = '',
  search = '',
  sortBy = '',
  sort = 'desc',
  page = 1,
  limit = 100,
} = {}) => {
  const params = {};

  if (batch) params.batch = batch;
  if (semester) params.semester = semester;
  if (materialType) params.materialType = materialType;
  if (uploadedBy) params.uploadedBy = uploadedBy;
  if (courseId && courseId !== 'All') params.courseId = courseId;
  if (search) params.search = search;
  if (sortBy) params.sortBy = sortBy;
  if (sort) params.sort = sort;
  if (page) params.page = page;
  if (limit) params.limit = limit;

  return await api.get('/materials', { params });
};

export const deleteMaterial = async (id) => {
  return await api.delete(`/materials/${id}`);
};

export default api;
