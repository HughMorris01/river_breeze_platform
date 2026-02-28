// backend/models/Appointment.js
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true 
  },
  serviceType: { 
    type: String, 
    required: true 
  },
  addOns: [{ 
    type: String 
  }],
  quotedPrice: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Completed', 'Canceled'], 
    default: 'Pending' 
  },
  
  // --- NEW TEMPORAL FOOTPRINT ---
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true // e.g., "09:30"
  },
  endTime: {
    type: String,
    required: true // e.g., "11:30"
  },
  estimatedHours: {
    type: Number,
    required: true // e.g., 2.0 (Crucial for calculating the Anchor Rule)
  },
  clientNotes: {
    type: String,
    default: ''
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);