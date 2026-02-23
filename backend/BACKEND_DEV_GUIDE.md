# HouPlatform Backend Developer Guide

## 1. Công nghệ sử dụng

- Node.js, Express
- MongoDB (Mongoose ODM)
- JWT cho xác thực
- Bcrypt cho mã hóa mật khẩu

## 2. Cấu trúc thư mục

- `controllers/`: Xử lý logic cho các endpoint
- `models/`: Định nghĩa schema MongoDB
- `routes/`: Định nghĩa các route API
- `middleware/`: Chứa các middleware (ví dụ: xác thực JWT)
- `.env`: Biến môi trường (MongoDB URI, JWT secret, ...)

## 3. User Model

```js
name: String (có thể trùng)
age: Number
phone: String (unique, không được trùng)
email: String (unique, không được trùng)
password: String (hashed)
roles: [String] (mặc định: ['user'])
```

## 4. Các endpoint chính

### Đăng ký

- `POST /api/auth/register`
- Body: `{ name, age, phone, email, password }`
- Email và phone phải unique

### Đăng nhập

- `POST /api/auth/login`
- Body: `{ email, password }`
- Trả về: `{ data: { accessToken, user } }`

### Lấy profile

- `GET /api/auth/profile`
- Header: `Authorization: Bearer <accessToken>`
- Trả về: `{ data: user }`

### Cập nhật profile

- `PATCH /api/auth/profile`
- Header: `Authorization: Bearer <accessToken>`
- Body: `{ name?, age?, phone? }`
- Phone phải unique, email không thể sửa

## 5. Middleware xác thực

- File: `middleware/auth.js`
- Kiểm tra JWT, truy vấn user từ DB, gán vào `req.user`

## 6. Lưu ý khi phát triển

- Luôn kiểm tra biến môi trường trong `.env` (đặc biệt là `JWT_SECRET` và `MONGODB_URI`)
- Khi xóa collection trong MongoDB Compass, backend sẽ tự tạo lại collection và index khi đăng ký user mới
- Nếu gặp lỗi duplicate key, kiểm tra lại giá trị email/phone
- Khi push code, kiểm tra kỹ các thay đổi liên quan đến schema và middleware

## 7. Khởi động backend

```sh
npm install
npm run dev
```

## 8. Liên hệ

- Nếu gặp lỗi hoặc cần hỗ trợ, liên hệ team backend hoặc đọc thêm trong README.md
