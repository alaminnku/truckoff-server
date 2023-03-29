import User from "../models/user";
import express, { Request, Response } from "express";

// Initialize router
const router = express.Router();

router.post("/create", async (req: Request, res: Response) => {
  // Destructure req body
  const { name, phone, email, business } = req.body;

  // If required data isn't provide
  if (!name || !phone || !email) {
    return res
      .status(400)
      .json({ status: "failed", message: "Please provide all fields" });
  }

  try {
    // Create user
    await User.create({ name, phone, email, business: business || undefined });

    // Return the success response
    res
      .status(200)
      .json({ status: "success", message: "Successfully submitted" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ status: "failed", message: "Something wen't wrong" });
  }
});

export default router;
