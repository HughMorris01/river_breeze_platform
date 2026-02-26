import express from 'express';
import { 
  addTimeBlock, 
  getAvailableBlocks, 
  deleteTimeBlock 
} from '../controllers/availabilityController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Public route for clients picking a date
router.get('/', getAvailableBlocks);

// Protected routes for Katherine's admin dashboard
router.post('/', protect, addTimeBlock);
router.delete('/:id', protect, deleteTimeBlock);

export default router;