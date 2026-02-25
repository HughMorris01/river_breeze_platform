import express from 'express';
import { authAdmin } from '../controllers/adminController.js';

const router = express.Router();

// Route: POST /api/admin/login
router.post('/login', authAdmin);

export default router;