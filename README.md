# Auth Practice - Realtime Chat

Ứng dụng chat thời gian thực với xác thực người dùng, thiết kế để thể hiện tư duy full‑stack: đăng nhập an toàn, quản lý phiên làm việc, nhắn tin realtime, và cấu trúc code rõ ràng cho backend + frontend.

## Tính năng chính

- Xác thực: đăng ký, đăng nhập, đăng xuất, refresh token (JWT + httpOnly cookie)
- Route bảo vệ + tự làm mới access token ở frontend
- Chat 1–1 và nhóm, danh sách cuộc trò chuyện
- Realtime với Socket.IO: nhận tin mới + trạng thái online
- Phân trang tin nhắn bằng cursor
- API kết bạn: gửi/chấp nhận/từ chối yêu cầu
- UI gọn nhẹ: dark/light theme, emoji picker, sidebar responsive

## Tech stack

- Backend: Node.js, Express 5, MongoDB (Mongoose), JWT, Socket.IO, Swagger
- Frontend: React 19, Vite, TypeScript, Zustand, React Router, Tailwind CSS, Radix UI, Axios, Zod, React Hook Form

## Cấu trúc dự án

```
auth-practice/
  backend/   # REST API + Socket server
  frontend/  # React app
```

## Bắt đầu nhanh

### 1) Backend

```
cd backend
npm install
```

Tạo file `.env` trong `backend/`:

```
PORT=3000
SOCKET_PORT=3001
MONGODB_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Chạy server:

```
npm run dev
```

Swagger: `http://localhost:3000/api-docs`

### 2) Frontend

```
cd frontend
npm install
```

Tạo file `.env` trong `frontend/`:

```
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3001
```

Chạy frontend:

```
npm run dev
```

## Lưu ý khi chạy local

- Refresh token đang set cookie `secure: true` và `sameSite: 'none'` trong `backend/src/utils/cookie.util.js`.
- Nếu chạy HTTP local, cookie sẽ không được set. Có thể:
  - chạy HTTPS local, hoặc
  - tạm chỉnh `secure: false` khi dev.

## Scripts

Backend (`backend/`):
- `npm run dev` - chạy server bằng nodemon
- `npm run start` - chạy production

Frontend (`frontend/`):
- `npm run dev` - chạy Vite dev server
- `npm run build` - build production
- `npm run lint` - lint code

## API chính (tham khảo nhanh)

- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `GET /api/users/me`
- `GET /api/conversations`
- `GET /api/conversations/:id/messages`
- `POST /api/messages/direct`
- `POST /api/messages/group`
- `GET /api/friends`
- `GET /api/friends/requests`
- `POST /api/friends/requests`
- `POST /api/friends/requests/:requestId/accept`
- `POST /api/friends/requests/:requestId/decline`
