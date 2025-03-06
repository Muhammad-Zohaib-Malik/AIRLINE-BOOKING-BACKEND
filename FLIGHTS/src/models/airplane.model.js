import mongoose from 'mongoose';

const airplaneSchema = new mongoose.Schema({
  airLine: {
    type: String,
    required: true,
    trim: true
  },
  modelNumber: {
    type: String,
    required: true,
    trim: true
  },
  seatingCapacity: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }
}, { timestamps: true });

export const Airplane = mongoose.model('Airplane', airplaneSchema);


