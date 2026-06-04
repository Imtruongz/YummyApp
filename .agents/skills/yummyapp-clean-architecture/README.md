# 🍽️ YummyApp Clean Architecture Skill

Chào mừng! Skill này giúp bạn xây dựng các tính năng cho YummyApp một cách chính xác theo mô hình Clean Architecture.

---

## ✨ Các tính năng cung cấp

- 📐 **Clean Architecture** - Phân lớp Domain/Data/Presentation nghiêm ngặt
- 🔐 **Redux Toolkit** - Quản lý trạng thái tập trung thông qua AsyncThunk
- ⚠️ **Either Pattern** - Xử lý lỗi functional type-safe
- 🎨 **Design System** - Đồng bộ hóa màu sắc, khoảng cách, kiểu chữ
- 📋 **Templates** - Các code templates khung mẫu sẵn sàng copy-paste
- 📚 **Guides** - Tài liệu hướng dẫn chi tiết và ví dụ thực tế

---

## 🚀 Bắt đầu nhanh (5 phút)

### Bước 1: Đọc tài liệu Kiến trúc & Quy chuẩn
1. [ARCHITECTURE.md](guides/ARCHITECTURE.md) - Hiểu rõ 3 lớp phân tách
2. [ERROR_HANDLING.md](guides/ERROR_HANDLING.md) - Học cách áp dụng Either pattern
3. [DESIGN_SYSTEM.md](guides/DESIGN_SYSTEM.md) - Áp dụng các token thiết kế chuẩn
4. [REDUX.md](guides/REDUX.md) - Thiết lập Redux slice và action

### Bước 2: Sử dụng Code Templates
Thư mục [templates](templates/) có sẵn các mẫu code chuẩn để copy:
- `feature-entity.ts.template`
- `feature-datasource.ts.template`
- `feature-repository.ts.template`
- `feature-redux-slice.ts.template`
- `feature-screen.tsx.template`
- `feature-component.tsx.template`

### Bước 3: Tổ chức thư mục tính năng
Tạo thư mục tính năng của bạn tại `src/features/[feature-name]/` tuân thủ:
```
src/features/[feature-name]/
├── domain/
│   ├── entities/
│   └── repositories/
├── data/
│   ├── datasources/
│   ├── repositories/
│   └── models/
└── presentation/
    ├── redux/
    ├── screens/
    └── components/
```

---

## 📖 Chỉ mục Hướng dẫn (Guide Index)

| Tài liệu | Mục đích | Thời điểm đọc |
| :--- | :--- | :--- |
| **[ARCHITECTURE.md](guides/ARCHITECTURE.md)** | Cấu trúc lớp & Flow dữ liệu | Đọc đầu tiên - hiểu luồng kiến trúc |
| **[ERROR_HANDLING.md](guides/ERROR_HANDLING.md)** | Cú pháp Either & Các loại Failures | Khi làm việc với Data Layer & Repositories |
| **[DESIGN_SYSTEM.md](guides/DESIGN_SYSTEM.md)** | Token màu sắc, spacing, typography | Khi thiết kế giao diện (Presentation) |
| **[CONVENTIONS.md](guides/CONVENTIONS.md)** | Quy chuẩn TypeScript, Import, Naming | Trước khi viết dòng code đầu tiên |
| **[REDUX.md](guides/REDUX.md)** | AsyncThunk & Slice setup | Khi kết nối Repository lên UI |
| **[COMMON_PITFALLS.md](guides/COMMON_PITFALLS.md)** | Các lỗi phổ biến và cách tránh | Khi tối ưu & review code |
| **[MIGRATION.md](guides/MIGRATION.md)** | Hướng dẫn refactor tính năng cũ | Khi tiến hành nâng cấp mã nguồn cũ |

---

## 🎯 Cây Quyết định (Decision Tree)

**Bạn đang muốn xây dựng gì?**

```
├─ Tạo mới một Tính năng (Ví dụ: Categories)
│   └─ Đọc ARCHITECTURE.md
│      1. Tạo cấu trúc thư mục mới trong src/features/
│      2. Copy file domain entity & repository template
│      3. Copy data remote datasource & repository impl template
│      4. Copy redux slice template
│      5. Copy screen & component template
│
├─ Chỉ tạo Screen/Component
│   └─ Copy từ templates/
│      Áp dụng DESIGN_SYSTEM.md (màu sắc, spacing, Typography)
│
├─ Tích hợp API mới
│   └─ Đọc ERROR_HANDLING.md & REDUX.md
│      1. Viết API call trong remote datasource
│      2. Map dữ liệu thô sang entity ở Repository Impl
│      3. Viết AsyncThunk với fold xử lý Either
│
└─ Refactor mã nguồn cũ
    └─ Đọc MIGRATION.md & COMMON_PITFALLS.md
       Kiểm tra và loại bỏ: Gọi API trong UI, hardcode style, throw lỗi trực tiếp...
```

---

## 📋 Trạng thái Skill (Skill Status)

**Version:** `1.0.0` (Tier 2/3 - Production Ready)

**Đã hoàn thành:**
- ✅ **SKILL.md** (Cấu hình AI chính)
- ✅ **ARCHITECTURE.md** (Quy chuẩn 3 lớp + 5 ví dụ)
- ✅ **ERROR_HANDLING.md** (Either pattern, ErrorMapper, Failures)
- ✅ **DESIGN_SYSTEM.md** (Centralized Yummy colors, Poppins presets, spacing)
- ✅ **REDUX.md** (AsyncThunk + slice integration)
- ✅ **CONVENTIONS.md** (Naming rules, path aliases, barrel index.ts)
- ✅ **COMMON_PITFALLS.md** (Anti-patterns)
- ✅ **MIGRATION.md** (7 steps refactoring)
- ✅ **10+ Code templates** (Entity, Repo, Datasource, Slice, Screen, Component, README)
- ✅ **Quy tắc AI biên dịch** (7 files quy tắc ngắn trong `rules/`)

---

## 📁 Cấu trúc thư mục Custom Skill

```
yummyapp-clean-architecture/
├── SKILL.md                          ← Tệp cấu hình AI chính
├── README.md                         ← Tệp này
│
├── guides/                           ← Tài liệu hướng dẫn chi tiết
│   ├── ARCHITECTURE.md
│   ├── ERROR_HANDLING.md
│   ├── DESIGN_SYSTEM.md
│   ├── REDUX.md
│   ├── CONVENTIONS.md
│   ├── COMMON_PITFALLS.md
│   └── MIGRATION.md
│
├── rules/                            ← Tập quy tắc kiểm tra nhanh của AI
│   ├── architecture-folder-structure.md
│   ├── architecture-layer-isolation.md
│   ├── design-system-enforcement.md
│   ├── error-handling-either-pattern.md
│   ├── state-management-redux.md
│   ├── naming-conventions.md
│   └── import-patterns.md
│
└── templates/                        ← Các code skeleton mẫu
    ├── feature-entity.ts.template
    ├── feature-repository.ts.template
    ├── feature-datasource.ts.template
    ├── feature-repository-impl.ts.template
    ├── feature-redux-slice.ts.template
    ├── feature-screen.tsx.template
    ├── feature-component.tsx.template
    └── README.md
```
