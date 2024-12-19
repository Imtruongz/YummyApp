import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

import {randomFood} from './types';

export const randomFoodAPI = createApi({
  reducerPath: 'randomFoodAPI',
  baseQuery: fetchBaseQuery({baseUrl: 'https://www.themealdb.com/api'}),
  endpoints: build => ({
    getRandomFood: build.query<randomFood, void>({
      query: () => 'json/v1/1/random.php',
    }),
  }),
});

export const {useGetRandomFoodQuery} = randomFoodAPI;
