# Rule: Naming Conventions

**Áp dụng khi:** Tạo mới file, thư mục, component, hàm, biến hoặc kiểu dữ liệu TypeScript.

---

## 📋 Quy chuẩn Đặt tên

1. **Thư mục (Folders) và Tệp (Files):**
   - Phải sử dụng định dạng `kebab-case` (chữ thường ngăn cách bằng dấu gạch ngang).
   - Ví dụ: `food-detail/`, `food-repository-impl.ts`, `auth-slice.ts`.

2. **React Components:**
   - Phải sử dụng định dạng `PascalCase` (viết hoa chữ cái đầu của mỗi từ).
   - Ví dụ: `FoodDetailScreen.tsx`, `LoginForm.tsx`.

3. **Biến và Hàm:**
   - Phải sử dụng định dạng `camelCase`.
   - Ví dụ: `const foodList = []`, `function getFoodById() {}`.

4. **Hằng số (Constants):**
   - Phải sử dụng định dạng `UPPER_CASE` với dấu gạch dưới.
   - Ví dụ: `API_BASE_URL`, `MAX_RETRY_COUNT`.

5. **Giao diện Repository:**
   - Tên file/interface phải bắt đầu bằng ký tự `I` (viết hoa).
   - Ví dụ: `IAuthRepository`, `IFoodRepository`.

6. **Lớp Repository Implementation:**
   - Phải kết thúc bằng từ `Impl`.
   - Ví dụ: `AuthRepositoryImpl`, `FoodRepositoryImpl`.
