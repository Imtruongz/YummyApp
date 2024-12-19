import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

import {categories} from './types';

interface ListCategories {
  categories: categories[];
}

export const categoriesAPI = createApi({
  reducerPath: 'categoriesAPI',
  baseQuery: fetchBaseQuery({baseUrl: 'https://www.themealdb.com/api'}),
  endpoints: build => ({
    getCategories: build.query<ListCategories, void>({
      query: () => 'json/v1/1/categories.php',
    }),
  }),
});

export const {useGetCategoriesQuery} = categoriesAPI;
