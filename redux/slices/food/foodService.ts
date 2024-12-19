import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {food} from './foodSlice';

export const foodAPI = createApi({
  reducerPath: 'foodAPI',
  baseQuery: fetchBaseQuery({baseUrl: 'https://www.themealdb.com/api'}),
  endpoints: build => ({
    getCategories: build.query<food[], void>({
      query: () => 'json/v1/1/categories.php',
    }),
    getFoodsByCategory: build.query({
      query: (category: string) => `json/v1/1/filter.php?c=${category}`,
    }),
    getFoodById: build.query({
      query: (id: string) => `json/v1/1/lookup.php?i=${id}`,
    }),
  }),
});

//export hooks
export const {useGetCategoriesQuery, useGetFoodsByCategoryQuery, useGetFoodByIdQuery} = foodAPI;
