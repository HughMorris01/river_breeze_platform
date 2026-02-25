import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Client', // This tells Mongoose to look in the Client collection for this ID
  },
  serviceType: {
    type: String,
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: false, // Optional right now in case they just want a quote first
  },
  quotedPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'Pending',
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], // Restricts the status to these specific words
  }
}, { 
  timestamps: true 
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;