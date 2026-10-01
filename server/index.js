const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const db = new Database("expenses.db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT
  )
`).run();

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Expense Tracker API is running"
  });
});

app.get("/api/expenses", (req, res) => {
  const expenses = db
    .prepare("SELECT * FROM expenses ORDER BY date DESC")
    .all();

  res.json(expenses);
});

app.post("/api/expenses", (req, res) => {
  const { title, amount, category, date, description } = req.body;

  if (!title || !amount || !category || !date) {
    return res.status(400).json({
      error: "Title, amount, category and date are required"
    });
  }

  const result = db.prepare(`
    INSERT INTO expenses
    (title, amount, category, date, description)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    title,
    amount,
    category,
    date,
    description || ""
  );

  const expense = db
    .prepare("SELECT * FROM expenses WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json(expense);
});

app.delete("/api/expenses/:id", (req, res) => {
  const result = db
    .prepare("DELETE FROM expenses WHERE id = ?")
    .run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Expense not found"
    });
  }

  res.json({
    message: "Expense deleted successfully"
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Expense Tracker API running on port ${PORT}`);
  });
}

module.exports = app;
