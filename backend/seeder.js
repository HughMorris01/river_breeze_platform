// backend/seeder.js
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { seedClients } from './data/clients.js';
import { seedAvailability } from './data/availability.js';
import { seedAppointments } from './data/appointments.js';

dotenv.config();
connectDB();

const runDataImport = async () => {
  try {
    await seedAvailability();
    await seedAppointments();
    console.log('✅ Master Import Complete!');
    process.exit();
  } catch (error) {
    console.error('🔴 Import Failed:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-clients') {
  seedClients().then(() => process.exit());
} else if (process.argv[2] === '-import') {
  runDataImport();
} else {
  console.log('🟡 Please specify a flag (-clients or -import)');
  process.exit();
}