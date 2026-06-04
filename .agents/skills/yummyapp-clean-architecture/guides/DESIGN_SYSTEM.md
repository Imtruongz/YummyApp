# YummyApp Design System Integration

Tài liệu này hướng dẫn cách sử dụng nhất quán hệ thống thiết kế (Design System) của YummyApp. Nghiêm cấm code cứng (hardcode) bất kỳ giá trị style nào (màu sắc, khoảng cách, kiểu chữ) trong phần Presentation (Screens/Components).

---

## 🎨 Hệ thống Màu sắc (Colors)

Tất cả màu sắc phải được import từ `@/utils/color` (hoặc `@/utils` thông qua barrel exports).

### Bảng màu hiện tại của YummyApp:
```typescript
import { colors } from '@/utils/color';

// Các màu chủ đạo:
colors.primary       // '#F59624' - Màu cam chính (Food/Appetite)
colors.primaryHover  // '#fc9c28' - Màu cam khi hover/active
colors.secondary     // '#f0ad4e' - Màu cam nhạt/phụ
colors.success       // '#5cb85c' - Màu xanh lá (Trạng thái thành công)
colors.danger        // '#d9534f' - Màu đỏ (Trạng thái lỗi/xóa)
colors.light         // '#ffffff' - Màu trắng chính
colors.dark          // '#333333' - Màu tối/chữ chính
colors.loadingColor  // '#FB9400' - Màu cho loading indicator

// Màu chữ & nền:
colors.primaryText   // '#0F172A' - Màu chữ chính (Slate 900)
colors.smallText     // '#A9A9A9' - Màu chữ phụ/nhỏ
colors.InputBg       // '#ebe8e8' - Màu nền của TextInput
colors.gray          // '#E1E1E1' - Màu viền/nền phụ
colors.white         // '#FFFFFF' - Màu trắng
```

---

## 📐 Khoảng cách & Bố cục (Spacing)

Sử dụng lưới khoảng cách 8pt làm tiêu chuẩn công nghiệp (tương thích với iOS Human Interface Guidelines và Material Design):

```typescript
export const AppSpacing = {
  xs: 4,   // Khoảng cách cực nhỏ (padding trong nút, icon nhỏ)
  sm: 8,   // Khoảng cách nhỏ (khoảng cách giữa icon và chữ)
  md: 16,  // Khoảng cách trung bình (padding của màn hình, khoảng cách giữa các thẻ)
  lg: 24,  // Khoảng cách lớn (khoảng cách giữa các section)
  xl: 32,  // Khoảng cách cực lớn
};
```

---

## 🔤 Kiểu chữ (Typography)

YummyApp sử dụng font **Poppins** làm font chính (theo mô hình của Airbnb và Uber Eats). Bắt buộc sử dụng component dùng chung `<Typography />` từ `@/components/Typography` để hiển thị văn bản thay vì sử dụng thẻ `<Text />` thuần với style thủ công.

### Component Typography Props:
```typescript
interface Props {
  title: string | number;
  style?: object;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  
  // Custom Styles
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;

  // Sử dụng Preset được định nghĩa sẵn
  preset?: keyof typeof TYPOGRAPHY_PRESETS;
  appStyle?: keyof typeof APP_TYPOGRAPHY;
}
```

### Các Preset chữ phổ biến:
*   `preset="DISPLAY_LARGE"`: Chữ tiêu đề lớn nhất (Giới thiệu/Splash).
*   `preset="HEADLINE_LARGE"`: Tiêu đề màn hình chính.
*   `preset="BODY_LARGE"`: Nội dung chính của bài viết/mô tả.
*   `preset="BODY_SMALL"`: Chữ phụ, ghi chú.

---

## 💻 Ví dụ Triển khai (Code Examples)

### ❌ SAI - Code cứng giá trị CSS:
```tsx
import { View, Text } from 'react-native';

export function FoodCard() {
  return (
    <View style={{ padding: 15, backgroundColor: '#ffffff', borderRadius: 10 }}>
      <Text style={{ fontSize: 18, color: '#0F172A', fontWeight: 'bold' }}>
        Pizza Hải Sản
      </Text>
      <Text style={{ fontSize: 14, color: '#A9A9A9', marginTop: 5 }}>
        Hải sản tươi ngon mỗi ngày
      </Text>
    </View>
  );
}
```

### ✅ ĐÚNG - Sử dụng Design System Tokens & Typography Component:
```tsx
import { View, StyleSheet } from 'react-native';
import { colors } from '@/utils/color';
import { Typography } from '@/components/Typography';
import { AppSpacing } from '@/shared/design-system'; // Hoặc định nghĩa tokens dùng chung

export function FoodCard() {
  return (
    <View style={styles.card}>
      <Typography 
        title="Pizza Hải Sản" 
        appStyle="FOOD_NAME" 
        color={colors.primaryText} 
      />
      <Typography 
        title="Hải sản tươi ngon mỗi ngày" 
        appStyle="FOOD_DESCRIPTION" 
        color={colors.smallText} 
        style={styles.description}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16, // tương đương AppSpacing.md
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  description: {
    marginTop: 8, // tương đương AppSpacing.sm
  },
});
```
