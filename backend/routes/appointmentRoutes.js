import express from 'express';
import { createAppointment, getAppointments } from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createAppointment)
  .get(protect, getAppointments);

export default router;