# Hướng dẫn sử dụng NotificationModal trong YummyApp

## Giới thiệu

`NotificationModal` là một component hiển thị thông báo dạng popup trong ứng dụng YummyApp. Component này được thiết kế để sử dụng trên toàn bộ ứng dụng thông qua NotificationContext.

## Các tính năng

- Hỗ trợ 4 loại thông báo: success, error, warning, info
- Hiệu ứng animation khi hiển thị và đóng
- Tự động đóng sau một khoảng thời gian (có thể tùy chỉnh)
- Hỗ trợ nút hành động tùy chọn
- Có thể đóng thông báo bằng nút đóng hoặc tự động

## Cách sử dụng

### 1. Sử dụng thông qua hook `useNotification`

```tsx
import { useNotification } from '../contexts/NotificationContext';

const YourComponent = () => {
  const { showNotification } = useNotification();
  
  const handleShowNotification = () => {
    showNotification({
      title: 'Thành công',
      message: 'Dữ liệu đã được lưu thành công!',
      type: 'success',
      duration: 3000, // Tự động đóng sau 3 giây
    });
  };
  
  return (
    <Button title="Hiện thông báo" onPress={handleShowNotification} />
  );
};
```

### 2. Các loại thông báo

#### Thông báo thành công:

```tsx
showNotification({
  title: 'Thành công',
  message: 'Dữ liệu đã được lưu thành công!',
  type: 'success',
});
```

#### Thông báo lỗi:

```tsx
showNotification({
  title: 'Lỗi',
  message: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.',
  type: 'error',
  duration: 0, // Không tự động đóng
  actionText: 'Thử lại',
  onAction: () => retryConnection(),
});
```

#### Thông báo cảnh báo:

```tsx
showNotification({
  title: 'Cảnh báo',
  message: 'Bạn chưa lưu thay đổi. Tất cả thay đổi sẽ bị mất.',
  type: 'warning',
  actionText: 'Lưu ngay',
  onAction: () => saveChanges(),
});
```

#### Thông báo thông tin:

```tsx
showNotification({
  title: 'Thông tin',
  message: 'Bạn có tin nhắn mới từ hệ thống.',
  type: 'info',
});
```

### 3. Tùy chọn

| Tùy chọn | Kiểu dữ liệu | Mặc định | Mô tả |
|----------|--------------|----------|-------|
| title | string | (bắt buộc) | Tiêu đề thông báo |
| message | string | (bắt buộc) | Nội dung thông báo |
| type | 'success' \| 'error' \| 'warning' \| 'info' | 'info' | Loại thông báo, ảnh hưởng đến màu sắc và biểu tượng |
| duration | number | 3000 | Thời gian tự động đóng (ms). Đặt 0 để không tự động đóng |
| actionText | string | undefined | Văn bản hiển thị trên nút hành động. Chỉ hiển thị nút khi có actionText |
| onAction | function | undefined | Hàm được gọi khi người dùng nhấn vào nút hành động |
| showCloseButton | boolean | true | Hiển thị nút đóng ở góc trên bên phải |

## Tạo thông báo toàn cục

Bạn có thể tạo hàm helper để dễ dàng sử dụng thông báo:

```tsx
// src/utils/notifications.ts
import { store } from '../redux/store';

// Lưu ý: Đây là ví dụ và cần được điều chỉnh phù hợp với cấu trúc dự án thực tế

export const showSuccessNotification = (message: string) => {
  // Phương thức này sẽ được triển khai sau khi tích hợp với Redux
  // Ví dụ: store.dispatch(showNotification({ type: 'success', message }));
};

export const showErrorNotification = (message: string) => {
  // Tương tự như trên
};

// Và các hàm khác...
```

## Ví dụ trong thực tế

### Trong màn hình đăng nhập:

```tsx
const handleLogin = async () => {
  try {
    await loginApi(username, password);
    showNotification({
      title: 'Đăng nhập thành công',
      message: 'Chào mừng bạn quay trở lại!',
      type: 'success',
      duration: 2000,
    });
    navigation.navigate('Home');
  } catch (error) {
    showNotification({
      title: 'Đăng nhập thất bại',
      message: error.message || 'Vui lòng kiểm tra lại thông tin đăng nhập',
      type: 'error',
    });
  }
};
```

### Trong màn hình thêm món ăn:

```tsx
const handleAddFood = async () => {
  try {
    await addFoodApi(foodData);
    showNotification({
      title: 'Thành công',
      message: 'Món ăn đã được thêm vào danh sách!',
      type: 'success',
    });
    resetForm();
  } catch (error) {
    showNotification({
      title: 'Lỗi',
      message: 'Không thể thêm món ăn. Vui lòng thử lại sau.',
      type: 'error',
      actionText: 'Thử lại',
      onAction: handleAddFood,
    });
  }
};
```

## Lưu ý

- Chỉ hiển thị một thông báo tại một thời điểm
- Thông báo sẽ hiển thị trên cùng của màn hình
- Đảm bảo thông báo không cản trở các tương tác quan trọng của người dùng
- Sử dụng ngôn ngữ rõ ràng, ngắn gọn trong thông báo