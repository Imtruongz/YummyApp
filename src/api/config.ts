import axios from 'axios';
import { setupAxiosInterceptor } from '../utils/crashlytics';
import { MMKV } from 'react-native-mmkv';


const API_EVOTEK = process.env.EVOTEK
const API_HOME = process.env.HOME
// Lấy API URL từ biến môi trường hoặc sử dụng giá trị mặc định
const API_URL = `http://${API_EVOTEK}:4040/api`;

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