// use axios to get data from the api
import axios from 'axios';

//const theMealDB_API :string = 'https://www.themealdb.com/api';
const Yummy_API: string = 'http://localhost:4040/api';

const api = axios.create({
  baseURL: Yummy_API,
});

export default api;
