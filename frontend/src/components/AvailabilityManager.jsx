// frontend/src/components/AvailabilityManager.jsx
import { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function AvailabilityManager({ refreshTrigger }) {
  const { token } = useAuthStore();
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState(null);

  // Form State
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Helper for time math
  const toMins = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  // 1. Generate master list of 30-min intervals
  const timeOptions = useMemo(() => {
    const options = [];
    for (let h = 7; h <= 19; h++) {
      for (let m = 0; m < 60; m += 30) {
        options.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
    return options;
  }, []);

  // 2. Filter shifts to only the selected date
  const shiftsOnSelectedDate = useMemo(() => {
    if (!date) return [];
    return shifts.filter(s => new Date(s.date).toISOString().split('T')[0] === date);
  }, [shifts, date]);

  // 3. SMART DROPDOWN: Filter out Start Times that fall inside existing shifts
  const availableStartTimes = useMemo(() => {
    if (!date) return timeOptions;
    return timeOptions.filter(t => {
      const tMins = toMins(t);
      return !shiftsOnSelectedDate.some(s => toMins(s.startTime) <= tMins && toMins(s.endTime) > tMins);
    });
  }, [timeOptions, shiftsOnSelectedDate, date]);

  // 4. SMART DROPDOWN: Filter End Times based on Start Time AND next shift boundaries
  const availableEndTimes = useMemo(() => {
    if (!startTime) return [];
    const startMins = toMins(startTime);

    const futureShifts = shiftsOnSelectedDate.filter(s => toMins(s.startTime) > startMins);
    const maxEndMins = futureShifts.length > 0 ? Math.min(...futureShifts.map(s => toMins(s.startTime))) : Infinity;

    return timeOptions.filter(t => {
      const tMins = toMins(t);
      return tMins > startMins && tMins <= maxEndMins;
    });
  }, [timeOptions, startTime, shiftsOnSelectedDate]);


  const fetchShifts = async () => {
    try {
      const res = await fetch('/api/availability/shifts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setShifts(data);
    } catch (err) {
      console.error("Error fetching shifts:", err);
    }
  };

  useEffect(() => {
    if (token) fetchShifts();
  }, [token, refreshTrigger]);

  const handleAddShift = async (e) => {
    e.preventDefault();
    if (!date || !startTime || !endTime) return toast.error('Please complete all fields.');
    
    // FIX: Force date to Noon UTC so it never falls behind local midnight and disappears
    const safeDate = new Date(date + 'T12:00:00Z').toISOString();

    setLoading(true);
    try {
      const res = await fetch('/api/availability', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ date: safeDate, startTime, endTime })
      });

      if (res.ok) {
        toast.success('Availability added!');
        setStartTime('');
        setEndTime('');
        fetchShifts();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to add availability');
      }
    } catch {
      toast.error('Network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async () => {
    if (!shiftToDelete) return;
    try {
      const res = await fetch(`/api/availability/${shiftToDelete._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success('Availability removed!');
        fetchShifts();
      } else {
        toast.error('Failed to remove availability');
      }
    } catch {
      toast.error('Network error occurred.');
    } finally {
      setShiftToDelete(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">Manage Availability</h2>
        <p className="text-sm text-slate-500 mt-1">Add specific pockets of free time to your calendar.</p>
        
        <form onSubmit={handleAddShift} className="mt-6 flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-auto flex-1">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => {
                setDate(e.target.value);
                setStartTime(''); // Reset times when date changes
                setEndTime('');
              }}
              className="w-full p-3 border-2 rounded-lg outline-none focus:border-teal-500 bg-white" 
              required
            />
          </div>
          <div className="w-full md:w-auto">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Start Time</label>
            <select 
              value={startTime} 
              onChange={(e) => {
                setStartTime(e.target.value);
                setEndTime(''); // Reset end time when start changes
              }}
              disabled={!date}
              className="w-full p-3 border-2 rounded-lg outline-none focus:border-teal-500 bg-white disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="" disabled>Select Start</option>
              {availableStartTimes.map(t => <option key={`start-${t}`} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="w-full md:w-auto">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">End Time</label>
            <select 
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)}
              disabled={!startTime}
              className="w-full p-3 border-2 rounded-lg outline-none focus:border-teal-500 bg-white disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="" disabled>Select End</option>
              {availableEndTimes.map(t => <option key={`end-${t}`} value={t}>{t}</option>)}
            </select>
          </div>
          <button 
            type="submit" 
            disabled={loading || !startTime || !endTime}
            className="w-full md:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Time'}
          </button>
        </form>
      </div>

      <div className="p-6 md:p-8 max-h-100 overflow-y-auto">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Upcoming Free Time</h3>
        
        {shifts.length === 0 ? (
          <p className="text-slate-500 italic">No upcoming availability set.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shifts.map(shift => {
              const shiftDate = new Date(shift.date);
              const displayDate = shiftDate.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric' });

              return (
                <div key={shift._id} className="p-4 border-2 border-slate-100 rounded-xl flex justify-between items-center bg-white hover:border-teal-100 transition-colors">
                  <div>
                    <p className="font-bold text-slate-800">{displayDate}</p>
                    <p className="text-sm font-medium text-teal-600 mt-0.5">{shift.startTime} - {shift.endTime}</p>
                  </div>
                  
                  {shift.isLocked ? (
                    <div className="flex flex-col items-center justify-center px-2">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-1">Booked</span>
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                         <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                       </svg>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShiftToDelete(shift)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove this free time"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* NEW CUSTOM CONFIRMATION MODAL */}
      {shiftToDelete && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Remove Availability?</h3>
            <p className="text-slate-500 text-sm mb-6">
              Are you sure you want to remove the block from <strong className="text-slate-700">{shiftToDelete.startTime} to {shiftToDelete.endTime}</strong>? Clients will no longer be able to book this time.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShiftToDelete(null)}
                className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-sm"
              >
                Delete It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}