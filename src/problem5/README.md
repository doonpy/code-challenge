# User Service API (Problem 5)

RESTful Express + Prisma service for managing users stored in a SQLite database. The service exposes CRUD endpoints with consistent JSON responses and input validation for email address format and uniqueness.

## Prerequisites

- Node.js 20+ (works with any modern LTS that supports ES modules)
- npm 10+
- SQLite (no manual install required; Prisma uses the bundled driver)

## Project Structure

```
src/problem5
├── prisma/                # Prisma schema + migrations
├── src/
│   ├── app.ts             # Express app + routes
│   ├── index.ts           # HTTP bootstrapper
│   ├── prisma.ts          # Prisma client wiring (Better SQLite adapter)
│   ├── utils.ts           # Reusable validation helpers
│   └── generated/prisma   # Prisma client output (auto-generated)
├── dev.db                 # SQLite database file (auto-created)
└── package.json
```

## Environment Variables

Create a `.env` file in `src/problem5/` with the following variables:

```
PORT=3000
DATABASE_URL=file:./dev.db
```

- `PORT` is required; the server refuses to boot if it is missing.
- `DATABASE_URL` should point to the SQLite database file you want to use. The default `file:./dev.db` keeps data inside this directory.

## Installation & Database Setup

```bash
cd src/problem5
npm install
```

`npm install` automatically runs `npm run prisma:migrate` and `npm run prisma:generate` (via `postinstall`). The included migration (`prisma/migrations/20251128044139_init`) creates the `User` and `Post` tables.

If you need to re-create the database from scratch, delete `dev.db` and rerun:

```bash
npm run prisma:migrate
```

## Development & Build Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with live TypeScript reloading (`tsx watch src/index.ts`). |
| `npm run build` | Type-check and emit JS to `dist/`. |
| `npm start` | Run the compiled build (`node dist/index.js`). |
| `npm run prisma:migrate` | Apply pending Prisma migrations (prompts for migration name in dev). |
| `npm run prisma:generate` | Rebuild the Prisma client inside `src/generated/prisma`. |
| `npm run prisma:studio` | Launch Prisma Studio to inspect or edit data. |

## Manual Testing Workflow

1. Start the API (`npm run dev` or `npm start`).
2. Hit the endpoints with your preferred REST client or `curl` (examples below).
3. Optionally open Prisma Studio to verify database changes:
   ```bash
   npm run prisma:studio
   ```

### Common `curl` Examples

```bash
# Create a user
curl -X POST http://localhost:3000/api/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada Lovelace","email":"ada@example.com"}'

# List users (supports ?name= and ?email= filters)
curl 'http://localhost:3000/api/users?name=ada'

# Get user by id
curl http://localhost:3000/api/users/1

# Update user
curl -X PUT http://localhost:3000/api/users/1 \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada L.","email":"ada@example.com"}'

# Delete user
curl -X DELETE http://localhost:3000/api/users/1
```

Every response follows `{ "data": ..., "error": "optional message" }`. Validation failures return `400` with an `error` string; unknown routes/methods respond with `404/405`.

## API Reference

### `GET /api/users`
- **Query params**: `name` (partial match), `email` (exact match; must be valid format).
- **Response**: `{ "data": User[] }`.

### `GET /api/users/:id`
- **Path params**: `id` (integer).
- **Responses**:
  - `200`: `{ "data": User }`
  - `400`: invalid id, `404`: user missing

### `POST /api/users`
- **Body**: `{ "name"?: string, "email": string }`
- **Validation**:
  - Body must be JSON.
  - `email` required, must pass regex, and must be unique (checked via Prisma).
- **Response**: created user document.

### `PUT /api/users/:id`
- **Body**: `{ "name"?: string, "email": string }`
- **Validation**: same as POST, plus `email` must remain unique.
- **Response**: updated user.

### `DELETE /api/users/:id`
- **Response**: deleted user.

