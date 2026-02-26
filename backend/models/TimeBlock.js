import mongoose from 'mongoose';

const timeBlockSchema = new mongoose.Schema({
  date: { 
    type: Date, 
    required: true 
  },
  startTime: { 
    type: String, 
    required: true 
  }, // Format expected: "09:00" or "14:00"
  endTime: { 
    type: String, 
    required: true 
  }, // Will be auto-calculated in the controller
  isBooked: { 
    type: Boolean, 
    default: false 
  },
  // Links this block to a specific appointment once a client books it
  appointment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Appointment', 
    default: null 
  }
}, { timestamps: true });

export default mongoose.model('TimeBlock', timeBlockSchema);