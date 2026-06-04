# Rule: Import Patterns

**Áp dụng khi:** Viết câu lệnh `import` và tạo file barrel exports (`index.ts`).

---

## 🔌 Quy tắc Imports

1. **Bắt buộc dùng Path Alias `@/*`:**
   - Sử dụng `@/*` làm đại diện cho `./src/*`.
   - Cấm sử dụng các đường dẫn tương đối dài (relative deep imports) như `../../../../`.
   - Ví dụ: 
     - ✅ `import { colors } from '@/utils/color';`
     - ❌ `import { colors } from '../../../utils/color';`

2. **Sử dụng Barrel Exports cho các Lớp (Layers) và Tính năng (Features):**
   - Mỗi thư mục feature phải có một file `index.ts` (ở feature root) xuất khẩu toàn bộ thực thể, repository, slice và screen dùng chung của tính năng đó.
   - Ví dụ:
     - ✅ `import { User, LoginScreen } from '@/features/authentication';`
     - ❌ `import { User } from '@/features/authentication/domain/entities/user';`
     - ❌ `import { LoginScreen } from '@/features/authentication/presentation/screens/LoginScreen';`

3. **Cấm import chéo giữa các tính năng (Cross-feature direct imports):**
   - Một screen của `feature A` không được phép import trực tiếp một component nội bộ hoặc hook nội bộ từ `feature B`.
   - Nếu cần sử dụng chung, component hoặc logic đó phải được chuyển ra ngoài thư mục `src/shared/`.
