// frontend/src/pages/ReturningConfirm.jsx
import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import BookingCalendar from '../components/BookingCalendar';
import toast from 'react-hot-toast';

export default function ReturningConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const clientData = location.state?.clientData;
  const lastJob = clientData?.lastAppointment;

  // UI States
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Default to 2 hours if editing, otherwise strictly use their last job's duration
  const requiredHours = isEditing ? 2.0 : (lastJob?.estimatedHours || 2.0);
  
  // Job States (Defaults to the last job if it exists, otherwise standard)
  const [serviceType, setServiceType] = useState(lastJob?.serviceType || 'Standard Clean');

  if (!clientData) {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-white shadow-2xl rounded-2xl p-12 text-center border border-slate-100">
        <h2 className="text-2xl font-black text-slate-800">Session Expired</h2>
        <p className="text-slate-500 mt-2 mb-6">We need to verify your details again.</p>
        <Link to="/returning" className="px-6 py-3 bg-teal-600 hover:bg-teal-700 transition-colors text-white font-bold rounded-xl shadow-md">
          Return to Verification
        </Link>
      </div>
    );
  }

  const handleBooking = async () => {
    if (!selectedSlot) return toast.error("Please select an available date and time.");
    setLoading(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: clientData._id,
          serviceType,
          addOns: [], 
          quotedPrice: isEditing ? 120 : (lastJob?.quotedPrice || 95), 
          // --- NEW: Pass the exact temporal footprint ---
          date: selectedSlot.date,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          estimatedHours: 2.0 // We can make this dynamic based on the quote later
        }),
      });

      if (res.ok) {
        toast.success("Your slot has been reserved!", { duration: 6000 });
        navigate('/'); 
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to book appointment.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-12 overflow-hidden bg-white shadow-2xl rounded-2xl mb-20">
      <div className="px-4 py-10 text-center text-white bg-teal-700">
        <h2 className="text-4xl font-extrabold tracking-tight">Welcome Back, {clientData.name.split(' ')[0]}!</h2>
        <p className="max-w-xl mx-auto mt-4 text-lg text-teal-100">
          Review your property details and grab an open spot on Kate's schedule.
        </p>
      </div>

      <div className="p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left Column: Client Details & Editing */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-800 mb-6 tracking-tight border-b border-slate-100 pb-4">Property Profile</h3>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">Service Address</p>
                <p className="text-lg font-medium text-slate-800">{clientData.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500">Contact</p>
                  <p className="font-medium text-slate-800">{clientData.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500">Specs</p>
                  <p className="font-medium text-slate-800">{clientData.bedrooms} Bed, {clientData.bathrooms} Bath</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500">Additional Rooms</p>
                  <p className="font-medium text-slate-800">{clientData.additionalRooms || 0}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500">Pets</p>
                  <p className="font-medium text-slate-800">{clientData.hasPets ? 'Yes' : 'None'}</p>
                </div>
              </div>
            </div>

            {/* LAST JOB & EDIT TOGGLE */}
            {lastJob ? (
              <div className={`p-6 rounded-xl border-2 transition-all ${isEditing ? 'border-slate-200 bg-white' : 'border-teal-500 bg-teal-50'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold uppercase text-teal-700 mb-1">Last Service</p>
                    <p className="text-lg font-bold text-slate-800">{lastJob.serviceType}</p>
                    <p className="text-sm font-medium text-slate-500">Billed: ${lastJob.quotedPrice} • Est. Time: 2.0 hrs</p>
                  </div>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-xs font-bold px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50"
                  >
                    {isEditing ? 'Cancel Edit' : 'Edit Service'}
                  </button>
                </div>

                {isEditing && (
                  <div className="pt-4 border-t border-slate-200 mt-4 animate-in fade-in slide-in-from-top-2">
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Change Service Request</label>
                    <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="w-full p-3 border-2 rounded-lg outline-none focus:border-teal-500 bg-white">
                      <option value="Standard Clean">Standard Clean</option>
                      <option value="The Spring Breeze Reset">The Spring Breeze Reset</option>
                    </select>
                    {/* Placeholder for future add-on selections */}
                  </div>
                )}
              </div>
            ) : (
              // Fallback if they have no past completed jobs in the database
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Service Requested</label>
                <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="w-full p-4 border-2 rounded-lg outline-none focus:border-teal-500 transition-colors bg-white">
                  <option value="Standard Clean">Standard Clean</option>
                  <option value="The Spring Breeze Reset">The Spring Breeze Reset</option>
                </select>
              </div>
            )}
            
          </div>

          {/* Right Column: Calendar */}
          <div>
            {/* NEW: Pass the requiredHours down to the engine! */}
            <BookingCalendar 
              onSelectSlot={(block) => setSelectedSlot(block)} 
              estimatedHours={requiredHours} 
            />

            <button
              onClick={handleBooking}
              disabled={loading || !selectedSlot}
              className="w-full mt-8 py-5 text-xl font-bold text-white transition-all duration-300 rounded-xl bg-teal-600 hover:bg-teal-700 shadow-xl hover:-translate-y-1 disabled:bg-slate-300 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : isEditing ? "Confirm Updated Booking" : "Rebook This Service"}
            </button>

            <Link to="/returning" className="block text-center w-full mt-4 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
              ← Not you? Try searching again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}