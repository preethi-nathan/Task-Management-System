const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let connection;

async function setupDatabase() {
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "preethi123",
      database: "task_management"
    });

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Database connected!");
  } catch (error) {
    console.error("Database error:", error.message);
    process.exit(1);
  }
}

app.get("/health", (req, res) => {
  res.json({ message: "Server is working!" });
});

app.post("/api/tasks", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description required" });
    }

    if (typeof title !== "string" || typeof description !== "string") {
      return res.status(400).json({ error: "Must be text" });
    }

    const t = title.trim();
    const d = description.trim();

    if (!t || !d) {
      return res.status(400).json({ error: "Cannot be empty" });
    }

    if (t.length > 100 || d.length > 1000) {
      return res.status(400).json({ error: "Text too long" });
    }

    const [result] = await connection.execute(
      "INSERT INTO tasks (title, description) VALUES (?, ?)",
      [t, d]
    );

    res.status(201).json({
      id: result.insertId,
      title: t,
      description: d,
      status: "pending"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/tasks", async (req, res) => {
  try {
    const [tasks] = await connection.execute(
      "SELECT * FROM tasks ORDER BY created_at DESC"
    );
    res.json({ tasks, count: tasks.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.patch("/api/tasks/:id/status", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!id || id <= 0) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    if (!status) {
      return res.status(400).json({ error: "Status required" });
    }

    const allowed = ["pending", "in_progress", "completed"];
    const s = status.trim().toLowerCase();

    if (!allowed.includes(s)) {
      return res.status(400).json({ error: `Use: ${allowed.join(", ")}` });
    }

    const [result] = await connection.execute(
      "UPDATE tasks SET status = ? WHERE id = ?",
      [s, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const [tasks] = await connection.execute(
      "SELECT * FROM tasks WHERE id = ?",
      [id]
    );

    res.json(tasks[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || id <= 0) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const [result] = await connection.execute(
      "DELETE FROM tasks WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Deleted!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

setupDatabase();

app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
