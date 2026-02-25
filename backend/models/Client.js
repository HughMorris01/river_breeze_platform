import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  
  // Base Dimensions
  squareFootage: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  
  // New Property Modifiers
  additionalRooms: { 
    type: Number, 
    default: 0 // Offices, dens, playrooms, etc.
  },
  hasPets: { 
    type: Boolean, 
    default: false // Triggers the pet hair/dander labor modifier
  },
}, { 
  timestamps: true 
});

const Client = mongoose.model('Client', clientSchema);

export default Client;