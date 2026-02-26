import express from 'express';
import { getAvailability, getShifts, addShift, deleteShift } from '../controllers/availabilityController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Public route for the Booking Calendar engine
router.get('/', getAvailability);

// Protected Admin routes for managing raw Shifts
router.get('/shifts', protect, getShifts);
router.post('/', protect, addShift);
router.delete('/:id', protect, deleteShift);

export default router;