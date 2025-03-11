import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: [true, "Flight number is required"],
    unique: true,
    trim: true
  },
  airplaneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Airplane',
    required: [true, "Airplane ID is required"]
  },
  departureTime: {
    type: Date,
    required: [true, "Departure time is required"]
  },
  arrivalTime: {
    type: Date,
    required: [true, "Arrival time is required"]
  },
   departureAirportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Airport',
    required: [true, "Departure airport is required"]
  },
  arrivalAirportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Airport',
    required: [true, "Arrival airport is required"]
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [1, "Price must be a positive number"]
  },
  boardingGate: {
    type: String,
    trim: true,
    match: [/^[A-Za-z0-9]+$/, "Boarding gate must be alphanumeric"]
  },
  totalSeats: {
    type: Number,
    required: [true, "Total seats are required"],
    min: [1, "Total seats must be a positive number"]
  }
}, { timestamps: true }); 

export const Flight = mongoose.model('Flight', flightSchema);
