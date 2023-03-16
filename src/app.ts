import cors from "cors";
import dotenv from "dotenv";
import "express-async-errors";
import express from "express";
import error from "./middleware/error";
import scrapIsuzu from "./scrapper/isuzu";
import scrapBossTrucks from "./scrapper/bossTrucks";
import scrapAdtransHino from "./scrapper/adtransHino";
import scrapRobEquipment from "./scrapper/robEquipment";
import scrapSuttonTrucks from "./scrapper/suttonTrucks";
import scrapMidCoastTrucks from "./scrapper/midCoastTrucks";
import scrapTruckWholesalers from "./scrapper/truckWholesalers";
import scrapWesternTruckSales from "./scrapper/westernTruckSales";
import scrapMelbourneTruckAndVans from "./scrapper/melbourneTruckAndVans";
import scrapSammutAgriculturalMachinery from "./scrapper/sammutAgriculturalMachinery";
import scrapLarsensTruckSales from "./scrapper/larsensTruckSales";
import scrapWestarTruckCentre from "./scrapper/westarTruckCentre";
import scrapDaimlerTrucksPerth from "./scrapper/daimlerTrucksPerth";
import scrapVelocityTruckCentres from "./scrapper/velocityTruckCentres";
import scrapDaimlerTrucksMilperra from "./scrapper/daimlerTrucksMilperra";
import scrapWhiteHorseTruckCentre from "./scrapper/whiteHorseTruckCentre";
import scrapHumeHighwayTruckSales from "./scrapper/humeHighwayTruckSales";

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
// scrapAdtransHino();
scrapBossTrucks();
// scrapRobEquipment();
// scrapSuttonTrucks();
// scrapMidCoastTrucks();
// scrapTruckWholesalers();
// scrapWestarTruckCentre();
// scrapLarsensTruckSales();
// scrapWesternTruckSales();
// scrapDaimlerTrucksPerth();
// scrapHumeHighwayTruckSales();
// scrapDaimlerTrucksMilperra();
// scrapVelocityTruckCentres();
// scrapWhiteHorseTruckCentre();
// scrapMelbourneTruckAndVans();
// scrapSammutAgriculturalMachinery();

// Routes

// Error middleware - - Put after main routes
app.use(error);

// Run server
app.listen(PORT, () => console.log("Server started"));
