import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "./index.js";

describe("Expense Tracker API", () => {
  it("GET /api/health should return API status", async () => {
    const response = await request(app)
      .get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("OK");
  });

  it("GET /api/expenses should return an array", async () => {
    const response = await request(app)
      .get("/api/expenses");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("POST /api/expenses should create an expense", async () => {
    const response = await request(app)
      .post("/api/expenses")
      .send({
        title: "Test Expense",
        amount: 25.50,
        category: "Testing",
        date: "2026-10-01",
        description: "Automated test expense"
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("Test Expense");
    expect(response.body.amount).toBe(25.5);
  });

  it("POST /api/expenses should reject incomplete data", async () => {
    const response = await request(app)
      .post("/api/expenses")
      .send({
        title: "Incomplete Expense"
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Title, amount, category and date are required"
    );
  });

  it("DELETE /api/expenses/:id should return 404 for a missing expense", async () => {
    const response = await request(app)
      .delete("/api/expenses/999999");

    expect(response.status).toBe(404);
  });
});