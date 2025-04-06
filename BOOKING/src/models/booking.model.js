import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    flightId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flight",
      required: true,
    },
    userId: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "User",
      // required: true,
      type:String
    },
    status: {
      type: String,
      enum: ["Confirmed", "Pending", "Initiated", "Cancelled"],
      default: "Initiated",
    },
    noOfSeats: {
      type: Number,
      required: true,
      default: 1,
    },
    seatClass: {
      type: String,
      enum: ["economy", "business"],
      required: true,
    },
    totalCost: {
      type: Number,
      // required: true,
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", BookingSchema);
