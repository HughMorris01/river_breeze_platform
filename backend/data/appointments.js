import Appointment from '../models/Appointment.js';
import Client from '../models/Client.js';
import Shift from '../models/Shift.js';

export const seedAppointments = async () => {
  await Appointment.deleteMany();
  console.log('🟡 Old Appointments cleared.');
  
  const clients = await Client.find();
  const shifts = await Shift.find();
  const today = new Date();
  today.setHours(0,0,0,0);

  // 1. PAST APPOINTMENTS
  for(let i = -15; i < 0; i++) {
     if (Math.random() > 0.6) continue; 
     const d = new Date(today);
     d.setDate(d.getDate() + i);
     
     if (d.getDay() !== 0) {
       
       // NEW: Create a mix of statuses for past jobs
       const rand = Math.random();
       let status = 'Completed';
       if (rand > 0.8) status = 'Canceled';
       else if (rand > 0.5) status = 'Confirmed'; // <--- This will trigger the "To Finalize" badge!

       // NEW: Add some dummy admin notes for completed jobs to test the new roster UI
       let adminNotes = '';
       if (status === 'Completed' && Math.random() > 0.5) {
           const notes = [
             "Super easy job. Client left a $20 tip.",
             "Hard water stains on master shower glass, needed extra scrubbing.",
             "Friendly dog, but keep the side gate closed."
           ];
           adminNotes = notes[Math.floor(Math.random() * notes.length)];
       }

       await Appointment.create({
          client: clients[Math.floor(Math.random() * clients.length)]._id,
          serviceType: 'Standard Clean',
          quotedPrice: 120,
          status: status,
          date: d,
          startTime: '09:00',
          endTime: '11:00',
          estimatedHours: 2.0,
          adminNotes // Passed to DB
       });
     }
  }

  // 2. FUTURE APPOINTMENTS (Safely nestled inside your generated Shifts)
  for (const shift of shifts) {
     if (Math.random() > 0.4) { // 60% chance to book a job in this available pocket
         const startMins = parseInt(shift.startTime.split(':')[0]) * 60 + parseInt(shift.startTime.split(':')[1]);
         const duration = Math.random() > 0.5 ? 1.5 : 2.0; 
         const endMins = startMins + (duration * 60);

         const h = Math.floor(endMins / 60).toString().padStart(2, '0');
         const m = (endMins % 60).toString().padStart(2, '0');

         // NEW: Add some dummy client notes to test the data flowing from checkout
         let clientNotes = '';
         if (Math.random() > 0.7) {
             clientNotes = "Please text me 15 mins before you arrive. Gate code is 4321.";
         }

         await Appointment.create({
            client: clients[Math.floor(Math.random() * clients.length)]._id,
            serviceType: 'Standard Clean',
            quotedPrice: duration === 1.5 ? 95 : 125,
            status: Math.random() > 0.3 ? 'Pending' : 'Confirmed',
            date: shift.date,
            startTime: shift.startTime, 
            endTime: `${h}:${m}`,
            estimatedHours: duration,
            clientNotes // Passed to DB
         });
     }
  }
  console.log('🟢 Appointments Seeded.');
};