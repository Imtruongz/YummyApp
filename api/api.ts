// use axios to get data from the api
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://www.themealdb.com/api',
});

export default api;
