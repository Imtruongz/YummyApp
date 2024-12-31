// use axios to get data from the api
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';


const Yummy_API: string = 'http://192.168.0.105:4040/api';

const api = axios.create({
  baseURL: Yummy_API,
});

//Lấy token từ AsyncStorage
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
