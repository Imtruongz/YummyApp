# YummyApp Code Templates

Thư mục này chứa các file khung mẫu (Skeleton Templates) chuẩn hóa theo mô hình React Native Clean Architecture. Bạn hoặc AI Agent có thể nhân bản chúng để xây dựng nhanh các tính năng mới.

---

## 📋 Danh sách Templates

| Template File | Vị trí đặt sau khi sao chép | Vai trò |
| :--- | :--- | :--- |
| `feature-entity.ts.template` | `domain/entities/[entity-name].ts` | Thực thể nghiệp vụ |
| `feature-repository.ts.template` | `domain/repositories/[feature-name]_repository.ts` | Giao diện repository |
| `feature-datasource.ts.template` | `data/datasources/[feature-name]_remote_datasource.ts` | Gọi API với Axios client |
| `feature-repository-impl.ts.template` | `data/repositories/[feature-name]_repository_impl.ts` | Triển khai repository, mapper |
| `feature-redux-slice.ts.template` | `presentation/redux/[feature-name]_slice.ts` | Quản lý state bằng Redux Toolkit |
| `feature-screen.tsx.template` | `presentation/screens/[FeatureName]Screen.tsx` | Màn hình UI chính của tính năng |
| `feature-component.tsx.template` | `presentation/components/[FeatureName]Card.tsx` | Component UI con |

---

## 🔧 Cách sử dụng

Khi tạo mới một tính năng (ví dụ: `food`), thực hiện sao chép các tệp trên và thay thế các từ khóa giữ chỗ (Placeholders) tương ứng:

1. **`[FeatureName]`** / **`[featureName]`** / **`[feature-name]`**:
   - `[FeatureName]` (PascalCase): ví dụ: `Food`, `CategoryItem`.
   - `[featureName]` (camelCase): ví dụ: `food`, `categoryItem`.
   - `[feature-name]` (kebab-case): ví dụ: `food`, `category-item`.

2. **`[EntityName]`** / **`[entity-name]`**:
   - `[EntityName]` (PascalCase): ví dụ: `Food`, `Category`.
   - `[entity-name]` (kebab-case): ví dụ: `food`, `category`.

3. **`[endpoint-path]`**: Đường dẫn API endpoint của backend (ví dụ: `foods` hoặc `categories`).
