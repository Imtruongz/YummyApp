import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import database from '@react-native-firebase/database';

interface food {
  id?: number;
  name?: string;
  description?: string;
  photoURL?: string;
}

interface publicFoodState {
  ListPublicFood: food[];
  loading?: boolean;
  error?: boolean;
}

const initialState: publicFoodState = {
  ListPublicFood: [],
  loading: false,
  error: false,
};

export const publicFoodAPI = createAsyncThunk<food[], void>(
  'publicFood/publicFoodAPI',
  async () => {
    try {
      const response = await database().ref('/publicFood/').once('value');
      const rawData = response.val(); // Dữ liệu gốc từ Firebase
      if (rawData) {
        return Object.values(rawData) as food[]; // Chuyển object sang array với kiểu food[]
      }
      return []; // Không có dữ liệu thì trả về mảng rỗng
    } catch (error) {
      console.log('Error getting public food', error);
      throw error; // Ném lỗi nếu xảy ra vấn đề
    }
  },
);

const publicFoodSlice = createSlice({
  name: 'publicFood',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(publicFoodAPI.pending, state => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(publicFoodAPI.fulfilled, (state, action) => {
      state.ListPublicFood = action.payload;
      state.loading = false;
      state.error = false;
    });
    builder.addCase(publicFoodAPI.rejected, state => {
      state.loading = false;
      state.error = true;
    });
  },
});

export const {} = publicFoodSlice.actions;

export default publicFoodSlice.reducer;
