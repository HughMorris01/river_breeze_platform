import Appointment from '../models/Appointment.js';
import Shift from '../models/Shift.js';

// @desc    Create a new appointment with real-time availability validation
// @route   POST /api/appointments
// @body    {string} client, {string} serviceType, {Array} addOns, {number} quotedPrice, {string} date, {string} startTime, {string} endTime, {number} estimatedHours
// @access  Public
// @note    Includes a security check to verify the shift still exists and no double-booking has occurred (including travel buffers).
export const createAppointment = async (req, res) => {
  try {
    const { client, serviceType, addOns, quotedPrice, date, startTime, endTime, estimatedHours, clientNotes } = req.body;

    // --- REAL-TIME SECURITY CHECK ---
    const apptDate = new Date(date);
    apptDate.setHours(0,0,0,0);
    const nextDay = new Date(apptDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const toMins = (t) => { const [h,m] = t.split(':').map(Number); return h*60+m; };
    const apptStartMins = toMins(startTime);
    const apptEndMins = toMins(endTime);

    // 1. Does Kate still have a shift that covers this exact time?
    const shifts = await Shift.find({ date: { $gte: apptDate, $lt: nextDay } });
    const validShift = shifts.find(s => toMins(s.startTime) <= apptStartMins && toMins(s.endTime) >= apptEndMins);

    if (!validShift) {
      return res.status(400).json({ message: 'Kate recently updated her schedule and this time is no longer available.' });
    }

    // 2. Did someone else literally just book this exact slot? (Includes 30 min travel buffer!)
    const existingAppts = await Appointment.find({
      date: { $gte: apptDate, $lt: nextDay },
      status: { $in: ['Pending', 'Confirmed'] }
    });

    const hasOverlap = existingAppts.some(a => {
      const extStart = toMins(a.startTime);
      const extEnd = toMins(a.endTime) + 30; // The travel buffer!
      return (apptStartMins < extEnd && apptEndMins > extStart);
    });

    if (hasOverlap) {
      return res.status(400).json({ message: 'This time slot was just booked by someone else. Please select another time.' });
    }
    // --- END SECURITY CHECK ---

    const appointment = await Appointment.create({
      client,
      serviceType,
      addOns,
      quotedPrice,
      status: 'Pending',
      date,
      startTime,
      endTime,
      estimatedHours,
      clientNotes
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server error during booking' });
  }
};

// @desc    Get all appointments with populated client details
// @route   GET /api/appointments
// @access  Private/Admin
// @return  {Array} List of all appointment documents with nested client data
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({}).populate('client');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching appointments', error: error.message });
  }
};

// @desc    Update appointment status to 'Confirmed'
// @route   PUT /api/appointments/:id/confirm
// @access  Private/Admin
export const confirmAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
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

// @desc    Update appointment status to 'Canceled'
// @route   PUT /api/appointments/:id/cancel
// @access  Private/Admin
// @note    The availability engine automatically ignores canceled jobs, instantly freeing the time slot for new bookings.
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Mark as canceled. The smart engine will now automatically ignore it and free the time!
    appointment.status = 'Canceled';
    await appointment.save();

    res.json({ message: 'Appointment canceled and time slot freed.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during cancellation' });
  }
};

// @desc    Complete an appointment
// @route   PUT /api/appointments/:id/complete
// @access  Private/Admin
export const completeAppointment = async (req, res) => {
  try {
    const { adminNotes } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.status = 'Completed';
    if (adminNotes) appointment.adminNotes = adminNotes;
    await appointment.save();

    res.json({ message: 'Appointment marked as completed.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during completion' });
  }
};