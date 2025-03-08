import mongoose from 'mongoose'

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
    unique: true
  },
  airplaneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Airplane',
    required: true
  },
  departureAirportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Airport',
    required: true
  },
  arrivalAirportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Airport',
    required: true
  },
  departureTime: {
    type: Date,
    required: true
  },
  arrivalTime: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  boardingGate: {
    type: String,
  },
  totalSeats: {
    type: Number,
    required: true
  }
});

export const Flight = mongoose.model('Flight', flightSchema);

