# Refactoring Migration Guide (Hướng dẫn Chuyển đổi)

Tài liệu này cung cấp quy trình từng bước để refactor (tái cấu trúc) một tính năng cũ trong YummyApp (như Auth, Category, Food) sang cấu trúc Clean Architecture mới mà không gây ảnh hưởng tới các phần khác của hệ thống.

---

## 📈 Quy trình 7 Bước Refactor Module

### Bước 1: Khảo sát mã nguồn hiện tại
Xác định vị trí các tệp tin của tính năng trong cấu trúc cũ:
- Xem màn hình giao diện ở `src/pages/[Feature]Screen.tsx`.
- Xem logic gọi API ở `src/api/[feature]Api.ts`.
- Xem kiểu dữ liệu TypeScript ở `src/types/[feature].d.ts`.
- Xem quản lý state ở `src/redux/slices/[feature]/`.

---

### Bước 2: Khởi tạo cấu trúc thư mục mới
Tạo các thư mục layer tương ứng tại `src/features/[feature-name]/`:
```bash
mkdir -p src/features/[feature-name]/domain/entities
mkdir -p src/features/[feature-name]/domain/repositories
mkdir -p src/features/[feature-name]/data/datasources
mkdir -p src/features/[feature-name]/data/repositories
mkdir -p src/features/[feature-name]/data/models
mkdir -p src/features/[feature-name]/presentation/redux
mkdir -p src/features/[feature-name]/presentation/screens
mkdir -p src/features/[feature-name]/presentation/components
```

---

### Bước 3: Di chuyển và chuẩn hóa Lớp Domain
1. Định nghĩa thực thể nghiệp vụ (Entity) tại `domain/entities/[entity].ts`. Đây phải là kiểu dữ liệu TypeScript sạch, độc lập với backend.
2. Định nghĩa giao diện Repository (Interface) tại `domain/repositories/[feature]_repository.ts` mô tả các hành vi cần có (sử dụng kiểu trả về `Either<Failure, T>`).

---

### Bước 4: Chuyển dịch Lớp Data
1. Tạo Datasource tại `data/datasources/[feature]_remote_datasource.ts` để gọi API. Chuyển logic gọi API cũ từ `src/api/` vào đây.
2. Định nghĩa DTO/Model tại `data/models/[feature]_model.ts` để làm nhiệm vụ chuyển đổi định dạng (Mapper) từ dữ liệu API thô về Domain Entity.
3. Viết Repository Implementation tại `data/repositories/[feature]_repository_impl.ts` thực thi giao diện từ lớp Domain. Bọc logic gọi API trong khối `try-catch` và trả về `right` hoặc `left`.

---

### Bước 5: Viết lại Lớp Presentation & Redux
1. Cấu trúc lại Slice tại `presentation/redux/[feature]_slice.ts`. Định nghĩa AsyncThunk gọi qua Repository Instance (thông qua Service Locator).
2. Xử lý các trạng thái `pending`, `fulfilled`, và `rejected` trong extraReducers bằng cách trích xuất payload (thành công hoặc thông điệp lỗi).

---

### Bước 6: Cập nhật Màn hình & Components
1. Chuyển đổi mã màn hình sang `presentation/screens/[Feature]Screen.tsx`.
2. Thay thế việc dùng `Text` cứng bằng `<Typography />` và áp dụng màu sắc của Design System.
3. Thay thế gọi API trực tiếp bằng cách dispatch các action của Redux Slice mới.
4. Đăng ký Screen mới này vào hệ thống Router điều hướng của ứng dụng (`src/navigation/`).

---

### Bước 7: Dọn dẹp mã nguồn cũ
Sau khi kiểm tra thủ công tính năng hoạt động ổn định trên màn hình mới:
1. Xóa bỏ các file màn hình cũ trong `src/pages/`.
2. Xóa bỏ các file API cũ trong `src/api/`.
3. Xóa các Context API hoặc Redux Slices cũ liên quan.
