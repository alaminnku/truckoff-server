import Truck from "../models/truck";
import express, { Request, Response } from "express";

// Initialize router
const router = express.Router();

// Get all trucks
router.get("/", async (req: Request, res: Response) => {
  try {
    const trucks = await Truck.find();

    res.status(200).json(trucks);
  } catch (err) {
    console.log(err);
  }
});

export default router;
