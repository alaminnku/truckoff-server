import { Schema, model } from "mongoose";

const truckSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    price: {
      type: String,
      trim: true,
    },
    year: {
      type: String,
      trim: true,
    },
    make: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    bodyType: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    kilometers: {
      type: String,
      trim: true,
    },
    gvm: {
      type: String,
      trim: true,
    },
    origin: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },

    images: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("Truck", truckSchema);
