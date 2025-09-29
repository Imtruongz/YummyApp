import axios from 'axios';
import { setupAxiosInterceptor } from '../utils/crashlytics';
import { MMKV } from 'react-native-mmkv';


const API_HOME = process.env.HOME
// const API_URL = `https://yummyserver.onrender.com/api`;
const API_URL = `http://192.168.0.104:4040/api`;

// Tạo instance Axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Thêm storage để lưu token
const storage = new MMKV();

// Request interceptor để thêm token vào mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = storage.getString('accessToken');
    console.log('Gửi request:', {
      url: `${config.baseURL || ''}${config.url || ''}`,
      method: config.method,
      token,
      headers: config.headers,
      data: config.data
    });
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Thiết lập interceptor Crashlytics cho Axios
setupAxiosInterceptor(axiosInstance);

export default axiosInstance; 