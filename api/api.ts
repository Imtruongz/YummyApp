// use axios to get data from the api
import axios from 'axios';

import dotenv from 'dotenv';
dotenv.config();

const Yummy_API: string = process.env.API_URL || 'http://localhost:4040/api';

const api = axios.create({
  baseURL: Yummy_API,
});

export default api;
