import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mail from "@sendgrid/mail";
import error from "./middleware/error";
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
import scrapMelbourneTruckAndVans from "./scrapper/melbourneTruckAndVans";
import scrapFusoPortMelbourne from "./scrapper/fusoPortMelbourne";
import scrapLarsensTruckSales from "./scrapper/larsensTruckSales";
import scrapWestarTruckCentre from "./scrapper/westarTruckCentre";
import scrapDaimlerTrucksPerth from "./scrapper/daimlerTrucksPerth";
import scrapVelocityTruckCentres from "./scrapper/velocityTruckCentres";
import scrapDaimlerTrucksMilperra from "./scrapper/daimlerTrucksMilperra";
import scrapWhiteHorseTruckCentre from "./scrapper/whiteHorseTruckCentre";
import scrapHumeHighwayTruckSales from "./scrapper/humeHighwayTruckSales";
import scrapGilbertAndRoachSydney from "./scrapper/gilbertAndRoachSydney";
import scrapDaimlerTrucksBrisbane from "./scrapper/daimlerTrucksBrisbane";
import scrapSammutAgriculturalMachinery from "./scrapper/sammutAgriculturalMachinery";

// Configs
dotenv.config();
mail.setApiKey(process.env.SENDGRID_API_KEY as string);

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
// scrapCtrTrucks();
// scrapTruckCity();
// scrapBossTrucks();
// scrapAdtransHino();
// scrapRobEquipment();
// scrapSuttonTrucks();
// scrapAdtransTrucks();
// scrapPrestigeIveco();
// scrapMidCoastTrucks();
// scrapUnionTruckSales();
// scrapTruckWholesalers();
// scrapFusoPortMelbourne();
// scrapWestarTruckCentre();
// scrapLarsensTruckSales();
// scrapWesternTruckSales();
// scrapDaimlerTrucksPerth();
// scrapVelocityTruckCentres();
// scrapDaimlerTrucksBrisbane();
// scrapGilbertAndRoachSydney();
// scrapHumeHighwayTruckSales();
// scrapDaimlerTrucksMilperra();
// scrapWhiteHorseTruckCentre();
// scrapMelbourneTruckAndVans();
// scrapSammutAgriculturalMachinery();

// Run server
app.listen(PORT, () => console.log("Server started"));
