import cors from "cors";
import dotenv from "dotenv";
import "express-async-errors";
import express from "express";
import error from "./middleware/error";
import scrapTruckWholesalers from "./scrapper/truckWholesalers";
import scrapSammutAgriculturalMachinery from "./scrapper/sammutAgriculturalMachinery";
import scrapIsuzu from "./scrapper/isuzu";
import scrapSuttonTrucks from "./scrapper/suttonTrucks";

// Config
dotenv.config();

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

// Scrappers

// scrapIsuzu();
// scrapSuttonTrucks();
// scrapTruckWholesalers();
// scrapSammutAgriculturalMachinery();

// Routes

// Error middleware - - Put after main routes
app.use(error);

// Run server
app.listen(PORT, () => console.log("Server started"));
