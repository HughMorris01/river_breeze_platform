import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

export default function AvailabilityManager() {
  const { token } = useAuthStore();
  const [blocks, setBlocks] = useState([]);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00'); 

  // Wrapped in useCallback to satisfy React's dependency requirements
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

  // Handle submitting the new time block
  const handleAddBlock = async (e) => {
    e.preventDefault();
    if (!date || !startTime) return;

    try {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Pass Kate's admin token
        },
        body: JSON.stringify({ date, startTime }),
      });

      if (response.ok) {
        fetchBlocks(); // Refresh the list
        setStartTime('09:00'); // Reset the time
      }
    } catch (error) {
      console.error('Failed to add block', error);
    }
  };

  // Handle deleting a time block
  const handleDeleteBlock = async (id) => {
    try {
      const response = await fetch(`/api/availability/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchBlocks(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to delete block', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <h2 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">Manage Availability</h2>

      {/* Add Block Form */}
      <form onSubmit={handleAddBlock} className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
          />
        </div>
        
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Start Time</label>
          <input
            type="time"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-teal-500 text-white font-bold rounded-xl shadow-md hover:bg-teal-400 hover:-translate-y-0.5 transition-all"
          >
            Add 2-Hr Block
          </button>
        </div>
      </form>

      {/* List of Existing Blocks */}
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
                className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <div>
                  <p className="font-bold text-slate-700">
                    {new Date(block.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
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
                  {/* Simple SVG Trash Icon */}
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