# Hướng dẫn Fix Facebook Login trên iOS

## ✅ Đã config xong:

### 1. Info.plist
- ✅ Đã thêm FacebookAppID, FacebookDisplayName, FacebookClientToken
- ✅ Đã config CFBundleURLTypes cho OAuth callback
- ✅ Đã thêm LSApplicationQueriesSchemes

### 2. AppDelegate.mm  
- ✅ Đã import đầy đủ headers (AuthenticationServices, SafariServices, FBSDKCoreKit-Swift)
- ✅ Đã initialize Facebook SDK
- ✅ Đã thêm openURL handler

## 📝 Bước tiếp theo:

### Bước 1: Lấy Facebook Client Token (TÙY CHỌN)
1. Vào https://developers.facebook.com/apps/1178286763959143
2. Settings → Advanced → Client Token
3. Copy và thay vào `Info.plist` tại dòng 62:
   ```xml
   <key>FacebookClientToken</key>
   <string>PASTE_YOUR_CLIENT_TOKEN_HERE</string>
   ```

**LƯU Ý**: Một số version SDK không yêu cầu Client Token, có thể bỏ qua nếu không tìm thấy.

### Bước 2: Reinstall Pods và Rebuild
```bash
cd ios
pod install
cd ..
```

### Bước 3: Clean Build và Run
```bash
# Clean build folders
rm -rf ios/build
rm -rf ios/Pods
cd ios && pod install && cd ..

# Rebuild iOS app
npx react-native run-ios
```

### Bước 4: Kiểm tra Bundle ID trên Facebook Developer
Đảm bảo Bundle ID của app khớp với Facebook Dashboard:
1. Xcode → Project → Targets → YummyApp → General → Bundle Identifier
2. Vào Facebook Developer → Settings → Add Platform → iOS
3. Nhập Bundle ID vào Facebook Dashboard

## 🐛 Troubleshooting:

### Nếu build bị lỗi "Undefined symbols for architecture x86_64"
Tạo file Swift trống để kích hoạt Swift runtime:
1. Xcode → File → New → File
2. Chọn Swift File
3. Tên file: `File.swift`
4. Khi hỏi "Create Bridging Header" → Chọn "Create"

### Nếu vẫn crash khi click Facebook Login
1. Check console log trong Xcode để xem lỗi cụ thể
2. Kiểm tra FacebookAppID có đúng không
3. Đảm bảo Bundle ID đã được thêm vào Facebook Developer Dashboard
4. Kiểm tra URL Scheme: `fb1178286763959143`

## 📚 Tài liệu tham khảo:
- [react-native-fbsdk-next GitHub](https://github.com/thebergamo/react-native-fbsdk-next)
- [Facebook iOS SDK - Getting Started](https://developers.facebook.com/docs/ios/use-cocoapods)
