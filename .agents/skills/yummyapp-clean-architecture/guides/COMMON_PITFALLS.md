# Common Pitfalls (Lỗi thường gặp)

Tài liệu này tổng hợp các lỗi phổ biến (Anti-patterns) mà nhà phát triển hoặc AI thường mắc phải khi làm việc với React Native Clean Architecture trong YummyApp, cùng cách sửa đổi chuẩn xác.

---

## ❌ Lỗi 1: Gọi API trực tiếp từ Component hoặc Custom Hook của UI

### Mô tả:
Viết mã `axios` hoặc `fetch` trực tiếp bên trong `useEffect` của màn hình hoặc component.

### Tại sao sai:
Vi phạm sự phân tách giữa các lớp (layer boundaries). Khi API endpoint thay đổi hoặc cần lưu cache, ta phải sửa đổi trực tiếp file giao diện, gây khó khăn cho việc viết unit test.

### 🛠️ Cách khắc phục:
Chuyển logic gọi API sang lớp Data Datasource, thông qua Repository và Redux Slice.

```typescript
// ❌ SAI
useEffect(() => {
  axios.get('/foods').then(res => setFoods(res.data));
}, []);

// ✅ ĐÚNG
// Gọi thông qua Redux action
useEffect(() => {
  dispatch(fetchFoods());
}, [dispatch]);
```

---

## ❌ Lỗi 2: Code cứng mã màu và kích thước style (Hardcoded Styling)

### Mô tả:
Sử dụng trực tiếp chuỗi HEX màu sắc (`#F59624`) hoặc số pixel cụ thể (`margin: 15`) trong `StyleSheet.create`.

### Tại sao sai:
Gây khó khăn cho việc đồng bộ giao diện, không thể triển khai Dark Mode hoặc thay đổi chủ đề app một cách tập trung.

### 🛠️ Cách khắc phục:
Sử dụng các token màu sắc từ `@/utils/color` và khoảng cách chuẩn từ `AppSpacing`.

```typescript
// ❌ SAI
const styles = StyleSheet.create({
  button: { backgroundColor: '#F59624', padding: 15 }
});

// ✅ ĐÚNG
import { colors } from '@/utils/color';
import { AppSpacing } from '@/shared/design-system';

const styles = StyleSheet.create({
  button: { 
    backgroundColor: colors.primary, 
    padding: AppSpacing.md 
  }
});
```

---

## ❌ Lỗi 3: Ném lỗi (`throw Error`) trong Repository thay vì trả về `Either`

### Mô tả:
Trong Repository implementation, sử dụng `throw error` khi gọi API thất bại.

### Tại sao sai:
Nếu UI hoặc Redux quên không bọc block `try-catch` tương ứng, ứng dụng sẽ bị crash đột ngột. `Either` được sinh ra để ép buộc xử lý cả 2 trường hợp thành công và thất bại ở mức compile-time.

### 🛠️ Cách khắc phục:
Luôn bọc catch và trả về `left(ErrorMapper.mapToFailure(error))`.

```typescript
// ❌ SAI
async getFoods() {
  const res = await datasource.getFoods();
  if (!res) throw new Error('Không có dữ liệu');
  return res;
}

// ✅ ĐÚNG
async getFoods(): Promise<Either<Failure, Food[]>> {
  try {
    const res = await this.datasource.getFoods();
    return right(res);
  } catch (error) {
    return left(ErrorMapper.mapToFailure(error));
  }
}
```

---

## ❌ Lỗi 4: Trộn lẫn dữ liệu API vào Context API thay vì dùng Redux

### Mô tả:
Sử dụng Context API để lưu thông tin giỏ hàng, danh sách yêu thích, lịch sử chat...

### Tại sao sai:
Context API không tối ưu cho việc cập nhật dữ liệu với tần suất cao (gây re-render toàn bộ app). Dữ liệu nghiệp vụ (API state) thuộc về Redux. Context API chỉ dùng cho các thiết lập giao diện chung như đổi ngôn ngữ (i18n), bật tắt dark/light theme, hoặc hiển thị loading overlay khẩn cấp.

### 🛠️ Cách khắc phục:
Di chuyển tất cả state nghiệp vụ có kết nối với server sang Redux Toolkit.
