import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

import {meal} from './types';

interface ListRecipes {
  meals: meal[];
}

export const recipesAPI = createApi({
  reducerPath: 'recipesAPI',
  baseQuery: fetchBaseQuery({baseUrl: 'https://www.themealdb.com/api'}),
  endpoints: build => ({
    getRecipes: build.query<ListRecipes, void>({
      query: () => 'json/v1/1/search.php?f=a',
    }),
  }),
});

export const { useGetRecipesQuery } = recipesAPI;
