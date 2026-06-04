# Rule: Architecture Folder Structure

**Áp dụng khi:** Tạo mới hoặc tái cấu trúc bất kỳ tính năng (feature) nào trong YummyApp.

---

## 📋 Quy tắc thư mục

Mỗi tính năng mới hoặc được refactor phải nằm trong thư mục `src/features/[feature-name]/` và có cấu trúc phân lớp nghiêm ngặt sau:

```
src/features/[feature-name]/
├── domain/
│   ├── entities/                     ← Các thực thể TypeScript thuần túy
│   └── repositories/                 ← Giao diện (Interface) repository
│
├── data/
│   ├── datasources/                  ← Các tệp tin gọi API (Remote/Local)
│   ├── repositories/                 ← Triển khai (Impl) của repository từ domain
│   └── models/                       ← DTO/Models phục vụ JSON serialization
│
└── presentation/
    ├── redux/                        ← Redux slice và AsyncThunks của tính năng
    ├── screens/                      ← Các màn hình React Native chính
    └── components/                   ← Các component UI dùng riêng cho tính năng này
```

---

## ❌ Các cấu trúc SAI (Vi phạm):
*   ❌ Tạo trực tiếp màn hình ngoài thư mục `src/pages/` cho tính năng mới.
*   ❌ Viết API calls trực tiếp trong `src/api/` hoặc trong component.
*   ❌ Gộp chung code data (API) và presentation (UI) vào một tệp tin duy nhất.
