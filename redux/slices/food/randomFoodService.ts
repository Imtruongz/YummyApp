import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

import {randomFood} from './types';

export const randomFoodAPI = createApi({
  reducerPath: 'randomFoodAPI',
  baseQuery: fetchBaseQuery({baseUrl: 'https://www.themealdb.com/api'}),
  endpoints: build => ({
    getRandomFood: build.query<randomFood, void>({
      query: () => 'json/v1/1/search.php?f=a',
    }),
  }),
});

export const {useGetRandomFoodQuery} = randomFoodAPI;
