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
});///also insTead of writing this you can simply do everything in one line you just write connectionString:process.env.DATABASE_URL
///in your .env you add DATABASE_URL=postgres://your_user_name:password@host:5432/your_database_name
app.use(express.json());

try {
  const result = await pool.query("SELECT NOW()");
  console.log("Database connected successfully!");
} catch (error) {
  console.error("Database connection failed:", error.message);
}
///YOU NAILED IT BUT I WILL SUGGEST YOU SOME BETTER VERSIIONS
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
    const body = req.body; /// THERE SHOULD BE VALIDATION LIKE if(!body.title || !body.description) {res.status(400).json({message:"invalid body"})}
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
app.get("/todos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id); ////gets id from url then converts to number

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const result = await pool.query("SELECT * FROM todos WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todos not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});
////
app.put("/todos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const body = req.body; /// here you also need validation 
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const result = await pool.query(
      "UPDATE todos SET title = $1, description = $2, completed = $3, updated_at = NOW() WHERE id = $4 RETURNING *",
      [body.title, body.description, body.completed, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todos not found " });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});///it is correct you even did it better 
///also you can make it dynamic for example if user only wwants to change one thing then change only this thing 
///you can ask ai for that it will be big help in the future
/////
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "server error" });
  }
});

//////
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


///OVERALL good job with this you learned core basics of backend 

