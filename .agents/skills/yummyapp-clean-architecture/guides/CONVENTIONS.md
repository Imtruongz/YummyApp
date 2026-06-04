# Coding Conventions and Project Standards

Tài liệu này quy định các quy chuẩn lập trình, quy tắc đặt tên và cấu hình TypeScript bắt buộc áp dụng trong toàn bộ dự án YummyApp.

---

## 📂 Quy chuẩn Đặt tên (Naming Conventions)

Để giữ cho codebase sạch sẽ và dễ tìm kiếm, ta tuân thủ quy tắc đặt tên sau:

| Thành phần | Quy tắc đặt tên | Ví dụ |
| :--- | :--- | :--- |
| **Thư mục (Folders)** | `kebab-case` | `authentication`, `food-detail` |
| **Tệp (Files)** | `kebab-case` | `user-model.ts`, `category-screen.tsx` |
| **Component React** | `PascalCase` | `LoginScreen`, `CategoryItem` |
| **Biến & Hàm** | `camelCase` | `userInfo`, `fetchFoodList()` |
| **Hằng số (Constants)** | `UPPER_CASE` | `API_BASE_URL`, `TIMEOUT_MS` |
| **Redux Slices** | `camelCase` | `authSlice`, `categorySlice` |
| **TypeScript Types/Interfaces** | `PascalCase` | `User`, `ICategoryRepository` |

---

## ⚡ Cấu hình TypeScript Strict Mode

Mọi dòng code viết ra phải tuân thủ chế độ kiểm tra kiểu nghiêm ngặt (Strict Mode):
1. **Tuyệt đối KHÔNG sử dụng kiểu `any`:** Sử dụng `unknown` hoặc định nghĩa interface/type cụ thể khi nhận dữ liệu thô từ API.
2. **Luôn khai báo kiểu dữ liệu trả về cho hàm (Explicit Return Types):** Tất cả các hàm xuất khẩu (exported functions), hàm trong repository, datasource phải có kiểu trả về rõ ràng.
3. **Không bỏ qua lỗi type:** Cấm sử dụng các directive như `// @ts-ignore` trừ khi có lý do bất khả kháng được sự đồng ý của Tech Lead.

---

## 🔌 Import/Export & Path Aliases

Dự án sử dụng plugin `module-resolver` của Babel để rút ngắn đường dẫn import. 

### Path Aliases cấu hình trong `tsconfig.json` & `babel.config.js`:
- `@/*` ánh xạ tới `src/*`
- `@components` ánh xạ tới `src/components`
- `@redux` ánh xạ tới `src/redux`
- `@utils` ánh xạ tới `src/utils`

#### ❌ SAI - Sử dụng relative path sâu sắc:
```typescript
import { Typography } from '../../../../components/Typography';
import { colors } from '../../utils/color';
```

#### ✅ ĐÚNG - Sử dụng Path Alias:
```typescript
import { Typography } from '@/components/Typography';
import { colors } from '@/utils/color';
```

---

## 📦 Barrel Exports (Tệp xuất khẩu tập trung)

Để tránh tình trạng import lộn xộn các file nhỏ từ sâu bên trong các thư mục layer của một feature, ta tạo file `index.ts` ở feature level để làm đầu ra duy nhất cho feature đó.

### Ví dụ về Barrel Export của `authentication` feature:

```typescript
// src/features/authentication/index.ts

// Export domain (entities & repository interfaces)
export * from './domain/entities/user';
export * from './domain/repositories/auth_repository';

// Export data layer
export * from './data/repositories/auth_repository_impl';

// Export presentation layer (Screens, Components, Slice)
export * from './presentation/screens/LoginScreen';
export * from './presentation/redux/category_slice'; 
```

Khi sử dụng ở bên ngoài feature:
```typescript
// Chỉ import từ một đầu mối duy nhất
import { User, LoginScreen } from '@/features/authentication';
```
