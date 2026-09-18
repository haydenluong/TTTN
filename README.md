# Internship work (TTTN)

A collection of the work I did during my internship — mostly frontend (React/Vite, Puck editor, Bootstrap landing pages) plus one backend/CLI project for database manipulation.

Each folder is a separate piece of work with its own README where relevant.

## Frontend

| Folder | What it is |
|---|---|
| [Hexagon/](Hexagon/) | React + Vite site with a Puck-based page manager (create/edit/publish pages, VI/EN translations) |
| [Doanhnhandongthap/](Doanhnhandongthap/) | React + TS + Vite + Tailwind v4 site, content editable through Puck (`/editor` routes) |
| [Metik/](Metik/) | Rebuild of [metik.vn](https://metik.vn/) as editable Puck components |
| [LDP/](LDP/) | Figma → HTML landing page for a game event, Bootstrap 5, no build tools |
| [LDP-voting/](LDP-voting/) | Voting page, same plain HTML + Bootstrap 5 stack |
| [MyE/](MyE/) | Static pages |
| [11_06_Components/](11_06_Components/) | Standalone Puck admin components (hero, heading, section, club/committee blocks) |
| [NGÀNH ĐÀO TẠO/](NGÀNH%20ĐÀO%20TẠO/) | Training-programs component + its Puck config |

## Backend

| Folder | What it is |
|---|---|
| [db-tool/](db-tool/) | Node.js + TypeScript CLI for database backup / restore / verify / rollback. Supports MySQL, MariaDB, SQL Server and MongoDB behind a driver pattern, wrapping the native dump/restore binaries (`mysqldump`, `sqlpackage`/`bcp`, `mongodump`). See its [README](db-tool/README.md). |

## Not in this repo

The main project from my resume isn't in this repo. I built it during the internship, but it lives in the company's private GitLab and the code is their property, so I can't publish it here:

> Worked on a full-stack internal document management system (Next.js, Express, Prisma, PostgreSQL) featuring role-based access control, version history, and full-text search across the organization's knowledge base, which was extended and deployed to 20+ employees across the Technology Branch.
>
> Developed a RAG pipeline using OpenAI embeddings and pgvector for natural-language document search, cutting average document lookup time by an estimated 60% compared to manual folder navigation.
