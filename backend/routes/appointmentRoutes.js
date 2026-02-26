import express from 'express';
import { createAppointment, getAppointments, confirmAppointment, cancelAppointment, completeAppointment} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createAppointment)
  .get(protect, getAppointments);

router.put('/:id/confirm', protect, confirmAppointment);
router.put('/:id/cancel', protect, cancelAppointment);   
router.put('/:id/complete', protect, completeAppointment);



export default router;