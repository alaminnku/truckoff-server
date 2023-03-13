import express from "express";
import cors from "cors";
import error from "./middleware/error";

// Create port
const PORT = process.env.PORT || 5300;

// Connect database

// Create app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

// Routes

// Error middleware - - Put after main routes
app.use(error);

// Run server
app.listen(PORT, () => console.log("Server started"));
