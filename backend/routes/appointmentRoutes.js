import express from 'express';
import { createAppointment, getAppointments, confirmAppointment } from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createAppointment)
  .get(protect, getAppointments);

  // This has a unique path, so it stands alone
router.put('/:id/confirm', protect, confirmAppointment);


export default router;