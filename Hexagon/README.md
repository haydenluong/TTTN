## Các trang quan trọng

- `/` — trang chủ
- `/admin/pages` — Quản lý Pages: tạo, sửa, publish, xóa và tạo bản dịch (VI/EN) cho các trang mới bằng Puck

## Cài đặt

```bash
npm install
```

## Chạy dự án

```bash
npm run dev
```

Mặc định chạy ở `http://localhost:5173` (nếu port này đang bận thì Vite tự chuyển qua port khác, ví dụ 5174).

## Build production

```bash
npm run build
```


## Đa ngôn ngữ (VI/EN)

Mỗi page trong Quản lý Pages có một ngôn ngữ (vi hoặc en). Dùng nút "nhân bản" trong bảng quản lý để tạo bản dịch từ một trang có sẵn, sau đó chỉnh nội dung sang tiếng Anh thủ công (không tự động dịch). Cờ VI/EN trên header sẽ chuyển giữa hai bản khi cả hai đã được publish.


