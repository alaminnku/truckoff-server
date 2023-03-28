import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mail from "@sendgrid/mail";
import Truck from "./routes/truck";
import { connectDB } from "./config/db";
import scrapIsuzu from "./scrapper/isuzu";
import scrapTruckCity from "./scrapper/truckCity";
import scrapCtrTrucks from "./scrapper/ctrTrucks";
import scrapBossTrucks from "./scrapper/bossTrucks";
import scrapAdtransHino from "./scrapper/adtransHino";
import scrapRobEquipment from "./scrapper/robEquipment";
import scrapSuttonTrucks from "./scrapper/suttonTrucks";
import scrapPrestigeIveco from "./scrapper/prestigeIveco";
import scrapAdtransTrucks from "./scrapper/adtransTrucks";
import scrapMidCoastTrucks from "./scrapper/midCoastTrucks";
import scrapUnionTruckSales from "./scrapper/unionTruckSales";
import scrapTruckWholesalers from "./scrapper/truckWholesalers";
import scrapWesternTruckSales from "./scrapper/westernTruckSales";
import scrapFusoPortMelbourne from "./scrapper/fusoPortMelbourne";
import scrapLarsensTruckSales from "./scrapper/larsensTruckSales";
import scrapWestarTruckCentre from "./scrapper/westarTruckCentre";
import scrapDaimlerTrucksPerth from "./scrapper/daimlerTrucksPerth";
import scrapVelocityTruckCentres from "./scrapper/velocityTruckCentres";
import scrapDaimlerTrucksLaverton from "./scrapper/daimlerTrucksLaverton";
import scrapMelbourneTruckAndVans from "./scrapper/melbourneTruckAndVans";
import scrapDaimlerTrucksMilperra from "./scrapper/daimlerTrucksMilperra";
import scrapHumeHighwayTruckSales from "./scrapper/humeHighwayTruckSales";
import scrapGilbertAndRoachSydney from "./scrapper/gilbertAndRoachSydney";
import scrapDaimlerTrucksBrisbane from "./scrapper/daimlerTrucksBrisbane";
import scrapDaimlerTrucksDanenong from "./scrapper/daimlerTrucksDandenong";
import scrapSammutAgriculturalMachinery from "./scrapper/sammutAgriculturalMachinery";

// Configs
dotenv.config();
connectDB();
// process.setMaxListeners(0);
mail.setApiKey(process.env.SENDGRID_API_KEY as string);

// Create port
const PORT = process.env.PORT || 5300;

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

// // Run scrappers when the server starts
// (async function runScrappers() {
//   await scrapIsuzu();
//   await scrapCtrTrucks();
//   await scrapTruckCity();
//   await scrapBossTrucks();
//   await scrapAdtransHino();
//   await scrapRobEquipment();
//   await scrapSuttonTrucks();
//   await scrapAdtransTrucks();
//   await scrapPrestigeIveco();
//   await scrapMidCoastTrucks();
//   await scrapUnionTruckSales();
//   await scrapTruckWholesalers();
//   await scrapFusoPortMelbourne();
//   await scrapWestarTruckCentre();
//   await scrapLarsensTruckSales();
//   await scrapWesternTruckSales();
//   await scrapDaimlerTrucksPerth();
//   await scrapVelocityTruckCentres();
//   await scrapDaimlerTrucksBrisbane();
//   await scrapGilbertAndRoachSydney();
//   await scrapHumeHighwayTruckSales();
//   await scrapDaimlerTrucksMilperra();
//   await scrapDaimlerTrucksDanenong();
//   await scrapMelbourneTruckAndVans();
//   await scrapDaimlerTrucksLaverton();
//   await scrapSammutAgriculturalMachinery();
// })();

setTimeout(async () => {
  console.log("hello from time out");
  await scrapIsuzu();
  await scrapCtrTrucks();
  await scrapTruckCity();
  await scrapBossTrucks();
  await scrapAdtransHino();
  await scrapRobEquipment();
  await scrapSuttonTrucks();
  await scrapAdtransTrucks();
  await scrapPrestigeIveco();
  await scrapMidCoastTrucks();
  await scrapUnionTruckSales();
  await scrapTruckWholesalers();
  await scrapFusoPortMelbourne();
  await scrapWestarTruckCentre();
  await scrapLarsensTruckSales();
  await scrapWesternTruckSales();
  await scrapDaimlerTrucksPerth();
  await scrapVelocityTruckCentres();
  await scrapDaimlerTrucksBrisbane();
  await scrapGilbertAndRoachSydney();
  await scrapHumeHighwayTruckSales();
  await scrapDaimlerTrucksMilperra();
  await scrapDaimlerTrucksDanenong();
  await scrapMelbourneTruckAndVans();
  await scrapDaimlerTrucksLaverton();
  await scrapSammutAgriculturalMachinery();
}, 1000 * 5);

// Run scrappers in every 3 days
setInterval(async () => {
  await scrapIsuzu();
  await scrapCtrTrucks();
  await scrapTruckCity();
  await scrapBossTrucks();
  await scrapAdtransHino();
  await scrapRobEquipment();
  await scrapSuttonTrucks();
  await scrapAdtransTrucks();
  await scrapPrestigeIveco();
  await scrapMidCoastTrucks();
  await scrapUnionTruckSales();
  await scrapTruckWholesalers();
  await scrapFusoPortMelbourne();
  await scrapWestarTruckCentre();
  await scrapLarsensTruckSales();
  await scrapWesternTruckSales();
  await scrapDaimlerTrucksPerth();
  await scrapVelocityTruckCentres();
  await scrapDaimlerTrucksBrisbane();
  await scrapGilbertAndRoachSydney();
  await scrapHumeHighwayTruckSales();
  await scrapDaimlerTrucksMilperra();
  await scrapDaimlerTrucksDanenong();
  await scrapMelbourneTruckAndVans();
  await scrapDaimlerTrucksLaverton();
  await scrapSammutAgriculturalMachinery();
}, 1000 * 60 * 60 * 24 * 3);

// Routes
app.use("/trucks", Truck);

// Run server
app.listen(PORT, () => console.log("Server started"));
