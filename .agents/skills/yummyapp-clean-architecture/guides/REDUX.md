# Redux State Management in Clean Architecture

Tài liệu này hướng dẫn cách tổ chức và quản lý trạng thái ứng dụng (State Management) sử dụng **Redux Toolkit** kết hợp với mô hình **Clean Architecture** trong React Native.

---

## 🛠️ Nguyên tắc Cốt lõi

1. **Redux cho Server State:** Sử dụng Redux để lưu trữ dữ liệu tải từ API (danh sách món ăn, thông tin tài khoản, v.v.).
2. **React Hooks cho Local UI State:** Chỉ dùng `useState` / `useRef` cho trạng thái nội bộ màn hình (nhập liệu form, đóng/mở modal, trạng thái focus).
3. **Thunk gọi qua Repository:** Thunk KHÔNG gọi trực tiếp API client. Thunk gọi phương thức của Repository, xử lý kết quả thông qua hàm `fold` của `Either`.

---

## 📡 Tích hợp AsyncThunk và Repository

Khi thực hiện các tác vụ bất đồng bộ (tải dữ liệu, submit form), ta khởi tạo một `createAsyncThunk` và sử dụng `Either` để chuyển đổi trạng thái thành công hoặc thất bại về phía Redux Reducer.

### Ví dụ: Xây dựng Redux Slice cho tính năng Categories

```typescript
// src/features/category/presentation/redux/category_slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Category } from '../../domain/entities/category';
import { categoryRepository } from '@/core/di/service-locator'; // Dependency Injection

// 1. Định nghĩa Trạng thái (State Interface)
interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

// 2. Tạo AsyncThunk kết nối với Repository
export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (_, { rejectWithValue }) => {
    const result = await categoryRepository.getCategories();
    
    // Sử dụng fold để xử lý Either<Failure, Category[]>
    return result.fold(
      (failure) => rejectWithValue(failure.message), // Lỗi (Left)
      (categories) => categories,                    // Thành công (Right)
    );
  }
);

// 3. Khởi tạo Slice với extraReducers
export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
```

---

## 🔌 Sử dụng trong Component (Presentation Layer)

Sử dụng React Redux hooks (`useDispatch`, `useSelector`) để kết nối UI Screen với Redux State.

```tsx
// src/features/category/presentation/screens/CategoriesScreen.tsx
import React, { useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/core/redux/store';
import { fetchCategories } from '../redux/category_slice';
import { Typography } from '@/components/Typography';
import { colors } from '@/utils/color';

export function CategoriesScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector((state: RootState) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Typography title={`Đã xảy ra lỗi: ${error}`} color={colors.danger} />
      </View>
    );
  }

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ padding: 16 }}>
          <Typography title={item.name} preset="HEADLINE_MEDIUM" />
        </View>
      )}
    />
  );
}
```
