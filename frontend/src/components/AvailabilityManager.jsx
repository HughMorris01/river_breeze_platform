// frontend/src/components/AvailabilityManager.jsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuthStore } from '../store/authStore';

// Expanded preset times (7 AM to 6 PM starts)
const PRESET_TIMES = [
  { value: '07:00', label: '7:00 AM' },
  { value: '08:00', label: '8:00 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '12:00', label: '12:00 PM (Noon)' },
  { value: '13:00', label: '1:00 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '17:00', label: '5:00 PM' },
  { value: '18:00', label: '6:00 PM' },
];

export default function AvailabilityManager() {
  const { token } = useAuthStore();
  const [blocks, setBlocks] = useState([]);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [error, setError] = useState('');

  const fetchBlocks = useCallback(async () => {
    try {
      const response = await fetch('/api/availability');
      const data = await response.json();
      setBlocks(data);
    } catch (error) {
      console.error('Failed to fetch availability', error);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchBlocks();
    };
    init();
  }, [fetchBlocks]);

  // DYNAMIC FILTERING LOGIC
  const availableTimeOptions = useMemo(() => {
    if (!date) return PRESET_TIMES; 

    const existingBlocksToday = blocks.filter((block) => {
      const blockDateStr = new Date(block.date).toISOString().split('T')[0];
      return blockDateStr === date;
    });

    return PRESET_TIMES.filter((preset) => {
      const proposedStart = preset.value;
      const [hours, minutes] = proposedStart.split(':');
      const proposedEnd = `${String(parseInt(hours) + 2).padStart(2, '0')}:${minutes}`;

      const overlaps = existingBlocksToday.some((block) => {
        return (proposedStart < block.endTime) && (proposedEnd > block.startTime);
      });

      return !overlaps;
    });
  }, [date, blocks]);

  useEffect(() => {
    if (availableTimeOptions.length > 0) {
      if (!availableTimeOptions.find((opt) => opt.value === startTime)) {
        setStartTime(availableTimeOptions[0].value);
      }
    } else {
      setStartTime(''); 
    }
  }, [availableTimeOptions, startTime]);

  const handleAddBlock = async (e) => {
    e.preventDefault();
    setError(''); 
    if (!date || !startTime) return;

    try {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date, startTime }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add block');
      }

      fetchBlocks(); 
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteBlock = async (id) => {
    try {
      const response = await fetch(`/api/availability/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchBlocks();
      }
    } catch (error) {
      console.error('Failed to delete block', error);
    }
  };

  // Calculate strict date boundaries for the date picker (Today -> 3 Months out)
  const todayObj = new Date();
  const minDateStr = todayObj.toISOString().split('T')[0];
  
  const maxDateObj = new Date(todayObj);
  maxDateObj.setMonth(maxDateObj.getMonth() + 3);
  const maxDateStr = maxDateObj.toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <h2 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">Manage Availability</h2>

      {error && (
        <div className="mb-6 p-4 text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleAddBlock} className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Date</label>
          <input
            type="date"
            required
            min={minDateStr}
            max={maxDateStr}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
          />
        </div>
        
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Start Time</label>
          <select
            required
            disabled={!date || availableTimeOptions.length === 0}
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {availableTimeOptions.length > 0 ? (
              availableTimeOptions.map((time) => (
                <option key={time.value} value={time.value}>
                  {time.label}
                </option>
              ))
            ) : (
              <option value="">No times available</option>
            )}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={!date || availableTimeOptions.length === 0}
            className="w-full sm:w-auto px-8 py-3 bg-teal-500 text-white font-bold rounded-xl shadow-md hover:bg-teal-400 hover:-translate-y-0.5 transition-all disabled:bg-slate-300 disabled:hover:translate-y-0 disabled:shadow-none disabled:cursor-not-allowed"
          >
            Add 2-Hr Block
          </button>
        </div>
      </form>

      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
          Current Open Slots
        </h3>
        
        {blocks.length === 0 ? (
          <p className="text-slate-500 italic text-sm">No available slots listed yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {blocks.map((block) => (
              <div 
                key={block._id} 
                className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-teal-200 transition-colors"
              >
                <div>
                  <p className="font-bold text-slate-700">
                    {new Date(block.date).toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-teal-600 font-medium mt-0.5">
                    {block.startTime} - {block.endTime}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteBlock(block._id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove Slot"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}