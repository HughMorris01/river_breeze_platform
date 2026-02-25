import express from 'express';
import { createClient, getClients } from '../controllers/clientController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// The POST route is public, the GET route is protected by your JWT middleware
router.route('/')
  .post(createClient)
  .get(protect, getClients);

export default router;