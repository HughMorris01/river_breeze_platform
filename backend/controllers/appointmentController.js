// backend/controllers/appointmentController.js
import Appointment from '../models/Appointment.js';

export const createAppointment = async (req, res) => {
  try {
    // 1. Unpack the new temporal data from the request
    const { client, serviceType, addOns, quotedPrice, date, startTime, endTime, estimatedHours } = req.body;

    // 2. Create the Appointment with its own exact time boundaries
    const appointment = await Appointment.create({
      client,
      serviceType,
      addOns,
      quotedPrice,
      status: 'Pending',
      date,
      startTime,
      endTime,
      estimatedHours
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server error during booking' });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({}).populate('client');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching appointments', error: error.message });
  }
};

export const confirmAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('client');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.status = 'Confirmed';
    await appointment.save();

    res.json({ message: 'Appointment confirmed' });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error during confirmation' });
    }
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Mark as canceled. The Availability Engine will now automatically 
    // ignore this appointment and free up the space on the public calendar!
    appointment.status = 'Canceled';
    await appointment.save();

    res.json({ message: 'Appointment canceled and time slot freed.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during cancellation' });
  }
};

export const completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.status = 'Completed';
    await appointment.save();

    res.json({ message: 'Appointment marked as completed.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during completion' });
  }
};