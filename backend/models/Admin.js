// backend/models/Admin.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { 
  timestamps: true 
});

// --- Security Methods ---

// 1. Compare entered password to the hashed database password
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 2. Hash the password automatically before saving to the database
adminSchema.pre('save', async function (next) {
  // If the password hasn't been changed, skip the hashing process
  if (!this.isModified('password')) {
    next();
  }

  // Generate a salt and hash the plain text password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;