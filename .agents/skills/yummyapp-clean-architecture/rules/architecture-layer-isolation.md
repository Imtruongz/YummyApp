# Rule: Architecture Layer Isolation

**Áp dụng khi:** Thực hiện viết mã nguồn trong các phân lớp Domain, Data và Presentation.

---

## 🔒 Quy tắc Cô lập Phân lớp

Để đảm bảo hệ thống dễ bảo trì và kiểm thử độc lập, ta thực thi quy tắc ranh giới nhập khẩu (Import Boundaries) như sau:

```
[Presentation Layer] ──> [Domain Layer] <── [Data Layer]
```

1. **Domain Layer (Cô lập tuyệt đối):**
   - KHÔNG được phép import bất kỳ thành phần nào từ lớp `data` hoặc `presentation`.
   - KHÔNG được import thư viện React, React Native hoặc Redux.
   - Chỉ chứa TypeScript types, interfaces và logic nghiệp vụ thuần túy.

2. **Data Layer (Triển khai giao diện):**
   - Được phép import từ lớp `domain` (để lấy interfaces và entities).
   - KHÔNG được phép import từ lớp `presentation` (UI/Redux).
   - Thực hiện việc chuyển đổi từ DTO/Model sang Domain Entity trước khi trả kết quả về.

3. **Presentation Layer (Hiển thị & Trạng thái):**
   - Được phép import từ lớp `domain` (để sử dụng entities) và sử dụng Repository thông qua Service Locator.
   - KHÔNG được import trực tiếp các file từ lớp `data` (như datasource hay repository impl cụ thể). Mọi tương tác dữ liệu phải thông qua Repository Interface ở lớp Domain.

---

## ❌ Ví dụ VI PHẠM:
*   ❌ Trong `domain/entities/user.ts` có import `useSelector` từ `react-redux`.
*   ❌ Trong `presentation/screens/LoginScreen.tsx` có import `AuthRemoteDatasource` từ lớp `data`.
*   ❌ Trong `data/repositories/auth_repository_impl.ts` có import component `Typography` để báo lỗi.
