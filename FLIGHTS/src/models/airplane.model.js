import mongoose from 'mongoose';

const airplaneSchema = new mongoose.Schema({
  modelNumber: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
},{timestamps:true});

export const Airplane = mongoose.model('Airplane', airplaneSchema);


