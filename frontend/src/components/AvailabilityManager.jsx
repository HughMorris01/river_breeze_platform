// frontend/src/components/AvailabilityManager.jsx
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function AvailabilityManager() {
  const { token } = useAuthStore();
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');

  // Generate 30-min intervals for the dropdowns
  const generateTimeOptions = () => {
    const options = [];
    for (let h = 7; h <= 19; h++) {
      for (let m = 0; m < 60; m += 30) {
        const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        options.push(time);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

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
  }, [token]);

  const handleAddShift = async (e) => {
    e.preventDefault();
    if (!date) return toast.error('Please select a date.');
    
    // Validate that end time is strictly after start time
    if (startTime >= endTime) {
      return toast.error('End time must be after start time.');
    }

    setLoading(true);
    try {
      const res = await fetch('/api/availability', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ date, startTime, endTime })
      });

      if (res.ok) {
        toast.success('Availability added!');
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

  const handleDeleteShift = async (id) => {
    if (!window.confirm("Are you sure you want to delete this available time block?")) return;
    
    try {
      const res = await fetch(`/api/availability/${id}`, {
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
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">Manage Availability</h2>
        <p className="text-sm text-slate-500 mt-1">Add specific pockets of free time to your calendar.</p>
        
        <form onSubmit={handleAddShift} className="mt-6 flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-auto flex-1">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border-2 rounded-lg outline-none focus:border-teal-500 bg-white" 
              required
            />
          </div>
          <div className="w-full md:w-auto">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Start Time</label>
            <select 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-3 border-2 rounded-lg outline-none focus:border-teal-500 bg-white"
            >
              {timeOptions.map(t => <option key={`start-${t}`} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="w-full md:w-auto">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">End Time</label>
            <select 
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-3 border-2 rounded-lg outline-none focus:border-teal-500 bg-white"
            >
              {timeOptions.map(t => <option key={`end-${t}`} value={t}>{t}</option>)}
            </select>
          </div>
          <button 
            type="submit" 
            disabled={loading}
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
              // Ensure we display the date correctly based on UTC to avoid timezone shift bugs
              const shiftDate = new Date(shift.date);
              const displayDate = shiftDate.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric' });

              return (
                <div key={shift._id} className="p-4 border-2 border-slate-100 rounded-xl flex justify-between items-center bg-white hover:border-teal-100 transition-colors">
                  <div>
                    <p className="font-bold text-slate-800">{displayDate}</p>
                    <p className="text-sm font-medium text-teal-600 mt-0.5">{shift.startTime} - {shift.endTime}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteShift(shift._id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove this time block"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}