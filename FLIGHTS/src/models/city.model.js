import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "City name is required"],
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const City = mongoose.model("City", citySchema);
