import mongoose from "mongoose";

const flightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    airplaneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Airplane",
      required: true,
    },
    departureTime: { type: Date, required: true },
    arrivalTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return this.departureTime < value;
        },
        message: "Arrival time must be after departure time",
      },
    },
    departureAirportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Airport",
      required: true,
    },
    arrivalAirportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Airport",
      required: true,
    },
    price: {
      economy: { type: Number, required: true, min: 1 },
      business: { type: Number, required: true, min: 1 },
    },
    tripType: { type: String, enum: ["ONE_WAY", "ROUND_TRIP"], required: true },
    boardingGate: {
      type: String,
      trim: true,
      match: [/^[A-Za-z0-9]+$/, "Boarding gate must be alphanumeric"],
    },
    totalSeats: {
      economy: { type: Number, required: true, min: 1 },
      business: { type: Number, required: true, min: 1 },
    },
    isInternational: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

flightSchema.index({ departureAirportId: 1, arrivalAirportId: 1 });
flightSchema.index({ "price.economy": 1, "price.business": 1 });
flightSchema.index({ departureTime: 1 });
flightSchema.index({ tripType: 1 });
flightSchema.index({ isInternational: 1 });

export const Flight = mongoose.model("Flight", flightSchema);
