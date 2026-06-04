---
description: Refactor một tính năng cũ (từ src/pages/, src/api/, src/contexts/) sang chuẩn Clean Architecture trong YummyApp. Thực hiện an toàn từng bước, không làm gãy ứng dụng. Kích hoạt @yummyapp-architect agent.
---

# /refactor-feature - Refactor Tính Năng Sang Clean Architecture

$ARGUMENTS

---

## 🔴 Quy tắc Bắt buộc

1. **Dùng @yummyapp-architect agent** — KHÔNG refactor theo kiến trúc chung chung
2. **Đọc code cũ TRƯỚC** — Hiểu luồng xử lý hiện tại trước khi viết lại
3. **Refactor từng layer** — Không refactor toàn bộ một lúc, Bottom-up từ Domain lên Presentation
4. **KHÔNG xóa code cũ** cho đến khi code mới đã được xác nhận hoạt động

---

## Quy trình Thực hiện

### Bước 1: Khảo sát code cũ

Đọc và lập bản đồ hiện trạng của tính năng được yêu cầu:

```
📌 Kiểm tra các vị trí sau:
├── src/pages/[Feature]*.tsx          → Màn hình cũ
├── src/api/[feature]*.ts             → API calls cũ
├── src/redux/slices/[feature]/       → Redux state cũ
├── src/contexts/[Feature]Context.tsx → Context API cũ (nếu có)
├── src/types/[feature].d.ts          → TypeScript types cũ
└── src/hooks/use[Feature]*.ts        → Custom hooks cũ
```

Sau khi đọc xong, tóm tắt:
```
📊 Hiện trạng tính năng "[ARGUMENTS]":
- Màn hình: [file path]
- API endpoint(s): [list endpoints]
- State management: [Redux/Context/local state]
- Vấn đề kiến trúc: [liệt kê vi phạm]
```

### Bước 2: Đọc Skill & MIGRATION Guide (Bắt buộc)

Dùng @yummyapp-architect và đọc:
- `skills/yummyapp-clean-architecture/guides/MIGRATION.md` ← Đọc ĐẦU TIÊN
- `skills/yummyapp-clean-architecture/guides/ARCHITECTURE.md`
- `skills/yummyapp-clean-architecture/guides/ERROR_HANDLING.md`
- `skills/yummyapp-clean-architecture/guides/REDUX.md`

### Bước 3: Lập kế hoạch & Trình bày cho người dùng

Trình bày kế hoạch TRƯỚC KHI thực hiện:
```
📋 Kế hoạch Refactor "[ARGUMENTS]":

Phạm vi ảnh hưởng:
- Tạo mới: src/features/[feature-name]/ (X files)
- Cập nhật: src/core/redux/root-reducer.ts
- Cập nhật: src/core/di/service-locator.ts (nếu có)
- Giữ nguyên tạm thời: [old files] (xóa sau khi xác nhận)

Thứ tự thực hiện:
1. Domain Layer (entity + repository interface)
2. Data Layer (datasource + model + repository impl)
3. Presentation Layer (redux slice + screen + components)
4. Kết nối vào Navigator và Store
5. Xác nhận hoạt động → Xóa code cũ

Bắt đầu?
```

### Bước 4: Thực hiện từng bước (Bottom-up)

#### 4a. Domain Layer
```typescript
// Tạo mới:
src/features/[feature-name]/domain/entities/[entity].ts
src/features/[feature-name]/domain/repositories/[feature]_repository.ts
```
- Entity phải là TypeScript type thuần túy, KHÔNG import react-native/redux
- Repository Interface phải trả về `Either<Failure, T>` cho mọi method bất đồng bộ

#### 4b. Data Layer
```typescript
// Tạo mới:
src/features/[feature-name]/data/datasources/[feature]_remote_datasource.ts
src/features/[feature-name]/data/repositories/[feature]_repository_impl.ts
```
- Datasource: Copy logic gọi API từ code cũ, dùng `axiosInstance` từ `@/api/config`
- Repository Impl: Bọc trong `try-catch`, trả `right(data)` hoặc `left(ErrorMapper.mapToFailure(error))`

#### 4c. Presentation Layer
```typescript
// Tạo mới:
src/features/[feature-name]/presentation/redux/[feature]_slice.ts
src/features/[feature-name]/presentation/screens/[Feature]Screen.tsx
src/features/[feature-name]/presentation/components/[Feature]Card.tsx
```
- Slice: AsyncThunk gọi qua Repository, dùng `.fold()` xử lý kết quả
- Screen: `useDispatch` + `useSelector`, KHÔNG gọi API trực tiếp
- Dùng `<Typography />` và `colors.*` thay vì `<Text>` + hardcode

#### 4d. Kết nối vào App Core
- Đăng ký reducer mới vào `src/core/redux/root-reducer.ts`
- Đăng ký Repository vào `src/core/di/service-locator.ts`
- Cập nhật Navigator để trỏ đến Screen mới

### Bước 5: Xác minh và Dọn dẹp

Kiểm tra danh sách sau:
- [ ] Tính năng hoạt động trên màn hình mới
- [ ] Không có `axios` trực tiếp trong Screens/Components
- [ ] Không có HEX màu hardcode trong StyleSheet
- [ ] Redux state loading/error hiển thị đúng
- [ ] TypeScript không báo lỗi

Nếu tất cả ✅, thông báo để dọn dẹp code cũ:
```
✅ Refactor hoàn tất! Code mới hoạt động.

Sẵn sàng xóa code cũ:
- [ ] src/pages/[OldScreen].tsx
- [ ] src/api/[oldApi].ts (nếu chỉ dùng riêng cho feature này)

Xác nhận để xóa?
```

---

## Ví dụ sử dụng

```
/refactor-feature auth
/refactor-feature category
/refactor-feature food-detail
/refactor-feature home
/refactor-feature user-profile
/refactor-feature notification
```

---

## ⚠️ Cảnh báo Quan trọng

- **KHÔNG** refactor nhiều tính năng cùng một lúc
- **KHÔNG** xóa code cũ trước khi xác nhận code mới chạy được
- Nếu feature liên quan đến Authentication → đọc thêm ví dụ Auth trong `ARCHITECTURE.md`
