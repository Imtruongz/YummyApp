import axios from 'axios';
import { getStorageString } from '../utils/mmkvStorage';

// const API_URL = `https://yummyserver-production.up.railway.app/api`;
const API_URL = `http://10.100.13.108:4040/api`;

// Tạo instance Axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getStorageString('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance; 