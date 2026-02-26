// backend/models/Shift.js
import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
  date: { 
    type: Date, 
    required: true 
  },
  startTime: { 
    type: String, 
    required: true // e.g., "09:00"
  },
  endTime: { 
    type: String, 
    required: true // e.g., "15:00"
  }
}, { timestamps: true });

export default mongoose.model('Shift', shiftSchema);