---
description: Tạo mới một tính năng (feature) hoàn chỉnh trong YummyApp theo chuẩn Clean Architecture. Sinh code khung sườn gồm Domain entity, Repository interface, Remote Datasource, Repository Impl, Redux Slice, Screen và Component. Kích hoạt @yummyapp-architect agent.
---

# /create-feature - Tạo Tính Năng Mới cho YummyApp

$ARGUMENTS

---

## 🔴 Quy tắc Bắt buộc

1. **Dùng @yummyapp-architect agent** — KHÔNG dùng kiến thức chung chung
2. **Đọc toàn bộ skill files** trước khi sinh code (xem SKILL.md)
3. **Hỏi trước khi giả định** — Luôn xác nhận tên entity, endpoint API với người dùng
4. **Dùng templates** từ `skills/yummyapp-clean-architecture/templates/`

---

## Quy trình Thực hiện

### Bước 1: Khảo sát & Xác nhận thông tin

Hỏi người dùng (nếu chưa cung cấp đầy đủ):
```
Để tạo tính năng "[ARGUMENTS]", tôi cần xác nhận:

1. Tên entity chính (PascalCase)? Ví dụ: Category, FoodItem
2. Các thuộc tính cần có? (id, name, createdAt...)
3. Endpoint API tương ứng? Ví dụ: GET /categories
4. Có cần local storage (MMKV) không?
5. Scope: Chỉ Data Layer hay cả Presentation (Screen + UI)?
```

### Bước 2: Đọc Skill Files (Bắt buộc)

Dùng @yummyapp-architect và đọc:
- `skills/yummyapp-clean-architecture/SKILL.md`
- `skills/yummyapp-clean-architecture/guides/ARCHITECTURE.md`
- `skills/yummyapp-clean-architecture/guides/ERROR_HANDLING.md`
- `skills/yummyapp-clean-architecture/guides/REDUX.md`
- `skills/yummyapp-clean-architecture/guides/DESIGN_SYSTEM.md`

### Bước 3: Tạo cấu trúc thư mục

```bash
# Tạo cấu trúc thư mục chuẩn
mkdir -p src/features/[feature-name]/domain/entities
mkdir -p src/features/[feature-name]/domain/repositories
mkdir -p src/features/[feature-name]/data/datasources
mkdir -p src/features/[feature-name]/data/repositories
mkdir -p src/features/[feature-name]/data/models
mkdir -p src/features/[feature-name]/presentation/redux
mkdir -p src/features/[feature-name]/presentation/screens
mkdir -p src/features/[feature-name]/presentation/components
```

### Bước 4: Sinh code theo từng lớp

**Layer thứ tự ưu tiên (Bottom-up):**

| Thứ tự | File cần tạo | Template tham chiếu |
| :---: | :--- | :--- |
| 1 | `domain/entities/[entity].ts` | `feature-entity.ts.template` |
| 2 | `domain/repositories/[feature]_repository.ts` | `feature-repository.ts.template` |
| 3 | `data/datasources/[feature]_remote_datasource.ts` | `feature-datasource.ts.template` |
| 4 | `data/repositories/[feature]_repository_impl.ts` | `feature-repository-impl.ts.template` |
| 5 | `presentation/redux/[feature]_slice.ts` | `feature-redux-slice.ts.template` |
| 6 | `presentation/screens/[Feature]Screen.tsx` | `feature-screen.tsx.template` |
| 7 | `presentation/components/[Feature]Card.tsx` | `feature-component.tsx.template` |
| 8 | `index.ts` (Barrel export) | — |

### Bước 5: Báo cáo kết quả

Sau khi hoàn tất, báo cáo:
```
✅ Đã tạo tính năng "[feature-name]":

📂 Cấu trúc:
src/features/[feature-name]/
├── domain/entities/[entity].ts
├── domain/repositories/[feature]_repository.ts
├── data/datasources/[feature]_remote_datasource.ts
├── data/repositories/[feature]_repository_impl.ts
├── data/models/ (nếu có)
├── presentation/redux/[feature]_slice.ts
├── presentation/screens/[Feature]Screen.tsx
├── presentation/components/[Feature]Card.tsx
└── index.ts

⚠️ Các bước tiếp theo:
1. Đăng ký reducer vào src/core/redux/root-reducer.ts
2. Đăng ký Repository vào src/core/di/service-locator.ts
3. Thêm Screen vào React Navigation navigator
```

---

## Ví dụ sử dụng

```
/create-feature category
/create-feature food-detail
/create-feature user-profile
/create-feature notification
/create-feature order-history
```
