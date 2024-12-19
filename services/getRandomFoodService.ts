import api from '../api/api';

const handleGetRandomFood = async () => {
  try {
    const response = await api.get('/json/v1/1/random.php');
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching random food');
  }
};

export default handleGetRandomFood;
