import api from './config';

export const aiApi = {
  // Gợi ý công thức từ nguyên liệu
  suggestRecipe: async (ingredients: string[]) => {
    try {
      const response = await api.post('/ai/suggest-recipe', { ingredients });
      return response.data;
    } catch (error: any) {
      console.error('Error suggesting recipe:', error.message);
      throw error;
    }
  },

  // Hỏi đáp về nấu ăn
  askCookingQuestion: async (question: string) => {
    try {
      const response = await api.post('/ai/ask-question', { question });
      return response.data;
    } catch (error: any) {
      console.error('Error asking cooking question:', error.message);
      throw error;
    }
  },

  // Phân tích dinh dưỡng
  analyzeNutrition: async (recipeName: string, ingredients: string[]) => {
    try {
      const response = await api.post('/ai/analyze-nutrition', { 
        recipeName, 
        ingredients 
      });
      return response.data;
    } catch (error: any) {
      console.error('Error analyzing nutrition:', error.message);
      throw error;
    }
  }
};