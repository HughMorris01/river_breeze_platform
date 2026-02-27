import express from 'express';
import { createClient, getClients, verifyClient, archiveClient } from '../controllers/clientController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// The POST route is public, the GET route is protected JWT middleware
router.route('/')
  .post(createClient)
  .get(protect, getClients);


// The Returning Client Verification endpoint
router.post('/verify', verifyClient);

// The Archive Client endpoint (soft delete)
router.put('/:id/archive', protect, archiveClient);

export default router;