import express from "express";
import "dotenv/config";
import pg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const app = express();

const PORT = process.env.PORT || 3000;
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());

app.get("/health", async (req, res) => {
  res.json({ message: "Server is working!" });
});

// app.get("/users", async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT id, name, email, created_at FROM users",
//     );
//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Failed to get users" });
//   }
// });
////////////register
app.post("/auth/register", async (req, res) => {
  try {
    const body = req.body;
    if (!body.email || !body.password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const hidden = await bcrypt.hash(body.password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1 , $2, $3) RETURNING id, email",
      [body.name, body.email, hidden],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create user",
    });
  }
});
////////login
app.post("/auth/login", async (req, res) => {
  try {
    const body = req.body;
    if (!body.email || !body.password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const result = await pool.query(
      "SELECT id, email, password FROM users WHERE email =$1",
      [body.email],
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const user = result.rows[0];
    const matching = await bcrypt.compare(body.password, user.password);
    if (!matching) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

///////logged in
app.get("/auth/me", async (req, res) => {
  try {
    const authheader = req.headers.authorization;

    if (!authheader) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authheader.split(" ")[1];
    const checked = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [checked.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Authentication failed" });
  }
});
///////
app.listen(PORT, () => {
  console.log(`Server is runnning on ${PORT}`);
});

try {
  const result = await pool.query("SELECT NOW()");
  console.log("Database connected successfully");
} catch (error) {
  console.log("Database connection failed", error.message);
}
////////////GOOOOOOOOOODDDDDDDDDD JJJJOOOOOOOBBBBBBBBB
//////////YOUR NEXT TASK WILL BE COMBINING THE TODOLIST WITH THIS LOGIN PAGE