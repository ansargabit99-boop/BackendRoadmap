import express from "express";
import "dotenv/config";
import pg from "pg";
const app = express();
const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
app.use(express.json());

try {
  const result = await pool.query("SELECT NOW()");
  console.log("Database connected successfully!");
} catch (error) {
  console.error("Database connection failed:", error.message);
}
////get
app.get("/todos", async function (req, res) {
  try {
    const result = await pool.query("SELECT * FROM todos");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get todos" });
  }
});
////post
app.post("/todos", async (req, res) => {
  try {
    const body = req.body;
    console.log(body.title);
    console.log(body.description);
    const result = await pool.query(
      "INSERT INTO todos (title, description) VALUES ($1 , $2) RETURNING *",
      [body.title, body.description],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create todo",
    });
  }
});
////

////
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
