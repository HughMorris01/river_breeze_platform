// backend/models/Appointment.js
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Client', 
  },
  timeBlock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TimeBlock',
      required: true,
    },
  serviceType: {
    type: String,
    required: true,
  },
  
  // New Add-Ons Array
  addOns: [
    { type: String }
  ],
  
  appointmentDate: {
    type: Date,
    required: false, 
  },
  quotedPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'Pending',
    enum: ['Pending', 'Confirmed', 'Completed', 'Canceled'], 
  }
}, { 
  timestamps: true 
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;