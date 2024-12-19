import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

import {Categories} from './types';

export const categoriesAPI = createApi({
  reducerPath: 'categoriesAPI',
  baseQuery: fetchBaseQuery({baseUrl: 'https://www.themealdb.com/api'}),
  endpoints: build => ({
    getCategories: build.query<Categories[], void>({
      query: () => 'json/v1/1/categories.php',
    }),
  }),
});

export const {useGetCategoriesQuery} = categoriesAPI;
