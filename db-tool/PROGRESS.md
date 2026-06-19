# Progress Log

## How I asked Claude to work with me

- Started in strict teaching mode: one small piece per turn, explain in plain English *before* any code, never write non-trivial logic for me — give a signature/outline and a TODO, then wait for my attempt before reviewing/correcting.
- Boilerplate (imports, scaffolding) was allowed to be written directly, but called out explicitly as "boilerplate, skim it."
- Any non-trivial code had to come with a line-by-line walkthrough — no unexplained code blocks.
- I have little to no SQL background, so several detours were needed to explain `information_schema`, what "schema" means in MySQL, what foreign keys are, what `connection.query()` returns (`[rows, fields]` tuple), placeholders (`?`) and why they're safer than string concatenation, and what `path.join` actually does vs. what I initially assumed (it builds a new path string, it doesn't "convert" a folder into a file).
- When I got stuck or said things like "just give me the full code" / "I don't get it at all," that was treated as permission to write the complete method directly rather than continuing to make me attempt it — but explanations (often with real-life analogies) still had to follow.
- I explicitly asked to switch to "explain every new function line-by-line with a real-life analogy" as the default format for new methods, and that became the standard going forward.
- I gave one-time explicit permission to skip the slow approach entirely for the MongoDB driver ("break the requirement just this once") and later broadened that to "do the rest, I give permission to code on your own" for the remaining drivers (MariaDB, MSSQL) and CLI wiring — at that point the pace shifted from teaching-first to building-first, with me asking follow-up questions about *why* the code works rather than attempting it myself first.
- Preference throughout: don't auto-fix cosmetic issues (e.g. inconsistent indentation) unless asked — "leave it, we'll fix it later."
- I periodically asked "how far am I from finishing" and "what's the easier next piece" to manage scope — Claude gave honest percentage estimates and ordered the remaining work by difficulty rather than spec order.

## What's been built so far

- **`src/interfaces/DatabaseDriver.ts`** — the shared interface every driver implements: `connect`, `disconnect`, `test`, `backup`, `restore`, `verify`, `rollback`, `createSnapshot`, `getSchema`, `getForeignKeys`, `getTables`.
- **Four drivers**, each implementing the full interface:
  - `src/drivers/mysql/MySQLDriver.ts` — uses `mysql2/promise` for queries, shells out to `mysqldump`/`mysql` CLI for backup/restore/snapshot/rollback, queries `information_schema` for tables/foreign keys/schema.
  - `src/drivers/mariadb/MariaDBDriver.ts` — near-identical to MySQL (wire-compatible), uses the `mariadb` package instead of `mysql2`.
  - `src/drivers/mssql/MSSQLDriver.ts` — uses the `mssql` package, shells out to `sqlpackage` (`.bacpac` files) for backup/restore, queries `sys.foreign_keys`/`INFORMATION_SCHEMA` for metadata.
  - `src/drivers/mongodb/MongoDBDriver.ts` — uses the `mongodb` package, shells out to `mongodump`/`mongorestore` (`.archive` files). `getForeignKeys()` always returns `[]` (Mongo has no enforced FK constraints). `getSchema()` is a best-effort guess based on sampling one document per collection, since Mongo has no fixed per-collection schema.
- **`src/factory/DriverFactory.ts`** — `createDriver(config)` switches on `config.dialect` and returns the matching driver instance.
- **`src/utils/history.ts`** — `addHistoryEntry()` / `getHistory()`, reads/writes `Logs/history.json` with auto-incrementing zero-padded IDs and ISO timestamps.
- **`src/index.ts`** — CLI loop wired to real driver calls:
  - `backup`: test-connection prompt → Passed/Failed → export-confirm prompt → `driver.backup(targetDir)` → history entry.
  - `restore`: ask source path → test connection → reconnect → safety `createSnapshot()` → `driver.restore()` → `driver.verify()` → auto-`rollback()` on failure → history entry either way.
  - `verify`: standalone connect → `driver.verify()` → PASS/FAIL.
  - `rollback`: standalone confirm → `driver.rollback()` → history entry.
  - `history`: prints all entries from `Logs/history.json` as an aligned, color-coded table.
- Fixed a real bug along the way: `main().catch(console.error)` had gotten trapped inside `main()`'s own body due to misplaced braces, meaning the program would never actually start — corrected.
- Confirmed boilerplate already existed and didn't need to be created: `tsconfig.json`, `.eslintrc.js`, `.prettierrc`, `.env.example`.

## Known gaps / things flagged but not yet fixed

- `rollback()` only works if `createSnapshot()` ran earlier in the **same process** (snapshot path is kept in memory, not persisted) — calling standalone "Rollback" without a prior restore in that session will throw uncaught.
- Indentation inside the `restore` block in `index.ts` is inconsistent (mixed 2/4-space) — left alone intentionally, to be cleaned up later (e.g. via `npm run format`).
- `config/db.config.json` (holds real DB credentials) is **not** currently in `.gitignore` — flagged as a real risk if committed, not yet fixed pending your decision.
- `.env` / `.env.example` exist but are currently unused — `config.loader.ts` reads credentials from `config/db.config.json`, not environment variables.
- Standalone `verify` action does not currently log a history entry (only backup/restore/rollback do).

## Remaining steps (ordered easy → hard, not spec order)

1. Decide on and fix the `config/db.config.json` git-ignore question (and optionally add a `config/db.config.example.json`).
2. **`metadata.json` generation** during backup — call existing `getSchema()`, `getTables()`, `getForeignKeys()` and write the result alongside `full.sql` (this was the next piece in progress when the summary was requested).
3. Structured per-action log files (`backup.log`, `restore.log`, `rollback.log`, `verify.log`) — winston logger already exists, just needs per-action file transports wired up.
4. Per-table dump files (`DB/users.sql`, `DB/orders.sql`, etc.) alongside the existing full dump.
5. Richer `verify()` — compare live table/row counts, primary keys, foreign keys, indexes, triggers, procedures, and checksums against the saved `metadata.json`, rather than just "can every table be queried."
6. Foreign-key dependency graph + topological sort for restore ordering (spec explicitly wants this implemented manually, not just relying on `mysqldump`/`mysql`'s built-in ordering).
7. Retry / timeout / resume handling for `restore()`.
8. Comprehensive error handling per categories (disk full, permission errors, FK errors, etc.) rather than generic try/catch.
9. README, build/deploy instructions, and other docs the spec's output section calls for (you said you'd handle the spec write-up yourself, but the README/usage docs were called out separately in the original task list).
10. Repeat indentation/style cleanup pass (`npm run format`) once the remaining logic is in place.
