import Truck from "../models/truck";
import express, { Request, Response } from "express";

// Initialize router
const router = express.Router();

// Get all trucks
router.get("/", async (req: Request, res: Response) => {
  try {
    // Make request to db
    const response = await Truck.find()
      .select("-__v -updatedAt -website")
      .lean()
      .orFail();
    // .limit(100);

    // Filter trucks
    const trucks = response.filter(
      (truck) =>
        truck.name &&
        truck.price &&
        truck.location &&
        !isNaN(+truck.price) &&
        truck.name.length > 5 &&
        truck.images.length > 0
    );

    // Return the response
    res.status(200).json(trucks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get all trucks" });
  }
});

export default router;
