// backend/controllers/availabilityController.js
import Shift from '../models/Shift.js';
import Appointment from '../models/Appointment.js';

export const getAvailability = async (req, res) => {
  try {
    // We will pass the service time from the frontend (defaults to 2 hours)
    const { date, serviceHours } = req.query; 
    const requestedHours = parseFloat(serviceHours) || 2.0;
    const requestedMins = requestedHours * 60;

    // Fetch the next 30 days of data
    const startDate = date ? new Date(date) : new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 30);

    const shifts = await Shift.find({ date: { $gte: startDate, $lte: endDate } }).sort({ date: 1 });
    const appointments = await Appointment.find({ 
       date: { $gte: startDate, $lte: endDate },
       status: { $in: ['Pending', 'Confirmed'] } // Don't block time for canceled jobs!
    });

    const availableSlots = [];

    // --- HELPER FUNCTIONS FOR TIME MATH ---
    const toMins = (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };
    const toTimeStr = (mins) => {
      const h = Math.floor(mins / 60).toString().padStart(2, '0');
      const m = (mins % 60).toString().padStart(2, '0');
      return `${h}:${m}`;
    };

    // --- THE ENGINE ---
    shifts.forEach(shift => {
      const shiftDateStr = shift.date.toISOString().split('T')[0];
      const dayAppointments = appointments.filter(a => a.date.toISOString().split('T')[0] === shiftDateStr);

      const shiftStartMins = toMins(shift.startTime);
      const shiftEndMins = toMins(shift.endTime);

      // 1. Inflate existing appointments with a 30-min travel buffer
      const bookedRanges = dayAppointments.map(a => ({
          start: toMins(a.startTime),
          end: toMins(a.endTime) + 30 
      })).sort((a, b) => a.start - b.start);

      // 2. Iterate through the shift in 30-minute intervals
      for (let currentStart = shiftStartMins; currentStart + requestedMins <= shiftEndMins; currentStart += 30) {
          const currentEnd = currentStart + requestedMins;

          // Check if this specific block overlaps with any existing bookings
          const hasOverlap = bookedRanges.some(b => 
              (currentStart >= b.start && currentStart < b.end) || 
              (currentEnd > b.start && currentEnd <= b.end) ||
              (currentStart <= b.start && currentEnd >= b.end)
          );

          if (hasOverlap) continue;

          // 3. THE ANCHOR RULE
          // Calculate the dead space before this slot
          let prevEnd = shiftStartMins;
          for (const b of bookedRanges) {
              if (b.end <= currentStart) prevEnd = Math.max(prevEnd, b.end);
          }
          const gapBefore = currentStart - prevEnd;

          // Calculate the dead space after this slot
          let nextStart = shiftEndMins;
          for (const b of bookedRanges) {
              if (b.start >= currentEnd) nextStart = Math.min(nextStart, b.start);
          }
          const gapAfter = nextStart - currentEnd;

          // A slot is ONLY valid if it sits flush against another boundary (gap = 0) 
          // OR leaves enough room for at least a 1.5 hr basic clean (gap >= 90 mins)
          const isValidAnchor = (gapBefore === 0 || gapBefore >= 90) && (gapAfter === 0 || gapAfter >= 90);

          if (isValidAnchor) {
              availableSlots.push({
                  _id: `${shift._id}-${currentStart}`, // Unique ID for React map rendering
                  date: shift.date,
                  startTime: toTimeStr(currentStart),
                  endTime: toTimeStr(currentEnd),
                  shiftId: shift._id
              });
          }
      }
    });

    res.status(200).json(availableSlots);

  } catch (error) {
    console.error("Availability Engine Error:", error);
    res.status(500).json({ message: "Error calculating availability" });
  }
};

// @desc    Get raw shifts for the Admin Dashboard
// @route   GET /api/availability/shifts
// @access  Private/Admin
export const getShifts = async (req, res) => {
  try {
    const shifts = await Shift.find().sort({ date: 1 });
    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shifts' });
  }
};

// @desc    Add a new working shift
// @route   POST /api/availability
// @access  Private/Admin
export const addShift = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;
    const shift = await Shift.create({ date, startTime, endTime });
    res.status(201).json(shift);
  } catch (error) {
    res.status(500).json({ message: 'Error adding shift' });
  }
};

// @desc    Delete a working shift
// @route   DELETE /api/availability/:id
// @access  Private/Admin
export const deleteShift = async (req, res) => {
  try {
    await Shift.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Shift deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting shift' });
  }
};