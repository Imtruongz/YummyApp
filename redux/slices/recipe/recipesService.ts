import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

import {recipes} from './types';

interface ListRecipes {
  recipes: recipes[];
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
