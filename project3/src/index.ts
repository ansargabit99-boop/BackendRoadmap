import express from "express";
import pg from "pg";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { error } from "node:console";
import cors from "cors";
const app = express();
app.use(cors());
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
app.use(express.json());
try {
  const result = await pool.query("SELECT NOW()");
  console.log("Database connected succcessfully");
} catch (error) {
  console.error("Database connection failed:", error);
}
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

////////register
app.post("/auth/register", async (req, res) => {
  try {
    const body = req.body;
    if (!body.email || !body.password || !body.name) {
      return res.status(400).json({ error: "Email and passwors is required" });
    }

    const hidden = await bcrypt.hash(body.password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)  RETURNING id, email",
      [body.name, body.email, hidden],
    );
    if (!body.email || !body.password || !body.name) {
      return res.status(400).json({ error: "Email and password is required" });
    }
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server error" });
  }
});

//////login
app.post("/auth/login", async (req, res) => {
  try {
    const body = req.body;
    if (!body.email || !body.password) {
      return res.status(400).json({ error: "Email and password is required" });
    }
    const result = await pool.query(
      "SELECT id,  email , password FROM users WHERE email = $1",
      [body.email],
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid emial or password" });
    }
    const user = result.rows[0];

    function generatetoken(id: number) {
      return jwt.sign({ id: id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });
    }
    const matching = await bcrypt.compare(body.password, user.password);
    if (!matching) {
      return res.status(401).json({ error: "Invalid email or passwrod" });
    }
    const token = generatetoken(user.id);
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server error" });
  }
});
//////get todos
app.get("/todos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "failed to get todos" });
  }
});
////////todos id
app.get("/todos/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const authheader = req.headers.authorization;
  if (!authheader || !authheader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authheader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  const checked = jwt.verify(token, process.env.JWT_SECRET!);
  if (typeof checked === "string") {
    return res.status(401).json({ error: "Invalud token" });
  }
  const userId = checked.id;
  if (!userId) {
    return res.status(401).json({ error: "No token provided" });
  }
  const result = await pool.query(
    "SELECT * FROM todos WHERE id = $1 AND user_id = $2",
    [id, userId],
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Todo not found" });
  }

  res.status(200).json(result.rows[0]);
});
