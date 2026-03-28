# Task Management REST API (Node.js + MySQL)

A very minimal, beginner-friendly project for your software systems assessment.

## Features

- Create Task
- Get All Tasks (with pagination)
- Update Task Status
- Delete Task
- Simple UI at `/`
- Input validation and error handling

## Tech Stack

- Node.js
- Express.js
- MySQL

## Project Structure (minimal)

- `server.js` -> API + DB connection + static hosting
- `public/index.html` -> simple UI
- `schema.sql` -> database schema
- `package.json`

## Database Schema

`tasks` table fields:
- `id` (INT, primary key, auto increment)
- `title` (VARCHAR(100), required)
- `description` (TEXT, required)
- `status` (ENUM: pending | in_progress | completed)
- `created_at` (TIMESTAMP)

## Setup Steps

### 1) Create database/table

Run this in MySQL:

```sql
SOURCE schema.sql;
```

If `SOURCE` doesn't work in your client, copy-paste the SQL from `schema.sql` manually.

### 2) Install dependencies

```bash
npm install
```

### 3) Set environment variables (optional)

Windows PowerShell example:

```powershell
$env:DB_HOST="localhost"
$env:DB_PORT="3306"
$env:DB_USER="root"
$env:DB_PASSWORD="your_password"
$env:DB_NAME="task_management"
```

If you skip them, defaults are used:
- host: localhost
- port: 3306
- user: root
- password: empty
- db: task_management

### 4) Run server

```bash
npm start
```

Open:
- UI: http://localhost:3000
- Health: http://localhost:3000/health

## API Routes

- `POST /api/tasks` -> create task
- `GET /api/tasks?page=1&limit=10` -> get tasks
- `PATCH /api/tasks/:id/status` -> update status
- `DELETE /api/tasks/:id` -> delete task

## Curl Commands (Deliverable)

### Create Task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Node","description":"Build first API"}'
```

### Get All Tasks (Pagination)

```bash
curl "http://localhost:3000/api/tasks?page=1&limit=10"
```

### Update Task Status

```bash
curl -X PATCH http://localhost:3000/api/tasks/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'
```

### Delete Task

```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```

## Postman

You can import the same endpoints above into Postman quickly. (Curl commands provided as required deliverable.)

## Notes

- Validation included for title, description, status, and ID.
- Errors return clean JSON messages.
- Keep this as a single-server-file project for beginner readability.
