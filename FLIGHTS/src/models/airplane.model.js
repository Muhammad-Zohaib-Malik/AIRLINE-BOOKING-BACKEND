import mongoose from "mongoose";

const airplaneSchema = new mongoose.Schema(
  {
    airLine: {
      type: String,
      required: [true, "Airline name is required"],
      trim: true,
    },
    modelNumber: {
      type: String,
      required: [true, "Model number is required"],
      trim: true,
      unique: true,
      match: [
        /^[A-Z0-9-]+$/i,
        "Model number can only contain letters, numbers, and hyphens",
      ],
    },
    seatingCapacity: {
      type: Number,
      required: [true, "Seating capacity is required"],
      min: [1, "Seating capacity must be at least 1"],
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        message: "Status must be either 'active' or 'inactive'",
      },
      default: "active",
    },
  },
  { timestamps: true }
);

export const Airplane = mongoose.model("Airplane", airplaneSchema);
