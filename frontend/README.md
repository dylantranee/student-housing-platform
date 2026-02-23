# HouPlatform Frontend

Ứng dụng web frontend cho HouPlatform được xây dựng với React, TypeScript, và Vite.

## 🚀 Tech Stack

- **React 19.2.0** - Thư viện UI
- **TypeScript 5.9** - Type-safe JavaScript
- **Vite 7.2** - Build tool & dev server
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **Auth0** - Authentication & Authorization
- **ESLint** - Code quality & linting

## 📁 Cấu Trúc Project

```
houplatform-fe/
├── src/
│   ├── components/          # React components
│   │   ├── common/         # Components dùng chung
│   │   ├── layout/         # Layout components
│   │   └── provider/       # Context providers
│   ├── screen/             # Các màn hình/pages
│   ├── route/              # Routing configuration
│   ├── service/            # API services
│   │   └── user/          # User-related services
│   ├── hooks/              # Custom React hooks
│   ├── constant/           # Constants & enums
│   ├── data/               # Static data
│   ├── util/               # Utility functions
│   ├── assets/             # Static assets (images, icons)
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Public static files
└── ...config files
```

## 🛠️ Cài Đặt

### Yêu cầu

- Node.js >= 18
- npm hoặc yarn

### Các bước cài đặt

1. Clone repository

```bash
git clone <repository-url>
cd houplatform-fe
```

2. Cài đặt dependencies

```bash
npm install
```

3. Tạo file `.env` và cấu hình biến môi trường

```env
VITE_ENVIRONMENT=development
VITE_API_ENDPOINT_URL=http://localhost:3000
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=your-auth0-audience
```

4. Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

## 📜 Scripts

```bash
npm run dev      # Chạy development server
npm run build    # Build cho production
npm run preview  # Preview production build
npm run lint     # Kiểm tra code với ESLint
```

## 🎨 Tailwind CSS

Project sử dụng Tailwind CSS v4 với cấu hình PostCSS. Các utility classes có thể sử dụng trực tiếp trong JSX.

## 🔐 Authentication

Project tích hợp Auth0 cho authentication. Cần cấu hình các biến môi trường Auth0 trong file `.env`.

## 📝 Code Style

- TypeScript strict mode
- ESLint với React hooks rules
- Prettier (nếu có cấu hình)

## 🤝 Contributing

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request
