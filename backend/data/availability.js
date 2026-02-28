import Shift from '../models/Shift.js';

export const seedAvailability = async () => {
  await Shift.deleteMany();
  console.log('🟡 Old Shifts cleared.');

  const today = new Date();
  today.setHours(0,0,0,0);

  // Generate future availability
  for(let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    
    // Skip Sundays and randomly take 20% of days off
    if (d.getDay() === 0 || Math.random() > 0.8) continue; 

    // Random start time between 8:00 AM and 1:00 PM
    const startHour = 8 + Math.floor(Math.random() * 6);
    const startMin = Math.random() > 0.5 ? '00' : '30';
    
    // Random duration: 1.5, 2.0, 2.5, 3.0, or 4.0 hours
    const durations = [1.5, 2.0, 2.5, 3.0, 4.0];
    const duration = durations[Math.floor(Math.random() * durations.length)];

    const startMins = (startHour * 60) + (startMin === '30' ? 30 : 0);
    const endMins = startMins + (duration * 60);

    const endHourStr = Math.floor(endMins / 60).toString().padStart(2, '0');
    const endMinStr = (endMins % 60).toString().padStart(2, '0');

    await Shift.create({
      date: d,
      startTime: `${startHour.toString().padStart(2, '0')}:${startMin}`,
      endTime: `${endHourStr}:${endMinStr}`
    });
  }
  console.log('🟢 Future Availability (Shifts) Seeded.');
};