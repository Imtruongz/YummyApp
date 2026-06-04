# Rule: Error Handling Either Pattern

**Áp dụng khi:** Định nghĩa Repository Interface ở lớp Domain và triển khai Repository ở lớp Data.

---

## ⚠️ Quy tắc Xử lý lỗi

1. **Kiểu trả về của các phương thức Repository:**
   - Mọi phương thức bất đồng bộ (API call, đọc ghi DB) của Repository phải trả về kiểu dữ liệu dạng `Promise<Either<Failure, T>>`.
   - Trong đó:
     - `Failure` đại diện cho đối tượng lỗi chuẩn hóa của ứng dụng.
     - `T` đại diện cho kiểu dữ liệu thành công (Domain Entity).

2. **Cấm ném lỗi (`throw`):**
   - Trong Repository Implementation (Data Layer), cấm tuyệt đối việc sử dụng `throw` để ném lỗi ra ngoài.
   - Phải bọc toàn bộ khối logic trong `try-catch`, bắt lỗi và chuyển đổi thông qua `ErrorMapper.mapToFailure(error)`, sau đó trả về `left(failure)`.
   - Khi thành công, trả dữ liệu thông qua `right(data)`.

3. **Xử lý kết quả ở tầng trên (Redux/UI):**
   - Sử dụng hàm `.fold()` để rẽ nhánh xử lý dữ liệu.
   - Ví dụ:
     ```typescript
     result.fold(
       (failure) => handleFailure(failure), // Nhánh Left
       (data) => handleSuccess(data)        // Nhánh Right
     );
     ```

---

## ❌ Ví dụ VI PHẠM:
*   ❌ Giao diện Repository định nghĩa: `getFoods(): Promise<Food[]>`.
*   ❌ Triển khai Repository ném lỗi: `catch(e) { throw new Error('Lỗi tải food'); }`.
