// backend/seeder.js
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Admin from './models/Admin.js';
import TimeBlock from './models/TimeBlock.js';
import Client from './models/Client.js';
import Appointment from './models/Appointment.js';
import admins from './data/adminData.js';

dotenv.config();
connectDB();

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

const importAvailabilityData = async () => {
  try {
    await TimeBlock.deleteMany();
    console.log('🟡 Old TimeBlocks cleared.');

    const timeBlocks = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);

      timeBlocks.push({ date: targetDate, startTime: '09:00', endTime: '11:00', isBooked: false });
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

// NEW: Function to seed fake booked appointments
const importAppointmentData = async () => {
  try {
    await Client.deleteMany();
    await Appointment.deleteMany();
    console.log('🟡 Old Clients and Appointments cleared.');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Olivia', 'James'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller'];
    const services = ['Standard Clean', 'The Spring Breeze Reset'];

    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);

      // Randomly decide to create 1 or 2 appointments for this day
      const appointmentsToCreate = Math.floor(Math.random() * 2) + 1; 

      for (let j = 0; j < appointmentsToCreate; j++) {
        // 1. Create a fake TimeBlock for this appointment
        const timeBlock = await TimeBlock.create({
          date: targetDate,
          startTime: j === 0 ? '10:00' : '15:00',
          endTime: j === 0 ? '12:00' : '17:00',
          isBooked: true // Automatically mark it as booked!
        });

        // 2. Create a fake Client
        const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
        const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
        const client = await Client.create({
          name: `${randomFirst} ${randomLast}`,
          email: `${randomFirst.toLowerCase()}.${randomLast.toLowerCase()}@example.com`,
          phone: `555-010-${Math.floor(Math.random() * 1000)}`,
          address: `${Math.floor(Math.random() * 900) + 100} River Rd, Clayton, NY`,
          bedrooms: `${Math.floor(Math.random() * 10%3) + 100}`,
          bathrooms: `${Math.floor(Math.random() * 10%2) + 100}`,
          squareFootage: `${Math.floor(Math.random() * 3000) + 100}`,
          isReturning: Math.random() > 0.5
        });

        // 3. Create the Appointment
        await Appointment.create({
          client: client._id,
          timeBlock: timeBlock._id,
          serviceType: services[Math.floor(Math.random() * services.length)],
          quotedPrice: Math.floor(Math.random() * 200) + 150,
          status: 'Pending',
          addOns: []
        });
      }
    }

    console.log('🟢 7 Days of Mock Appointments Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`🔴 Error importing appointment data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Admin.deleteMany();
    await TimeBlock.deleteMany();
    await Client.deleteMany();
    await Appointment.deleteMany();
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
} else if (process.argv[2] === '-appointments') {
  importAppointmentData();
} else {
  console.log('🟡 Please specify a flag (e.g., -admin, -availability, -appointments, or -d)');
  process.exit();
}