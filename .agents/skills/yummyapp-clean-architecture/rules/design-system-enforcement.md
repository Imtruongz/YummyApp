# Rule: Design System Enforcement

**Áp dụng khi:** Xây dựng màn hình (Screens), Components, hoặc viết style trong lớp Presentation.

---

## 🎨 Quy tắc áp dụng Design System

1. **Tuyệt đối không dùng mã màu HEX cứng:**
   - Cấm sử dụng `#F59624`, `#FFFFFF`, `#333`... trực tiếp trong Style.
   - Bắt buộc import và sử dụng hằng số `colors` từ `@/utils/color`.
   - Ví dụ: `backgroundColor: colors.primary` thay vì `backgroundColor: '#F59624'`.

2. **Áp dụng khoảng cách chuẩn (8pt Grid):**
   - Không sử dụng các giá trị padding, margin ngẫu nhiên (ví dụ: `margin: 13`).
   - Phải sử dụng các giá trị thuộc lưới 8pt hoặc hằng số `AppSpacing` (xs: 4, sm: 8, md: 16, lg: 24, xl: 32).

3. **Bắt buộc dùng `<Typography />`:**
   - Không được dùng thẻ `<Text />` của React Native cùng các thuộc tính style chữ thủ công (`fontSize`, `fontFamily`).
   - Phải dùng component `<Typography />` từ `@/components/Typography` cùng các `preset` hoặc `appStyle` định nghĩa sẵn trong hệ thống font Poppins.
   - Ví dụ: `<Typography title="Xin chào" appStyle="WELCOME_TITLE" />`

---

## ❌ Ví dụ VI PHẠM:
*   ❌ `<View style={{ padding: 12, backgroundColor: '#FFF' }}>` (Vi phạm padding và màu nền).
*   ❌ `<Text style={{ fontFamily: 'Poppins-Bold', fontSize: 18 }}>Tiêu đề</Text>` (Vi phạm Typography component).
