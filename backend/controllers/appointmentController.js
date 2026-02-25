import Appointment from '../models/Appointment.js';

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Public (Allows the frontend calculator to book jobs)
export const createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: 'Invalid appointment data', error: error.message });
  }
};

// @desc    Get all appointments with client details
// @route   GET /api/appointments
// @access  Private (Requires Admin JWT)
export const getAppointments = async (req, res) => {
  try {
    // .populate() pulls in the associated client document so Katherine can see who the job is for
    const appointments = await Appointment.find({}).populate('client', 'name email phone address');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching appointments', error: error.message });
  }
};