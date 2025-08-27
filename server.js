import express from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is healthy!" });
});

// Example API route
app.get("/api", (req, res) => {
  res.json({
    status: "ok",
    message: "This is the API endpoint. Add your routes here!"
  });
});

// Catch-all for unknown routes (returns 404)
app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started, listening on port ${PORT}`);
});
