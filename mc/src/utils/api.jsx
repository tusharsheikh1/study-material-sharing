import axios from 'axios';

// ✅ Automatically detect base URL depending on environment
const getBaseURL = () => {
  const hostname = window.location.hostname;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api'; // Local backend
  }

  // Default to production backend
  return 'https://study-material-backend-7lpw.onrender.com/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // ✅ Required for sending cookies or auth headers
  timeout: 30000, // 30 second timeout for slow connections
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add debugging for deployment
    console.log('API Request:', {
      url: config.url,
      baseURL: config.baseURL,
      method: config.method,
      hasToken: !!token
    });
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
    
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized! Redirecting to login...');
      localStorage.removeItem('token'); // Clear invalid token
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

// ✅ Posts API (using the configured api instance)
export const createPost = async (postData) => {
  return await api.post('/posts', postData);
};

export const getPosts = async () => {
  return await api.get('/posts');
};

export const getTrendingPosts = async () => {
  return await api.get('/posts/trending');
};

export const likePost = async (postId) => {
  return await api.put(`/posts/${postId}/like`);
};

export const commentOnPost = async (postId, content) => {
  return await api.post(`/posts/${postId}/comment`, { content });
};

export const sharePost = async (postId) => {
  return await api.put(`/posts/${postId}/share`);
};

export const deletePost = async (postId) => {
  return await api.delete(`/posts/${postId}`);
};

// ✅ Media upload API
export const uploadMedia = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return await api.post('/media/upload', formData, {
    headers: { 
      'Content-Type': 'multipart/form-data'
    },
  });
};

export default api;