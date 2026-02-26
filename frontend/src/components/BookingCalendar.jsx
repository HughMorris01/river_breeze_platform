// frontend/src/components/BookingCalendar.jsx
import { useState, useEffect } from 'react';

export default function BookingCalendar({ onSelectSlot }) {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  
  // NEW: Tracks which day is currently expanded
  const [expandedDate, setExpandedDate] = useState(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch('/api/availability');
        const data = await response.json();
        setBlocks(data);
        
        // Auto-expand the very first available day once data loads
        if (data.length > 0) {
           const firstDate = new Date(data[0].date).toLocaleDateString('en-US', {
             timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric',
           });
           setExpandedDate(firstDate);
        }
      } catch (error) {
        console.error('Failed to fetch availability', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  const groupedBlocks = blocks.reduce((acc, block) => {
    const dateKey = new Date(block.date).toLocaleDateString('en-US', {
      timeZone: 'UTC',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(block);
    return acc;
  }, {});

  const handleSelection = (block) => {
    setSelectedBlockId(block._id);
    onSelectSlot(block); 
  };

  const toggleDay = (dateLabel) => {
    setExpandedDate(expandedDate === dateLabel ? null : dateLabel);
  };

  if (loading) {
    return <div className="text-center p-8 text-slate-500 font-medium animate-pulse">Loading Kate's schedule...</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-xl font-black text-slate-800 mb-6 tracking-tight">Select an Available Time</h3>
      
      {Object.keys(groupedBlocks).length === 0 ? (
        <div className="bg-slate-50 p-8 rounded-2xl text-center border border-slate-200">
          <p className="text-slate-600 font-medium">Kate is currently fully booked.</p>
          <p className="text-sm text-slate-400 mt-2">Please check back later for new openings.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedBlocks).map(([dateLabel, dayBlocks]) => {
            const isExpanded = expandedDate === dateLabel;
            
            return (
              <div key={dateLabel} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
                
                {/* ACCORDION HEADER (Click to open/close) */}
                <button 
                  onClick={() => toggleDay(dateLabel)}
                  className="w-full bg-slate-50 px-5 py-4 flex justify-between items-center hover:bg-slate-100 transition-colors"
                >
                  <h4 className="font-bold text-slate-700 tracking-wide text-left">{dateLabel}</h4>
                  <span className="text-slate-400 transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    ▼
                  </span>
                </button>
                
                {/* ACCORDION BODY (The actual times) */}
                {isExpanded && (
                  <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-100 animate-fade-in">
                    {dayBlocks.map((block) => {
                      const isSelected = selectedBlockId === block._id;
                      
                      return (
                        <button
                          key={block._id}
                          onClick={() => handleSelection(block)}
                          className={`
                            p-4 rounded-xl text-left transition-all border-2 
                            ${isSelected 
                              ? 'border-teal-500 bg-teal-50 shadow-md ring-2 ring-teal-500/20' 
                              : 'border-slate-100 bg-white hover:border-teal-200 hover:bg-slate-50'
                            }
                          `}
                        >
                          <div className={`font-bold ${isSelected ? 'text-teal-700' : 'text-slate-700'}`}>
                            {block.startTime}
                          </div>
                          <div className={`text-xs mt-1 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`}>
                            2-Hour Service Block
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}