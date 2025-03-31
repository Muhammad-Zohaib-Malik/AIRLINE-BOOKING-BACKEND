import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  airplaneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Airplane",
    required: true,
  },
  row: {
    type: Number,
    required: true,
  },
  column: {
    type: String,
    required: true,
  },  
  classType: {
    type: String,
    enum: ["Economy", "Business"],
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

export const Seat = mongoose.model("Seat", seatSchema);