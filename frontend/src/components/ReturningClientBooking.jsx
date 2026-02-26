// frontend/src/components/ReturningClientBooking.jsx
import { useState } from 'react';
import BookingCalendar from './BookingCalendar';
import toast from 'react-hot-toast';

export default function ReturningClientBooking({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '', address: '' });
  const [serviceType, setServiceType] = useState('Standard Clean');

  const handleBooking = async () => {
    if (!selectedSlot) return toast.error("Please select an available date and time.");
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) return toast.error("Please fill out your contact details.");
    
    setLoading(true);
    try {
      // 1. Save Client (Marked explicitly as returning)
      const clientRes = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...contactInfo, isReturning: true }),
      });
      const clientData = await clientRes.json();
      if (!clientRes.ok) throw new Error('Failed to save client');

      // 2. Save Appointment
      const appointmentRes = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: clientData._id,
          serviceType,
          addOns: [], // Returning express flow skips add-ons for simplicity
          quotedPrice: 0, // Quote is TBD for express returning bookings
          timeBlock: selectedSlot._id 
        }),
      });

      if (!appointmentRes.ok) throw new Error('Failed to save appointment');

      toast.success("Welcome back! Your request has been sent to Katherine.", { duration: 6000 });
      onBack(); // Send them back to the home screen
      
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-12 overflow-hidden bg-white shadow-2xl rounded-2xl mb-20">
      <div className="px-4 py-10 text-center text-white bg-teal-700">
        <h2 className="text-4xl font-extrabold tracking-tight">Welcome Back</h2>
        <p className="max-w-xl mx-auto mt-4 text-lg text-teal-100">
          Skip the quote process and grab an open spot on Kate's schedule.
        </p>
      </div>

      <div className="p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Left Column: Form */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-800 mb-6 tracking-tight border-b border-slate-100 pb-4">Your Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Full Name</label>
                <input type="text" value={contactInfo.name} onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })} className="w-full p-4 border-2 rounded-lg outline-none focus:border-teal-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email</label>
                <input type="email" value={contactInfo.email} onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })} className="w-full p-4 border-2 rounded-lg outline-none focus:border-teal-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Phone</label>
                <input type="tel" value={contactInfo.phone} onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })} className="w-full p-4 border-2 rounded-lg outline-none focus:border-teal-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Service Requested</label>
                <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="w-full p-4 border-2 rounded-lg outline-none focus:border-teal-500 transition-colors bg-white appearance-none">
                  <option value="Standard Clean">Standard Clean</option>
                  <option value="The Spring Breeze Reset">The Spring Breeze Reset</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-6">
              <p className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-2">Deposit Waived</p>
              <p className="text-sm text-slate-600">As a returning client, your $20 scheduling deposit is automatically waived. Billing will be handled directly after your service.</p>
            </div>
          </div>

          {/* Right Column: Calendar */}
          <div>
            <BookingCalendar onSelectSlot={(block) => setSelectedSlot(block)} />
            
            <button 
              onClick={handleBooking} 
              disabled={loading || !selectedSlot} 
              className="w-full mt-8 py-5 text-xl font-bold text-white transition-all duration-300 rounded-xl bg-teal-600 hover:bg-teal-700 shadow-xl hover:-translate-y-1 disabled:bg-slate-300 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Submit Booking Request"}
            </button>
            
            <button onClick={onBack} className="w-full mt-4 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
              ← Cancel & Return Home
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}