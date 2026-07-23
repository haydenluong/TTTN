## Chỉnh sửa nội dung bằng Puck

Để vào trình chỉnh sửa Puck, thêm `/editor` vào sau đường dẫn của trang cần sửa:

- Trang chủ (`/`) → `/editor`
- Giới thiệu (`/gioi-thieu`) → `/gioi-thieu/editor`
- Hội viên (`/hoi-vien`) → `/hoi-vien/editor

# React + TypeScript + Vite

Dự án dùng Vite + React + TypeScript, có Tailwind CSS v4 và Puck (trình chỉnh sửa kéo-thả) để quản lý nội dung trang.

## Cách chạy dự án

```bash
npm install     # cài dependencies
npm run dev     # chạy server phát triển (dev server)
npm run build   # build (chạy tsc -b rồi vite build)
npm run lint    # kiểm tra code bằng oxlint
npm run preview # xem trước bản build
```

Sau khi chạy `npm run dev`, mở đường dẫn mà terminal in ra (thường là `http://localhost:5173`).

## Chỉnh sửa nội dung bằng Puck

Để vào trình chỉnh sửa Puck, thêm `/editor` vào sau đường dẫn của trang cần sửa:

- Trang chủ (`/`) → `/editor`
- Giới thiệu (`/gioi-thieu`) → `/gioi-thieu/editor`
- Hội viên (`/hoi-vien`) → `/hoi-vien/editor`

Mỗi trang lưu dữ liệu chỉnh sửa riêng trong `localStorage` của trình duyệt (không ảnh hưởng đến các trang khác).

## React Compiler

React Compiler chưa được kích hoạt trong template này vì ảnh hưởng đến hiệu năng lúc phát triển & build. Muốn thêm, xem [tài liệu này](https://react.dev/learn/react-compiler/installation).

## Mở rộng cấu hình Oxlint

Nếu đang phát triển một ứng dụng dùng cho production, nên kích hoạt các rule lint có nhận biết kiểu dữ liệu (type-aware) bằng cách cài `oxlint-tsgolint` và sửa file `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

Xem [tài liệu rule Oxlint](https://oxc.rs/docs/guide/usage/linter/rules) để biết đầy đủ danh sách rule và phân loại.
