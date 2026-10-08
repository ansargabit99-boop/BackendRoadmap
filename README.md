# Todo List API

A REST API for managing todos, built with **Node.js**, **Express** and **PostgreSQL**.
This is a learning project: you build the backend from scratch by following the tasks below.

> **Rule:** the whole app lives in **one file** (`index.js`). No routers, no controllers, no separate folders for code.

---

## Goal

Build a backend where users can create, read, update and delete todos, with all data stored in a real database (not in memory).

## Tech Stack

- Node.js (v18+)
- Express
- PostgreSQL
- `pg` (database driver)
- `dotenv` (environment variables)
- `nodemon` (auto-restart in development)

---

## Getting Started

### 1. Install dependencies

```bash
npm init -y
npm install express pg dotenv
npm install --save-dev nodemon
```

### 2. Create the database

```
go to pg Admin
CREATE DATABASE todolist;
```

### 3. Create the table

```sql
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Set up environment variables

Create a `.env` file in the project root:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=todolist
```

> Never commit `.env` to Git. Add it to `.gitignore`.

### 5. Run the project

Add this to `package.json`:

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

```bash
npm run dev
```

---

## Project Structure

```
todolist/
├── index.js        # the entire app: setup, DB connection, routes, error handling
├── .env
├── .gitignore
├── package.json
└── README.md
```

### Suggested layout inside `index.js`

Keep the file organized with comment sections, in this order:

```
1. Imports and dotenv config
2. Express app setup (app.use(express.json()))
3. Database connection (pg Pool)
4. Routes (app.get / app.post / app.put / app.delete)
5. Error handling middleware
6. app.listen
```

---

## API Endpoints

| Method | Endpoint       | Description          |
| ------ | -------------- | -------------------- |
| GET    | `/todos`       | Get all todos        |
| GET    | `/todos/:id`   | Get a single todo    |
| POST   | `/todos`       | Create a new todo    |
| PUT    | `/todos/:id`   | Update a todo        |
| DELETE | `/todos/:id`   | Delete a todo        |

### Example: create a todo

**Request**

```http
POST /todos
Content-Type: application/json

{
  "title": "Learn Express",
  "description": "Finish the routing chapter"
}
```

**Response** `201 Created`

```json
{
  "id": 1,
  "title": "Learn Express",
  "description": "Finish the routing chapter",
  "completed": false,
  "created_at": "2026-10-08T10:00:00.000Z",
  "updated_at": "2026-10-08T10:00:00.000Z"
}
```

---

## Tasks

Complete these in order. Commit to Git after each stage.

### Stage 1: Setup

- [ ] Initialize the project and install dependencies
- [ ] Create `index.js` with an Express server that listens on `PORT`
- [ ] Add a `GET /health` route that returns `{ "status": "ok" }`

### Stage 2: Database

- [ ] Create the PostgreSQL database and the `todos` table
- [ ] Connect to the database inside `index.js` using `pg` (use a connection pool)
- [ ] Load credentials from `.env`, not hard-coded

### Stage 3: CRUD

- [ ] `GET /todos` returns all todos
- [ ] `GET /todos/:id` returns one todo, or `404` if it does not exist
- [ ] `POST /todos` creates a todo
- [ ] `PUT /todos/:id` updates a todo
- [ ] `DELETE /todos/:id` deletes a todo
- [ ] Use correct status codes (`200`, `201`, `204`, `400`, `404`, `500`)

### Stage 4: Validation and Errors

- [ ] Return `400` if `title` is missing or empty
- [ ] Return `400` if `:id` is not a number
- [ ] Add a global error-handling middleware at the bottom of `index.js`
- [ ] Always use parameterized queries (`$1`, `$2`) to prevent SQL injection

### Stage 5: Code Quality

- [ ] Keep everything in `index.js`, split into clearly commented sections
- [ ] Use `async/await` with `try/catch`
- [ ] Add a `.gitignore` (`node_modules`, `.env`)

---

## Bonus Tasks

- [ ] Filter todos: `GET /todos?completed=true`
- [ ] Pagination: `GET /todos?page=1&limit=10`
- [ ] Search by title: `GET /todos?search=express`
- [ ] Add a `due_date` column and sort by it
- [ ] Refactor: move routes into `express.Router()` and split into separate files
- [ ] Add users and authentication (JWT), so each user sees only their own todos
- [ ] Add tests with Jest and Supertest
- [ ] Dockerize the app with `docker-compose` (app + PostgreSQL)

---

## Testing the API

Use any of these tools:

- [Postman](https://www.postman.com/)
- [Thunder Client](https://www.thunderclient.com/) (VS Code extension)
- `curl`

```bash
curl http://localhost:3000/todos
```

---

## Learning Goals

By finishing this project you will understand:

- How an Express server and routing work
- How to connect Node.js to a SQL database
- Writing CRUD operations with SQL queries
- Request validation and error handling
- Using environment variables safely

---

## Definition of Done

The project is complete when:

1. All five CRUD endpoints work and persist data in PostgreSQL
2. Invalid requests return proper error messages and status codes
3. The whole app is in a single, well-organized `index.js`
4. Secrets are in `.env`, which is not committed

Good luck my girl!
P.s try to dont copy paste from ai.Ai is allowed but just for learning.