import express from "express";
import pg from "pg";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { error } from "node:console";
const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  next();
});
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
    if (!body.email || !body.password) {
      return res.status(400).json({ error: "Email and passwors is required" });
    }
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [body.name, body.email, body.password],
    );
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
      "SELECT email , passwrod FROM users WHERE email = 1$",
      [body.email],
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid emial or password" });
    }
    const user = result.rows[0];
    const matching = await bcrypt.compare(body.password, user.password);
    if (!matching) {
      return res.status(401).json({ error: "Invalid email or passwrod" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server error" });
  }
});
