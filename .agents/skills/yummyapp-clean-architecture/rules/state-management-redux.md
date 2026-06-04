# Rule: State Management Redux

**Áp dụng khi:** Xây dựng Redux Slice, AsyncThunk, hoặc kết nối dữ liệu từ Screen/Component UI.

---

## 🎛️ Quy tắc Quản lý trạng thái

1. **AsyncThunk tích hợp Repository:**
   - Trong `createAsyncThunk`, gọi phương thức của Repository (lấy từ Service Locator).
   - Sử dụng `.fold()` để rẽ nhánh. Nếu lỗi, gọi `rejectWithValue(failure.message)`. Nếu thành công, trả về dữ liệu entity.

2. **Quản lý trạng thái Loading & Error đồng bộ:**
   - Mọi AsyncThunk phục vụ tải dữ liệu từ API phải có trạng thái tương ứng trong Slice State: `loading` (boolean) và `error` (string | null).
   - Xử lý các trạng thái trong `extraReducers`:
     - `pending`: Set `loading = true`, `error = null`.
     - `fulfilled`: Cập nhật dữ liệu, set `loading = false`.
     - `rejected`: Set `loading = false`, cập nhật `error = action.payload`.

3. **Cấm gọi API trực tiếp trong UI:**
   - Các màn hình chỉ lấy dữ liệu thông qua `useSelector` và kích hoạt hành động qua `useDispatch(action)`.

---

## ❌ Ví dụ VI PHẠM:
*   ❌ Viết AsyncThunk gọi trực tiếp API client: `apiClient.get('/foods')` thay vì dùng Repository.
*   ❌ Không xử lý trường hợp `rejected` của AsyncThunk trong extraReducers dẫn đến UI không biết khi có lỗi xảy ra.
