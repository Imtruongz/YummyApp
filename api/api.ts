// use axios to get data from the api
import axios, {AxiosInstance} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Yummy_API: string = 'http://192.168.0.103:4040/api';

// const api = axios.create({
//   baseURL: Yummy_API,
// });

class Http {
  instance:  AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: Yummy_API,
    });
  }
}

const api = new Http().instance;

//Lấy token từ AsyncStorage
api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

//192.168.0.103
//10.100.13.24
