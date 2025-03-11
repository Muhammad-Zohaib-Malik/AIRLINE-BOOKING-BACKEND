import mongoose from 'mongoose';

const airportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Airport name is required"],
    trim: true,
    unique: true
  },
  code: {
    type: String,
    required: [true, "Airport code is required"],
    unique: true,
    trim: true,
    uppercase: true, 
    minlength: [3, "Airport code must be at least 3 characters"],
    maxlength: [4, "Airport code must be at most 4 characters"]
  },
  city: {
   type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: [true, "City ID is required"]
  },
  address: {  
    type: String,
    required: [true, "Airport address is required"],
    trim: true
  },
}, { timestamps: true });

export const Airport = mongoose.model('Airport', airportSchema);
