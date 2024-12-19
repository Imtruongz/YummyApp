// get categories from the api
import api from '../api/api';

const getCategories = async () => {
  try {
    const response = await api.get('/json/v1/1/categories.php');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export default getCategories;
