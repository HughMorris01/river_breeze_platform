// frontend/src/pages/NewClientBooking.jsx
import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import BookingCalendar from '../components/BookingCalendar';
import Autocomplete from 'react-google-autocomplete';
import toast from 'react-hot-toast';

// --- STRICT FORMATTERS ---
const formatPhone = (value) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, '');
  if (phoneNumber.length < 4) return phoneNumber;
  if (phoneNumber.length < 7) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

const formatCardNumber = (val) => {
  const cleaned = val.replace(/\D/g, '').substring(0, 16);
  return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
};

const formatExpiry = (val) => {
  const cleaned = val.replace(/\D/g, '').substring(0, 4);
  if (cleaned.length >= 3) return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  return cleaned;
};

const formatCVC = (val) => val.replace(/\D/g, '').substring(0, 3); 

export default function NewClientBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const quoteDetails = location.state?.quoteDetails;

  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Client Details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Payment States (Left in for visual structure)
  const [paymentMethod, setPaymentMethod] = useState('cc'); 
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  if (!quoteDetails) {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-white shadow-2xl rounded-2xl p-12 text-center border border-slate-100">
        <h2 className="text-2xl font-black text-slate-800">No Quote Found</h2>
        <p className="text-slate-500 mt-2 mb-6">Please use the calculator to generate an estimate first.</p>
        <Link to="/quote" className="px-6 py-3 bg-teal-600 hover:bg-teal-700 transition-colors text-white font-bold rounded-xl shadow-md">
          Go to Calculator
        </Link>
      </div>
    );
  }

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!selectedSlot) return toast.error("Please select an available date and time.");
    if (!firstName || !lastName || !email || !phone || !address) return toast.error("Please fill out all contact details.");
    
    // PAYMENT VALIDATION BYPASSED FOR TESTING
    /*
    if (paymentMethod === 'cc') {
        if (cardNumber.replace(/\s/g, '').length < 16) return toast.error("Please enter a valid 16-digit card number.");
        if (expiry.length < 5) return toast.error("Please enter a valid expiration date (MM/YY).");
        if (cvc.length < 3) return toast.error("Please enter a valid 3-digit CVC.");
    }
    */

    setLoading(true);

    try {
      // Fake payment delay
      toast.loading("Simulating deposit processing...", { id: 'payment' });
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      toast.success("Test Payment Bypassed!", { id: 'payment' });

      toast.loading("Creating your profile...", { id: 'booking' });
      const clientRes = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          phone,
          address,
          bedrooms: quoteDetails.bedrooms,
          bathrooms: quoteDetails.bathrooms,
          squareFootage: quoteDetails.sqft,
          additionalRooms: quoteDetails.additionalRooms,
          pets: quoteDetails.pets
        })
      });

      if (!clientRes.ok) throw new Error("Failed to create client profile.");
      const newClient = await clientRes.json();

      const apptRes = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: newClient._id,
          serviceType: quoteDetails.serviceType,
          addOns: quoteDetails.selectedAddOns, 
          quotedPrice: quoteDetails.quote.price, 
          date: selectedSlot.date,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          estimatedHours: quoteDetails.quote.time
        }),
      });

      if (!apptRes.ok) throw new Error("Failed to secure appointment slot.");

      toast.success("Booking Confirmed! Check your email for details.", { id: 'booking', duration: 6000 });
      navigate('/'); 

    } catch (err) {
      toast.error(err.message || "An error occurred during booking.", { id: 'booking' });
    } finally {
      setLoading(false);
    }
  };

  const balanceDue = (quoteDetails.quote.price - 20).toFixed(2);

  return (
    <div className="max-w-6xl mx-auto overflow-hidden bg-white shadow-2xl rounded-2xl mb-20 mt-12">
      <div className="px-6 py-10 text-center text-white bg-slate-800">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Secure Your Booking</h2>
        <p className="max-w-xl mx-auto mt-4 text-slate-300">
          A $20.00 deposit secures your slot on Kate's calendar. The remaining balance is due after your walkthrough.
        </p>
      </div>

      <div className="p-3 md:p-10">
        <form onSubmit={handleBooking} className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          
          <div className="lg:col-span-3 space-y-8">
            
            {/* CONTACT INFO */}
            <div>
               <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Contact Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">First Name</label>
                    <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full p-3 border-2 rounded-lg outline-none focus:border-teal-500 bg-slate-50 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Last Name</label>
                    <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full p-3 border-2 rounded-lg outline-none focus:border-teal-500 bg-slate-50 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Email</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border-2 rounded-lg outline-none focus:border-teal-500 bg-slate-50 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Phone</label>
                    <input type="tel" required value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} className="w-full p-3 border-2 rounded-lg outline-none focus:border-teal-500 bg-slate-50 focus:bg-white" placeholder="(555) 555-5555" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Full Service Address</label>
                    <Autocomplete
                      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                      onPlaceSelected={(place) => {
                        const hasHouseNumber = place.address_components?.some(component => 
                          component.types.includes('street_number')
                        );

                        if (!hasHouseNumber) {
                          setAddress(''); 
                          return toast.error("Please select an exact house number from the dropdown, not just a street name.");
                        }

                        if (place.formatted_address) {
                          setAddress(place.formatted_address);
                        }
                      }}
                        onChange={(e) => setAddress(e.target.value)} 
                        value={address} 
                        options={{
                        types: ['address'],
                        componentRestrictions: { country: 'us' },
                        strictBounds: true,
                        bounds: { north: 44.96, south: 43.51, east: -75.06, west: -77.10 }
                      }}
                      className="w-full p-4 border-2 rounded-xl outline-none focus:border-teal-500 transition-colors bg-slate-50 focus:bg-white text-lg font-medium text-slate-800"
                      placeholder="Start typing your address..."
                    />
                  </div>
               </div>
            </div>

            {/* PAYMENT GATEWAY - GRAYED OUT FOR TESTING */}
            <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200 relative overflow-hidden">
               
               {/* OVERLAY BADGE */}
               <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                 <div className="bg-slate-800 text-white font-black tracking-widest uppercase text-sm px-6 py-3 rounded-xl shadow-2xl rotate-[-2deg]">
                   Disabled For Testing
                 </div>
               </div>

               <div className="opacity-40 pointer-events-none blur-[1px] select-none">
                 <h3 className="text-xl font-bold text-slate-800 mb-4 flex justify-between items-center">
                   <span>Payment Method</span>
                   <span className="text-teal-600 font-black">$20.00 Deposit</span>
                 </h3>
                 
                 <div className="flex gap-3 mb-6">
                   <button type="button" onClick={() => setPaymentMethod('cc')} className={`flex-1 py-3 text-sm font-bold border-2 rounded-lg transition-all ${paymentMethod === 'cc' ? 'border-teal-500 bg-white text-teal-700 shadow-sm' : 'border-slate-200 text-slate-500 hover:bg-white'}`}>
                      💳 Credit Card
                   </button>
                   <button type="button" onClick={() => setPaymentMethod('paypal')} className={`flex-1 py-3 text-sm font-bold border-2 rounded-lg transition-all ${paymentMethod === 'paypal' ? 'border-[#003087] bg-white text-[#003087] shadow-sm' : 'border-slate-200 text-slate-500 hover:bg-white'}`}>
                      🅿️ PayPal
                   </button>
                   <button type="button" onClick={() => setPaymentMethod('stripe')} className={`flex-1 py-3 text-sm font-bold border-2 rounded-lg transition-all ${paymentMethod === 'stripe' ? 'border-[#635BFF] bg-white text-[#635BFF] shadow-sm' : 'border-slate-200 text-slate-500 hover:bg-white'}`}>
                      🟣 Stripe
                   </button>
                 </div>

                 {paymentMethod === 'cc' && (
                   <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Card Number</label>
                        <input type="text" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} placeholder="•••• •••• •••• ••••" className="w-full p-3 border-2 rounded-lg outline-none focus:border-teal-500 bg-white font-mono" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Expiry (MM/YY)</label>
                          <input type="text" value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} placeholder="MM/YY" className="w-full p-3 border-2 rounded-lg outline-none focus:border-teal-500 bg-white font-mono" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">CVC</label>
                          <input type="text" value={cvc} onChange={(e) => setCvc(formatCVC(e.target.value))} placeholder="123" className="w-full p-3 border-2 rounded-lg outline-none focus:border-teal-500 bg-white font-mono" />
                        </div>
                      </div>
                   </div>
                 )}
               </div>
            </div>

          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg">
               <h3 className="text-lg font-bold mb-4 border-b border-slate-700 pb-3">Order Summary</h3>
               <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Package:</span>
                    <span className="font-bold">{quoteDetails.serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Est. Time:</span>
                    <span className="font-bold">{quoteDetails.quote.time} Hours</span>
                  </div>
                  <div className="flex justify-between text-teal-300">
                    <span>Total Estimate:</span>
                    <span className="font-bold">${Number.isInteger(quoteDetails.quote.price) ? quoteDetails.quote.price : quoteDetails.quote.price.toFixed(2)}</span>
                  </div>
               </div>

               <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 mb-2">
                 <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-slate-400">Deposit Due Now:</span>
                    <span className="font-black text-lg">$20.00</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Balance Due Later:</span>
                    <span className="text-slate-300">${balanceDue}</span>
                 </div>
               </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Select Your Appointment</label>
              <BookingCalendar 
                estimatedHours={quoteDetails.quote.time} 
                onSelectSlot={(slot) => setSelectedSlot(slot)} 
              />
            </div>

            <button
              type="submit"
              disabled={loading || !selectedSlot}
              className="w-full py-5 text-xl font-bold text-white transition-all duration-300 rounded-xl bg-teal-600 hover:bg-teal-700 shadow-xl hover:-translate-y-1 disabled:bg-slate-300 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Book Appointment"}
            </button>
            <p className="text-center text-xs text-slate-400 font-medium">Payment is bypassed for testing.</p>
          </div>
        </form>
      </div>
    </div>
  );
}