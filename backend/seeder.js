// backend/seeder.js
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Client from './models/Client.js';
import TimeBlock from './models/TimeBlock.js';
import Appointment from './models/Appointment.js';

dotenv.config();
connectDB();

// REAL, verified Clayton addresses that Google Maps perfectly indexes
const realClaytonAddresses = [
  '330 Riverside Dr, Clayton, NY 13624, USA',
  '413 Riverside Dr, Clayton, NY 13624, USA',
  '514 James St, Clayton, NY 13624, USA',
  '300 State St, Clayton, NY 13624, USA',
  '401 Mary St, Clayton, NY 13624, USA',
  '615 Mary St, Clayton, NY 13624, USA',
  '205 Webb St, Clayton, NY 13624, USA',
  '114 John St, Clayton, NY 13624, USA',
  '214 Hugunin St, Clayton, NY 13624, USA',
  '500 Webb St, Clayton, NY 13624, USA',
  '400 Alexandria St, Clayton, NY 13624, USA'
];

const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Olivia', 'James', 'Katherine', 'William', 'Sophia'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

const generateClients = async () => {
  try {
    await Client.deleteMany();
    console.log('🟡 Old Clients cleared.');

    const clients = [];
    for (let i = 0; i < 75; i++) {
      const first = firstNames[Math.floor(Math.random() * firstNames.length)];
      const last = lastNames[Math.floor(Math.random() * lastNames.length)];
      // Grab a real, perfectly formatted address from the array
      const exactAddress = realClaytonAddresses[Math.floor(Math.random() * realClaytonAddresses.length)];
      
      clients.push({
        name: `${first} ${last}`,
        email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`,
        phone: `555-010-${Math.floor(1000 + Math.random() * 9000)}`,
        address: exactAddress,
        bedrooms: Math.floor(Math.random() * 4) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        squareFootage: Math.floor(Math.random() * 2500) + 800,
        isReturning: true
      });
    }

    await Client.insertMany(clients);
    console.log('🟢 75 Authentic Google-Formatted Clients Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`🔴 Error generating clients: ${error.message}`);
    process.exit(1);
  }
};

const generateSchedule = async () => {
  try {
    await TimeBlock.deleteMany();
    await Appointment.deleteMany();
    console.log('🟡 Old Schedule & Appointments cleared.');

    const allClients = await Client.find();
    if (allClients.length === 0) {
      console.error('🔴 No clients found! Please run "npm run data:clients" first.');
      process.exit(1);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const services = ['Standard Clean', 'The Spring Breeze Reset'];

    for (let i = -15; i < 15; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);

      if (targetDate.getDay() === 0) continue; 

      const isPast = i < 0;
      const shiftStart = Math.random() > 0.5 ? 9 : 13; 
      
      const block1 = await TimeBlock.create({
        date: targetDate,
        startTime: `${shiftStart}:00`,
        endTime: `${shiftStart + 2}:00`,
        isBooked: false
      });

      const block2 = await TimeBlock.create({
        date: targetDate,
        startTime: `${shiftStart + 2.5}:00`, 
        endTime: `${shiftStart + 4.5}:00`,
        isBooked: false
      });

      const appointmentsToCreate = Math.floor(Math.random() * 3); 

      if (appointmentsToCreate > 0) {
        block1.isBooked = true;
        await block1.save();
        
        let status1 = 'Pending';
        if (isPast) {
            status1 = Math.random() > 0.1 ? 'Completed' : 'Canceled';
        } else {
            status1 = Math.random() > 0.4 ? 'Confirmed' : 'Pending';
        }

        const randomClient1 = allClients[Math.floor(Math.random() * allClients.length)];
        await Appointment.create({
          client: randomClient1._id,
          timeBlock: block1._id,
          serviceType: services[Math.floor(Math.random() * services.length)],
          quotedPrice: Math.floor(Math.random() * 150) + 95,
          status: status1,
          addOns: []
        });
      }

      if (appointmentsToCreate > 1) {
        block2.isBooked = true;
        await block2.save();

        let status2 = 'Pending';
        if (isPast) {
            status2 = Math.random() > 0.3 ? 'Completed' : 'Canceled';
        } else {
            status2 = Math.random() > 0.8 ? 'Canceled' : 'Pending';
        }

        const randomClient2 = allClients[Math.floor(Math.random() * allClients.length)];
        await Appointment.create({
          client: randomClient2._id,
          timeBlock: block2._id,
          serviceType: services[Math.floor(Math.random() * services.length)],
          quotedPrice: Math.floor(Math.random() * 150) + 95,
          status: status2,
          addOns: []
        });
      }
    }

    console.log('🟢 30-Day Authentic Schedule & Appointments Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`🔴 Error generating schedule: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-clients') {
  generateClients();
} else if (process.argv[2] === '-schedule') {
  generateSchedule();
} else {
  console.log('🟡 Please specify a flag (-clients or -schedule)');
  process.exit();
}