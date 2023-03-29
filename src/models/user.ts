import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide a name"],
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "Please provide a phone"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Please provide an email"],
    },
    business: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

export default model("user", userSchema);
