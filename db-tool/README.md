# db-tool

CLI backup / restore / verify / rollback database, viết bằng Node.js + TypeScript. Hỗ trợ MySQL, MariaDB, SQL Server (MSSQL) và MongoDB qua Driver Pattern.

## Yêu cầu hệ thống

Ngoài Node.js, tool gọi ra các CLI tool ngoài (external binaries) theo từng dialect — các tool này phải có sẵn trong `PATH`:

| Dialect | Tool bắt buộc |
|---|---|
| mysql / mariadb | `mysqldump`, `mysql` |
| mssql | `sqlpackage`, `bcp` |
| mongodb | `mongodump`, `mongorestore` |

> `bcp` không nằm trong danh sách công nghệ ban đầu của spec — được thêm vào vì `sqlpackage`/`.bacpac` không hỗ trợ export/import theo từng table riêng, mà spec lại yêu cầu có file dump riêng cho mỗi table (`DB/<table>.*`).

## Cài đặt

```bash
npm install
```

## Cấu hình

Copy file mẫu rồi điền thông tin kết nối thật:

```bash
cp config/db.config.example.json config/db.config.json
```

```json
{
  "username": "root",
  "password": "your-password-here",
  "database": "your-database-name",
  "host": "127.0.0.1",
  "dialect": "mysql",
  "port": 3306
}
```

`dialect` chỉ nhận một trong: `mysql`, `mariadb`, `mssql`, `mongodb`. File này được validate bằng zod (`src/config/config.schema.ts`) — sai field nào sẽ in `Invalid Config` kèm chi tiết và dừng chương trình ngay, không chạy tiếp.

`config/db.config.json` đã được thêm vào `.gitignore` vì chứa credential thật — không commit file này.

> `.env` / `.env.example` hiện chưa được dùng — tool đọc config từ `config/db.config.json`, không đọc biến môi trường.

## Chạy

```bash
npm run dev
```

Menu hiện ra:

```
================================
        Database Tool
================================
1. Backup
2. Restore
3. Verify
4. Rollback
5. History
6. Exit
```

## Build & Deploy

```bash
npm run build    # tsc -> dist/
npm start        # chạy bản đã build: node dist/index.js
```

Lint / format:

```bash
npm run lint
npm run format
```

Deploy production: build trước (`npm run build`), copy `dist/`, `config/db.config.json` (tạo riêng trên máy đích, không copy từ máy dev), `package.json`, `package-lock.json` lên server, `npm ci --omit=dev`, rồi `npm start`. Đảm bảo các external tool ở bảng trên đã được cài trên máy chạy thật, không chỉ máy dev.

## Ví dụ: Backup

1. Chọn `1. Backup`
2. `Đồng ý Test Connection? Y/n` → `Y`
3. Tool test connection, in `Passed`/`Failed`
4. `Xuất Database? Y/n` → `Y`
5. Tool tạo thư mục `Data/{dialect}_{database}_{timestamp}/` chứa:
   - `metadata.json` — mô tả backup: tables, foreign keys, row count từng table, checksum
   - `full/` — dump toàn bộ database (`full.sql` / `full.bacpac` / `full.archive`, tuỳ dialect)
   - `DB/` — dump riêng từng table/collection
6. Một entry mới được ghi vào `Logs/history.json`, log chi tiết vào `Logs/backup.log`

## Ví dụ: Restore

1. Chọn `2. Restore`
2. Nhập đường dẫn backup, ví dụ: `Data/mysql_dataBS_1750000000000`
3. Tool test connection
4. Tool tự động snapshot database hiện tại vào `Rollback/{dialect}_{database}/` (an toàn trước khi ghi đè)
5. Tool đọc `metadata.json`, tính thứ tự restore theo foreign key (topological sort), restore từng table theo `DB/` theo đúng thứ tự đó (MySQL/MariaDB/MongoDB) — riêng MSSQL restore nguyên `full.bacpac` vì file `DB/*.dat` của MSSQL chỉ có data, không có schema
6. Verify lại sau khi restore — so live database với `metadata.json` (table list, foreign keys, row count, checksum)
7. Nếu verify FAIL hoặc có lỗi ở bất kỳ bước nào → tự động rollback về snapshot vừa tạo ở bước 4, không cần xác nhận

## Ví dụ: Verify (đứng độc lập)

1. Chọn `3. Verify`
2. Nhập đường dẫn backup cần so sánh
3. Tool in `PASS` hoặc `FAIL`

## Ví dụ: Rollback (đứng độc lập)

1. Chọn `4. Rollback`
2. Xác nhận `Y`
3. Tool restore lại snapshot gần nhất trong `Rollback/`

> Rollback đứng độc lập chỉ hoạt động nếu đã có `createSnapshot()` chạy trước đó trong cùng session (đường dẫn snapshot giữ trong memory, không persist).

## History

Chọn `5. History` để xem toàn bộ log dạng bảng: ID, Action, Database, Status, Time — đọc từ `Logs/history.json`.

## Logging

`Logs/app.log` chứa toàn bộ log. Ngoài ra có 4 file riêng theo action: `Logs/backup.log`, `restore.log`, `rollback.log`, `verify.log` — mỗi file chỉ chứa log của đúng action đó.

## Error Handling

Mọi lỗi trong lúc backup/restore/verify/rollback đều được phân loại (`src/utils/errors.ts`): Connection Error, Permission Error, FK Error, Disk Full, Unknown Error — in ra màu đỏ kèm category, ghi log, ghi history `FAILED`, và **không crash** — quay lại menu để chọn tiếp. (Riêng lỗi `Invalid Config` lúc khởi động vẫn dừng chương trình có chủ đích, theo đúng spec.)

## Cấu trúc thư mục

```
db-tool/
├── config/
│   ├── db.config.example.json
│   └── db.config.json        (gitignored, tự tạo)
├── Data/                      (output backup, gitignored)
├── Rollback/                  (snapshot trước restore, gitignored)
├── Logs/                      (gitignored)
└── src/
    ├── drivers/{mysql,mariadb,mssql,mongodb}/   — implement DatabaseDriver
    ├── factory/DriverFactory.ts                  — chọn driver theo config.dialect
    ├── interfaces/DatabaseDriver.ts               — interface chung mọi driver
    ├── utils/
    │   ├── metadata.ts   — đọc/viết metadata.json + checksum
    │   ├── topoSort.ts   — topological sort theo foreign key, dùng cho thứ tự restore
    │   ├── retry.ts      — retry + timeout cho lệnh restore
    │   ├── progress.ts   — resume restore nếu bị gián đoạn giữa chừng
    │   ├── errors.ts     — phân loại lỗi
    │   └── history.ts    — đọc/viết Logs/history.json
    ├── logger/logger.ts   — winston, console + app.log + 4 file theo action
    ├── config/            — đọc + validate (zod) db.config.json
    ├── cli/menu.ts         — menu chính
    └── index.ts            — entrypoint, vòng lặp CLI
```

## Giới hạn đã biết

- MSSQL: `bcp` truyền password qua `-P` trên command line (không có cách dùng biến môi trường như `mysqldump`), nên có rủi ro lộ password qua process list — chưa khắc phục.
- MSSQL: checksum trong `verify()` so file `.bacpac` hiện chưa được test với SQL Server thật — `sqlpackage`/`bcp` không chắc tạo ra output giống byte-for-byte giữa hai lần export cùng dữ liệu.
- Retry/timeout/resume chỉ áp dụng cho `restore()`, không áp dụng cho `backup()` (đúng theo yêu cầu spec).
