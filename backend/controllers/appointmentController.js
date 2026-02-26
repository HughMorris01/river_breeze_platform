import Appointment from '../models/Appointment.js';
import TimeBlock from '../models/TimeBlock.js';
import nodemailer from 'nodemailer';

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Public (Allows the frontend calculator to book jobs)
export const createAppointment = async (req, res) => {
  try {
    const { client, serviceType, addOns, quotedPrice, timeBlock } = req.body;

    // 1. Race Condition Check: Verify the block still exists and is currently open
    const block = await TimeBlock.findById(timeBlock);
    
    if (!block) {
      return res.status(404).json({ message: 'Time slot not found.' });
    }
    
    if (block.isBooked) {
      return res.status(400).json({ 
        message: 'This time slot was just booked by someone else. Please select another.' 
      });
    }

    // 2. Create the Pending Appointment
    const appointment = await Appointment.create({
      client,
      timeBlock,
      serviceType,
      addOns,
      quotedPrice,
      status: 'Pending'
    });

    // 3. Instantly lock the TimeBlock so it drops off the public calendar
    block.isBooked = true;
    await block.save();

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server error during booking' });
  }
};

// @desc    Get all appointments with client details
// @route   GET /api/appointments
// @access  Private (Requires Admin JWT)
export const getAppointments = async (req, res) => {
  try {
    // .populate() pulls in the associated client document so Katherine can see who the job is for
    const appointments = await Appointment.find({}).populate('client').populate('timeBlock');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching appointments', error: error.message });
  }
};

export const confirmAppointment = async (req, res) => {
  try {
    // 1. Find the appointment and populate the client data (so we have their email)
    const appointment = await Appointment.findById(req.params.id).populate('client');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // 2. Update the appointment status
    appointment.status = 'Confirmed';
    await appointment.save();

    // 3. Mark the associated TimeBlock as booked so it disappears from the calendar
    if (appointment.timeBlock) {
      await TimeBlock.findByIdAndUpdate(appointment.timeBlock, { isBooked: true });
    }

    // 4. Fire off the automated email
    // NOTE: You will need to replace user/pass with an actual SMTP provider like Gmail App Passwords or SendGrid
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,  
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: appointment.client.email,
      subject: 'Your Cleaning Appointment is Confirmed! - River Breeze',
      text: `Hi ${appointment.client.name},\n\nGreat news! Kate has confirmed your ${appointment.serviceType} appointment.\n\nTo help us provide the best service, please ensure all loose items (toys, clothing, dishes) are picked up prior to arrival, and pets are safely secured.\n\nWe look forward to seeing you!\n\n- The River Breeze Team`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailErr) {
      console.log('Database updated, but email failed to send (check .env credentials):', emailErr.message);
    }

    res.json({ message: 'Appointment confirmed and email sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during confirmation' });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // 1. Mark the appointment as canceled
    appointment.status = 'Canceled';
    await appointment.save();

    // 2. Free up the time slot on the public calendar
    if (appointment.timeBlock) {
      await TimeBlock.findByIdAndUpdate(appointment.timeBlock, { isBooked: false });
    }

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

    // Mark the appointment as successfully completed
    appointment.status = 'Completed';
    await appointment.save();

    res.json({ message: 'Appointment marked as completed.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during completion' });
  }
};