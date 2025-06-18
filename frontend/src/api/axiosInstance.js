import axios from "axios";
 
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Attach token to every request
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `JWT ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Handle 401 Unauthorized globally
axiosInstance.interceptors.response.use(
  res => res,
  error => {
    if (error.response?.status === 401) {
      console.log("Unauthorized! Token expired or invalid.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;