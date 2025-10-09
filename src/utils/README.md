# YummyApp Utilities

## regexPatterns.ts

Tập hợp các biểu thức chính quy (regex) và các hàm tiện ích xử lý chuỗi được sử dụng trong toàn bộ ứng dụng YummyApp.

### Mục đích

- Tập trung tất cả các mẫu regex vào một nơi để dễ bảo trì và đồng nhất
- Cung cấp các hàm tiện ích để kiểm tra, định dạng và xử lý chuỗi
- Giảm lặp code và tăng khả năng tái sử dụng
- Dễ dàng cập nhật các quy tắc kiểm tra đầu vào

### Các pattern và hàm chính

#### Kiểm tra đầu vào

- `isValidEmail(email)`: Kiểm tra email hợp lệ
- `isValidPassword(password)`: Kiểm tra mật khẩu cơ bản (6+ ký tự)
- `isStrongPassword(password)`: Kiểm tra mật khẩu mạnh (chữ hoa, thường, số, ký tự đặc biệt)
- `isValidVNPhone(phone)`: Kiểm tra số điện thoại Việt Nam
- `isValidDateDMY(date)`: Kiểm tra định dạng ngày DD/MM/YYYY
- `isValidDateISO(date)`: Kiểm tra định dạng ngày ISO YYYY-MM-DD

#### Định dạng số và tiền tệ

- `formatNumberWithCommas(number)`: Định dạng số có dấu phẩy phân cách hàng nghìn
- `formatUSDCurrency(amount)`: Định dạng tiền USD (thêm $ ở đầu)
- `formatVNDCurrency(amount)`: Định dạng tiền VNĐ (thêm đ ở cuối)
- `extractNumbersOnly(input)`: Chỉ giữ lại số từ chuỗi đầu vào

#### Xử lý chuỗi tìm kiếm

- `normalizeSpaces(input)`: Xử lý khoảng trắng thừa
- `cleanSearchQuery(query)`: Làm sạch chuỗi tìm kiếm
- `normalizeSearchText(text)`: Chuẩn hóa chuỗi tìm kiếm và chuyển về chữ thường
- `containsTextCaseInsensitive(source, search)`: Kiểm tra chuỗi có chứa chuỗi khác không, không phân biệt hoa thường

### Cách sử dụng

```typescript
// Import các hàm cần dùng
import { 
  isValidEmail, 
  formatUSDCurrency,
  containsTextCaseInsensitive
} from './utils/regexPatterns';

// Kiểm tra email
if (isValidEmail(userEmail)) {
  // Email hợp lệ
}

// Định dạng tiền
const formattedAmount = formatUSDCurrency(1000); // "$1,000"

// Tìm kiếm không phân biệt hoa thường
const filteredItems = items.filter(item => 
  containsTextCaseInsensitive(item.name, searchQuery)
);
```

### Thêm mới regex patterns

Khi cần thêm mới một biểu thức chính quy hoặc hàm tiện ích:

1. Thêm biểu thức với comment mô tả rõ ràng vào `regexPatterns.ts`
2. Viết các hàm tiện ích đi kèm nếu cần
3. Đảm bảo có ví dụ về các trường hợp hợp lệ/không hợp lệ trong phần comment

Luôn sử dụng các hàm từ `regexPatterns.ts` thay vì viết lại các biểu thức chính quy mới trong các file khác.

## formatDate.ts

Các hàm tiện ích để định dạng ngày tháng theo nhiều locale khác nhau.

### Các hàm chính

- `formatDate(dateString, locale)`: Định dạng ngày (DD/MM/YYYY)
- `formatDateTime(dateString, locale)`: Định dạng ngày và giờ (DD/MM/YYYY HH:MM)
- `parseDateDMY(dateString)`: Phân tích chuỗi ngày DD/MM/YYYY thành Date object