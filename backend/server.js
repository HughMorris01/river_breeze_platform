// backend/server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Note the .js extension here!
import connectDB from './config/db.js'; 

dotenv.config();

connectDB();

const app = express();

app.use(helmet()); 
app.use(morgan('dev')); 
app.use(cors()); 
app.use(express.json()); 

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running smoothly.' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});