// backend/seeder.js
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Admin from './models/Admin.js';
import admins from './data/adminData.js';
import TimeBlock from './models/TimeBlock.js'; // Make sure this path is correct!

dotenv.config();
connectDB();

// Isolated function just for Admin data
const importAdminData = async () => {
  try {
    await Admin.deleteMany();

    for (const admin of admins) {
      await Admin.create(admin);
    }

    console.log('🟢 Admin Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`🔴 Error importing admin data: ${error.message}`);
    process.exit(1);
  }
};

// NEW: Isolated function for Availability data
const importAvailabilityData = async () => {
  try {
    await TimeBlock.deleteMany();
    console.log('🟡 Old TimeBlocks cleared.');

    const timeBlocks = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Loop through the next 7 days
    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);

      // Morning Block
      timeBlocks.push({ date: targetDate, startTime: '09:00', endTime: '11:00', isBooked: false });
      // Afternoon Block
      timeBlocks.push({ date: targetDate, startTime: '14:00', endTime: '16:00', isBooked: false });
    }

    await TimeBlock.insertMany(timeBlocks);
    console.log('🟢 7 Days of Availability Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`🔴 Error importing availability data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Admin.deleteMany();
    await TimeBlock.deleteMany(); // Clear this too when destroying
    console.log('🔴 All Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`🔴 Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

// The Switchboard
if (process.argv[2] === '-d') {
  destroyData();
} else if (process.argv[2] === '-admin') {
  importAdminData();
} else if (process.argv[2] === '-availability') {
  importAvailabilityData();
} else {
  console.log('🟡 Please specify a flag (e.g., -admin, -availability, or -d)');
  process.exit();
}