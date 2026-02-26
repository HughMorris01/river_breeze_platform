import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import Routes
import adminRoutes from './routes/adminRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js'
import availabilityRoutes from './routes/availabilityRoutes.js';

dotenv.config();
connectDB();
const app = express();

app.use(helmet()); 
app.use(morgan('dev')); 
app.use(cors()); 
app.use(express.json()); 

app.use('/api/admin', adminRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/availability', availabilityRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running smoothly.' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});