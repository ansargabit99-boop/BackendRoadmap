# Task Board API (TypeScript)

A mini Trello backend built with **TypeScript**, **Node.js**, **Express** and **PostgreSQL**.
Users create boards, add tasks, invite other users as members, and assign tasks to each other.

> Write the code yourself. This time, split the code into separate files (routes, controllers, database).

---

## Setup

```bash
npm init -y
npm install express pg bcrypt jsonwebtoken dotenv
npm install --save-dev typescript tsx @types/node @types/express @types/pg @types/bcrypt @types/jsonwebtoken
npx tsc --init
```

Create a PostgreSQL database and design all the tables yourself.

Create `.env` (and add it to `.gitignore`):

```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/taskboard
JWT_SECRET=long_random_string
```

---

## Endpoints

| Method | Endpoint                         | Description                          |
| ------ | -------------------------------- | ------------------------------------ |
| POST   | `/auth/register`                 | Create an account                    |
| POST   | `/auth/login`                    | Return a JWT                         |
| POST   | `/boards`                        | Create a board (you become owner)    |
| GET    | `/boards`                        | List boards I belong to              |
| GET    | `/boards/:id`                    | Board with its tasks and members     |
| PUT    | `/boards/:id`                    | Rename a board (owner only)          |
| DELETE | `/boards/:id`                    | Delete a board (owner only)          |
| POST   | `/boards/:id/members`            | Add a member by email (owner only)   |
| DELETE | `/boards/:id/members/:userId`    | Remove a member (owner only)         |
| POST   | `/boards/:id/tasks`              | Create a task (members)              |
| PUT    | `/tasks/:id`                     | Update title, status or assignee     |
| DELETE | `/tasks/:id`                     | Delete a task (members)              |

All routes except `/auth/*` need the header: `Authorization: Bearer <token>`

---

## Tasks

### Stage 1: Setup and auth
- [ ] Reuse your register and login from project 3
- [ ] Create the tables: users, boards, board members, tasks

### Stage 2: Boards
- [ ] Create a board and automatically make the creator its owner
- [ ] List only the boards the user belongs to
- [ ] Get one board with its tasks and members (use JOINs)

### Stage 3: Members and roles
- [ ] Owner can add and remove members
- [ ] Only the owner can rename or delete a board
- [ ] Non-members get `404` for boards they don't belong to

### Stage 4: Tasks
- [ ] Members can create, update and delete tasks on their boards
- [ ] Tasks have a status (`todo`, `in_progress`, `done`)
- [ ] A task can only be assigned to a member of that board

### Stage 5: Queries
- [ ] Filter tasks by status and by assignee
- [ ] Pagination (`?page=1&limit=10`)
- [ ] Sort tasks by creation date

### Stage 6: Structure and safety
- [ ] Split the code into routes, controllers and a database file
- [ ] Types for every entity, no `any`
- [ ] Validate all input and use parameterized queries
- [ ] Global error handler
