# Login System API

A simple login backend with **Node.js**, **Express** and **PostgreSQL**.
Users can register, log in, and access a protected route with a JWT token.

> Keep everything in one file (`index.js`) and write the code yourself.

---

## Setup

```bash
npm init -y
npm install express pg bcrypt jsonwebtoken dotenv
npm install --save-dev nodemon
```

Create a PostgreSQL database and design the `users` table yourself.

Create `.env` (and add it to `.gitignore`):

```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/authdb
JWT_SECRET=long_random_string
```

---

## Endpoints

| Method | Endpoint         | Auth | Description                    |
| ------ | ---------------- | ---- | ------------------------------ |
| POST   | `/auth/register` | No   | Create an account              |
| POST   | `/auth/login`    | No   | Return a JWT if credentials OK |
| GET    | `/auth/me`       | Yes  | Return the logged-in user      |

Protected routes use the header: `Authorization: Bearer <token>`

---

## Tasks

### Stage 1: Setup
- [ ] Express server with `GET /health`
- [ ] Connect to PostgreSQL
- [ ] Create the `users` table

### Stage 2: Register
- [ ] Hash the password with bcrypt before saving
- [ ] Return `201` with `id` and `email` only (never the password)
- [ ] `400` if email or password is missing
- [ ] `409` if the email already exists

### Stage 3: Login
- [ ] Compare the password with the hash
- [ ] Return a JWT that expires
- [ ] `401` with the same message for wrong email or wrong password

### Stage 4: Protected route
- [ ] Write an auth middleware that verifies the token
- [ ] `GET /auth/me` returns the current user
- [ ] `401` if the token is missing, invalid or expired

### Stage 5: Safety
- [ ] Validate email format and password length (min 8)
- [ ] Use parameterized queries (`$1`, `$2`)
- [ ] Add a global error handler
- [ ] Secrets only in `.env`
