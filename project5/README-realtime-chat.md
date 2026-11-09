# Real-time Chat API (TypeScript)

A simple chat backend built with **TypeScript**, **Express**, **PostgreSQL** and **Socket.IO**.
Users join chat rooms and send messages, and everyone in the room receives them **instantly**.

> Write the code yourself. No frontend needed. You will test everything with **Postman**
> (it supports Socket.IO: New → Socket.IO).

---

## What's NEW in this project

Only **one** new thing: **Socket.IO**. Everything else (Express, PostgreSQL, login, JWT) you already know.

Until now your server worked like **letters**: the client asks, the server answers, done.
With Socket.IO it works like a **phone call**: the connection stays open and the server can send
messages to users **any time**, without them asking.

---

## Setup

```bash
npm init -y
npm install express pg bcrypt jsonwebtoken dotenv socket.io
npm install --save-dev typescript tsx @types/node @types/express @types/pg @types/bcrypt @types/jsonwebtoken
npx tsc --init
```

Create `.env` (and add it to `.gitignore`):

```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/chat
JWT_SECRET=long_random_string
```

---

## How Socket.IO works (read this first!)

You still write Express exactly like before. Socket.IO is just **added on top** of your `app`.

```ts
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();                  // same as always
app.use(express.json());

app.get("/health", (req, res) => {      // normal Express routes, same as always
  res.json({ status: "ok" });
});

// ---- the only new part ----
const httpServer = createServer(app);   // wrap your express app
const io = new Server(httpServer);      // add Socket.IO on top

io.on("connection", (socket) => {
  console.log("someone connected", socket.id);

  socket.on("hello", (data) => {          // listen for an event from the client
    socket.emit("hello_back", "hi!");     // reply to this one client
  });

  socket.on("disconnect", () => {
    console.log("someone left", socket.id);
  });
});

httpServer.listen(3000);                  // instead of app.listen(3000)
```

The 4 things you need to know:

- `socket.on("event", ...)`: **listen** for a message from the client (like `app.post`)
- `socket.emit("event", data)`: send to **this one** user
- `socket.join("room_5")`: put this user into room 5
- `io.to("room_5").emit("event", data)`: send to **everyone in room 5**

👉 Before starting the stages, run this example and play with it in Postman until it feels normal.

---

## REST Endpoints (normal Express)

| Method | Endpoint                  | Description                         |
| ------ | ------------------------- | ----------------------------------- |
| POST   | `/auth/register`          | Create an account                   |
| POST   | `/auth/login`             | Return a JWT                        |
| POST   | `/rooms`                  | Create a room (you become a member) |
| GET    | `/rooms`                  | List my rooms                       |
| POST   | `/rooms/:id/members`      | Add a member by email               |
| GET    | `/rooms/:id/messages`     | Old messages of a room              |

## Socket Events (new)

| Direction        | Event           | Data                  |
| ---------------- | --------------- | --------------------- |
| client → server  | `join_room`     | `{ roomId }`          |
| client → server  | `send_message`  | `{ roomId, text }`    |
| client → server  | `typing`        | `{ roomId }`          |
| server → client  | `new_message`   | the saved message     |
| server → client  | `user_typing`   | `{ userId, email }`   |
| server → client  | `error_message` | `{ message }`         |

---

## Tasks

### Stage 1: Normal Express part
- [ ] Reuse register and login from project 4
- [ ] Create the tables: users, rooms, room members, messages
- [ ] Rooms endpoints: create, list my rooms, add member by email

### Stage 2: First socket
- [ ] Add Socket.IO on top of your `app` (see the example above)
- [ ] Connect from Postman and see "someone connected" in your terminal
- [ ] Send a `hello` event and receive `hello_back`

### Stage 3: Who is connecting?
- [ ] The client sends the JWT when connecting (in Postman: handshake auth `{ "token": "..." }`)
- [ ] Use `io.use(...)` to check the token (it works like your auth middleware)
- [ ] If the token is wrong, reject the connection
- [ ] Save the user id on `socket.data.userId`

### Stage 4: Rooms and messages
- [ ] `join_room`: only members of the room can join, otherwise emit `error_message`
- [ ] `send_message`: save the message in PostgreSQL, **then** send `new_message` to the whole room
- [ ] Empty messages are not allowed, max 2000 characters

### Stage 5: Message history
- [ ] `GET /rooms/:id/messages` returns the last 50 messages, newest last
- [ ] Only members can see them (`404` otherwise)

### Stage 6: Typing indicator
- [ ] `typing`: tell everyone in the room **except** the sender that this user is typing
- [ ] Hint: `socket.to(room)` sends to everyone except yourself

---

## Bonus Tasks

- [ ] Online / offline status (`user_online`, `user_offline`): keep online users in a `Map` in memory
- [ ] Edit and delete messages, updating live for everyone
- [ ] Private 1-to-1 chats

---

## Testing with Postman

1. Log in with REST and copy the token
2. New → **Socket.IO** → `ws://localhost:3000`
3. Add handshake auth: `{ "token": "<your token>" }`
4. Add listeners for `new_message`, `user_typing`, `error_message`
5. Open a **second** Postman tab with another user, so you can see messages arrive live 🎉

---

## Learning Goals

By finishing this project you will understand:

- The difference between normal HTTP requests and WebSockets
- Sending and listening for events
- Rooms and sending to many users at once
- Using JWT with sockets

---

## Definition of Done

1. Two users in Postman can chat in real time
2. Only room members can join a room and send messages
3. Old messages can be loaded with a normal GET request
4. Typing indicator works

Something new can feel scary at first. Start with the small example, go stage by stage, and you'll get it. I believe in you ❤️
