# Todo List with Login (TypeScript)

A todo API with user accounts, built with **TypeScript**, **Node.js**, **Express** and **PostgreSQL**.
Users register, log in, and manage **only their own** todos.

> Keep everything in one file (`src/index.ts`) and write the code yourself.

---

## Setup

```bash
npm init -y
npm install express pg bcrypt jsonwebtoken dotenv
npm install --save-dev typescript tsx @types/node @types/express @types/pg @types/bcrypt @types/jsonwebtoken
npx tsc --init
```

Scripts for `package.json`:

```json
"scripts": {
  "dev": "tsx watch src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

Create a PostgreSQL database and design the `users` and `todos` tables yourself.

Create `.env` (and add it to `.gitignore`):

```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/todoauth
JWT_SECRET=long_random_string
```

---

## Endpoints

| Method | Endpoint         | Auth | Description                    |
| ------ | ---------------- | ---- | ------------------------------ |
| POST   | `/auth/register` | No   | Create an account              |
| POST   | `/auth/login`    | No   | Return a JWT if credentials OK |
| GET    | `/todos`         | Yes  | Get my todos                   |
| GET    | `/todos/:id`     | Yes  | Get one of my todos            |
| POST   | `/todos`         | Yes  | Create a todo                  |
| PUT    | `/todos/:id`     | Yes  | Update my todo                 |
| DELETE | `/todos/:id`     | Yes  | Delete my todo                 |

Protected routes use the header: `Authorization: Bearer <token>`

---

## Tasks

### Stage 1: TypeScript setup
- [ ] Configure `tsconfig.json` (`strict: true`, `outDir: dist`)
- [ ] Express server in `src/index.ts` with `GET /health`
- [ ] Connect to PostgreSQL
- [ ] Create the `users` and `todos` tables (each todo belongs to a user)

### Stage 2: Types
- [ ] Create interfaces for `User` and `Todo`
- [ ] Type the request bodies and the database rows
- [ ] No `any` anywhere

### Stage 3: Auth
- [ ] Register: hash the password with bcrypt, return `201` with `id` and `email` only
- [ ] `400` if email or password is missing, `409` if the email exists
- [ ] Login: return a JWT that expires
- [ ] `401` with the same message for wrong email or wrong password

### Stage 4: Auth middleware
- [ ] Write a middleware that verifies the token
- [ ] Attach the user id to the request with a proper TypeScript type
- [ ] `401` if the token is missing, invalid or expired

### Stage 5: Todos
- [ ] CRUD endpoints, all protected by the middleware
- [ ] Every query filters by the logged-in user's id
- [ ] A user must never see, edit or delete another user's todo (return `404`)

### Stage 6: Safety
- [ ] Validate email, password length (min 8) and todo `title`
- [ ] Use parameterized queries (`$1`, `$2`)
- [ ] Add a global error handler
- [ ] Secrets only in `.env`
