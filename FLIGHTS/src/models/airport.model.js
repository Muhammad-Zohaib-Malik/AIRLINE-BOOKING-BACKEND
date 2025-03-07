import mongoose from 'mongoose';

const airportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export const Airport = mongoose.model('Airport', airportSchema);
