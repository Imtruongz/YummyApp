import axios from 'axios';
import { getStorageString, setStorageString, deleteStorageKey } from '../utils/mmkvStorage';
import { API_BASE_URL, API_BASE_URL_DEV, API_BASE_URL_PROD, APP_ENV } from '@env';

// Resolve base URL from .env with sensible fallbacks
const CURRENT_ENV = APP_ENV || (typeof __DEV__ !== 'undefined' && __DEV__ ? 'development' : 'production');
const RESOLVED_BASE_URL =
  API_BASE_URL ||
  (CURRENT_ENV === 'development' ? API_BASE_URL_DEV : API_BASE_URL_PROD) ||
  // Android emulator fallback (host loopback)
  'http://10.0.2.2:4040/api';

// Tạo instance Axios
const axiosInstance = axios.create({
  baseURL: RESOLVED_BASE_URL,
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

// Response interceptor: auto refresh on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error?.response?.status;

    // Avoid infinite loop
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getStorageString('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        // Call refresh endpoint
        const res = await axios.post(
          `${RESOLVED_BASE_URL.replace(/\/$/, '')}/users/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const newAccessToken = res?.data?.accessToken;
        if (!newAccessToken) throw new Error('No access token returned');
        setStorageString('accessToken', newAccessToken);

        // Retry original request with new token
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (e) {
        // Refresh failed → cleanup tokens
        deleteStorageKey('accessToken');
        deleteStorageKey('refreshToken');
        deleteStorageKey('userId');
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);