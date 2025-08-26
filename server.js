// server.js
require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const Stripe = require("stripe");

// --- Setup App ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate Limiting (optional)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// --- Database Setup ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Make sure you set this in Railway
  ssl: { rejectUnauthorized: false }, // For PostgreSQL on Railway
});

// --- Stripe Setup ---
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// --- Routes Example ---
app.get("/", (req, res) => {
  res.send("EhiPay Backend is running!");
});

// Add more routes here
// Example: app.post("/payment", async (req, res) => { ... });

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
