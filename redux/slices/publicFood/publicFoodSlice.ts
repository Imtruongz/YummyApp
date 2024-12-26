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
  isloadingPublicFood?: boolean;
  isErrorPublicFood?: boolean;
}

const initialState: publicFoodState = {
  ListPublicFood: [],
  isloadingPublicFood: false,
  isErrorPublicFood: false,
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
    } catch (isErrorPublicFood) {
      console.log('isErrorPublicFood getting public food', isErrorPublicFood);
      throw isErrorPublicFood; // Ném lỗi nếu xảy ra vấn đề
    }
  },
);

const publicFoodSlice = createSlice({
  name: 'publicFood',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(publicFoodAPI.pending, state => {
      state.isloadingPublicFood = true;
      state.isErrorPublicFood = false;
    });
    builder.addCase(publicFoodAPI.fulfilled, (state, action) => {
      state.ListPublicFood = action.payload;
      state.isloadingPublicFood = false;
      state.isErrorPublicFood = false;
    });
    builder.addCase(publicFoodAPI.rejected, state => {
      state.isloadingPublicFood = false;
      state.isErrorPublicFood = true;
    });
  },
});

export const {} = publicFoodSlice.actions;

export default publicFoodSlice.reducer;
