import express from "express";
import "dotenv/config";
import Stripe from "stripe";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS so frontend can call backend
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Root route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is healthy!" });
});

// CREATE PAYMENT INTENT
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body; // Amount in cents

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd", // Change currency if needed
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
