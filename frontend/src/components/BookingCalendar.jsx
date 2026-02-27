// frontend/src/components/BookingCalendar.jsx
import { useState, useEffect } from 'react';

export default function BookingCalendar({ onSelectSlot, estimatedHours = 2.0 }) {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDateStr, setSelectedDateStr] = useState('');
  const [activeSlotId, setActiveSlotId] = useState(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        // We pass the required hours to the engine so it can run the Anchor Rule!
        const res = await fetch(`/api/availability?serviceHours=${estimatedHours}`);
        const data = await res.json();
        
        setAvailableSlots(data);
        
        // Auto-select the first available date
        if (data.length > 0) {
          setSelectedDateStr(data[0].date.split('T')[0]);
        }
      } catch (err) {
        console.error("Failed to fetch availability", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [estimatedHours]);

  // Group the dynamic slots by Date for the UI
  const slotsByDate = availableSlots.reduce((acc, slot) => {
    const dateStr = slot.date.split('T')[0];
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(slot);
    return acc;
  }, {});

  const availableDates = Object.keys(slotsByDate).sort();

  const handleSlotClick = (slot) => {
    setActiveSlotId(slot._id);
    onSelectSlot(slot);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 bg-slate-50 rounded-xl border border-slate-200">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-teal-200 rounded-full mb-3"></div>
          <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Checking Schedule...</p>
        </div>
      </div>
    );
  }

  if (availableDates.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-slate-600 font-medium">Kate's schedule is currently fully booked for this service duration.</p>
        <p className="text-slate-400 text-sm mt-2">Please check back later for cancellations.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-800 px-6 py-4">
        <h3 className="text-white font-bold tracking-wide">Select an Available Time</h3>
      </div>
      
      <div className="p-3">
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
            Available Dates
          </label>
          <select 
            value={selectedDateStr}
            onChange={(e) => {
              setSelectedDateStr(e.target.value);
              setActiveSlotId(null);
              onSelectSlot(null);
            }}
            className="w-full p-4 border-2 rounded-xl outline-none focus:border-teal-500 bg-slate-50 text-slate-800 font-bold text-lg cursor-pointer"
          >
            {availableDates.map(dateStr => {
              // Format for humans (e.g., "Thu, Mar 21")
              const dateObj = new Date(dateStr + 'T12:00:00Z'); // Force noon UTC to prevent timezone shifts
              const displayDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
              return (
                <option key={dateStr} value={dateStr}>{displayDate}</option>
              );
            })}
          </select>
        </div>

        <div>
           <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
            Available Start Times
          </label>
          {selectedDateStr && slotsByDate[selectedDateStr] ? (
            <div className="grid grid-cols-2 gap-3">
              {slotsByDate[selectedDateStr].map(slot => (
                <button
                  key={slot._id}
                  onClick={() => handleSlotClick(slot)}
                  className={`p-4 rounded-xl border-2 transition-all text-left flex flex-col items-center justify-center
                    ${activeSlotId === slot._id 
                      ? 'border-teal-500 bg-teal-50 shadow-md ring-2 ring-teal-500 ring-offset-1' 
                      : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50'
                    }`}
                >
                  <span className={`text-xl font-black ${activeSlotId === slot._id ? 'text-teal-700' : 'text-slate-700'}`}>
                    {slot.startTime}
                  </span>
                </button>
              ))}
            </div>
          ) : (
             <p className="text-slate-500 text-sm italic">No slots available on this date.</p>
          )}
        </div>
      </div>
    </div>
  );
}