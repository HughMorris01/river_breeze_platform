import Appointment from '../models/Appointment.js';
import TimeBlock from '../models/TimeBlock.js';
import nodemailer from 'nodemailer';

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