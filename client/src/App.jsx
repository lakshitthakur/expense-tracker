import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5001/api";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: "",
    description: "",
  });

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses`);
      setExpenses(response.data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title || !form.amount || !form.date) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await axios.post(`${API_URL}/expenses`, {
        ...form,
        amount: Number(form.amount),
      });

      setForm({
        title: "",
        amount: "",
        category: "Food",
        date: "",
        description: "",
      });

      fetchExpenses();
    } catch (error) {
      console.error("Failed to add expense:", error);
      alert("Failed to add expense.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.error("Failed to delete expense:", error);
      alert("Failed to delete expense.");
    }
  };

  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = expense.category;

    if (!acc[category]) {
      acc[category] = 0;
    }

    acc[category] += Number(expense.amount);

    return acc;
  }, {});

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="eyebrow">PERSONAL FINANCE</p>
          <h1>Expense Tracker</h1>
          <p className="subtitle">
            Track your spending and understand where your money goes.
          </p>
        </div>
      </header>

      <main className="container">
        <section className="summary-grid">
          <div className="summary-card">
            <span>Total Spending</span>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <div className="summary-card">
            <span>Total Expenses</span>
            <strong>{expenses.length}</strong>
          </div>

          <div className="summary-card">
            <span>Categories</span>
            <strong>{Object.keys(categoryTotals).length}</strong>
          </div>
        </section>

        <section className="content-grid">
          <div className="card">
            <h2>Add Expense</h2>

            <form onSubmit={handleSubmit}>
              <label>
                Title
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Groceries"
                  value={form.title}
                  onChange={handleChange}
                />
              </label>

              <label>
                Amount
                <input
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={handleChange}
                />
              </label>

              <label>
                Category
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Bills">Bills</option>
                  <option value="Health">Health</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label>
                Date
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  placeholder="Optional description"
                  value={form.description}
                  onChange={handleChange}
                />
              </label>

              <button type="submit">Add Expense</button>
            </form>
          </div>

          <div className="card">
            <div className="section-heading">
              <div>
                <h2>Expense History</h2>
                <p>Your recent expenses</p>
              </div>
            </div>

            {loading ? (
              <p className="empty">Loading expenses...</p>
            ) : expenses.length === 0 ? (
              <p className="empty">No expenses recorded yet.</p>
            ) : (
              <div className="expense-list">
                {expenses.map((expense) => (
                  <div className="expense-item" key={expense.id}>
                    <div className="expense-main">
                      <div>
                        <h3>{expense.title}</h3>
                        <p>
                          {expense.category} • {expense.date}
                        </p>

                        {expense.description && (
                          <small>{expense.description}</small>
                        )}
                      </div>

                      <div className="expense-actions">
                        <strong>${Number(expense.amount).toFixed(2)}</strong>

                        <button
                          className="delete-button"
                          onClick={() => handleDelete(expense.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="card">
          <h2>Spending by Category</h2>

          {Object.keys(categoryTotals).length === 0 ? (
            <p className="empty">No category data available.</p>
          ) : (
            <div className="category-grid">
              {Object.entries(categoryTotals).map(([category, amount]) => (
                <div className="category-card" key={category}>
                  <span>{category}</span>
                  <strong>${amount.toFixed(2)}</strong>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;