// frontend/src/components/QuoteCalculator.jsx
import { useState, useMemo } from 'react';
import { useQuoteStore } from '../store/quoteStore';
import BookingCalendar from './BookingCalendar'; // Importing the calendar component!

export default function QuoteCalculator() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // New local state for the checkout flow
  const [isReturning, setIsReturning] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // --- FAKE CC STATE ---
  const [ccNum, setCcNum] = useState('');
  const [ccExp, setCcExp] = useState('');
  const [ccCvc, setCcCvc] = useState('');
  
  const { 
    serviceType, setServiceType, 
    propertyDetails, setPropertyDetails,
    contactInfo, setContactInfo,
    addOns, toggleAddOn
  } = useQuoteStore();

  const quoteTotal = useMemo(() => {
    let total = 0;
    const sqftRate = serviceType === 'The Spring Breeze Reset' ? 0.15 : 0.08;
    total += (propertyDetails.squareFootage || 0) * sqftRate;
    const roomMultiplier = serviceType === 'The Spring Breeze Reset' ? 1.5 : 1;
    total += (propertyDetails.bedrooms || 0) * (15 * roomMultiplier);
    total += (propertyDetails.bathrooms || 0) * (25 * roomMultiplier);
    total += (propertyDetails.additionalRooms || 0) * (15 * roomMultiplier);
    if (propertyDetails.hasPets) total *= 1.15; 
    total += addOns.length * 25;
    return Math.round(total);
  }, [serviceType, propertyDetails, addOns]);

  const handleBooking = async () => {
    if (!selectedSlot) return alert("Please select an available date and time.");
    
    setLoading(true);
    try {
      const clientRes = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...contactInfo, ...propertyDetails, isReturning }),
      });
      const clientData = await clientRes.json();
      if (!clientRes.ok) throw new Error('Failed to save client');

      // Now sending the selected timeBlock _id to the database
      const appointmentRes = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: clientData._id,
          serviceType,
          addOns,
          quotedPrice: quoteTotal,
          timeBlock: selectedSlot._id 
        }),
      });

      if (!appointmentRes.ok) throw new Error('Failed to save appointment');

      alert("Booking Request Sent! Katherine will review and confirm your appointment shortly.");
      setStep(1); 
      setSelectedSlot(null);
      
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 overflow-hidden bg-white shadow-2xl rounded-2xl mb-20">
      
      <div className="px-4 py-10 text-center text-white bg-slate-800 transition-all duration-300">
        <h2 className="text-4xl font-extrabold tracking-tight">Instant Quote Calculator</h2>
        <p className="max-w-xl mx-auto mt-4 text-lg text-slate-300">
          {step === 1 && "Select a service below to begin customizing your cleaning package."}
          {step === 2 && "Tell us a bit about your home."}
          {step === 3 && "Here is your transparent, flat-rate estimate."}
          {step === 4 && "Where should we send your official quote?"}
          {step === 5 && "Secure your spot on Kate's calendar."}
        </p>
      </div>

      {step === 1 && ( /* ... Keep existing Step 1 exactly the same ... */ 
        <div className="p-4 md:p-12 animate-fade-in">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div onClick={() => setServiceType('Standard Clean')} className={`group relative p-8 border-2 rounded-xl cursor-pointer transition-all duration-300 flex flex-col ${serviceType === 'Standard Clean' ? 'border-teal-500 bg-teal-50 shadow-md transform -translate-y-1' : 'border-slate-200 hover:border-teal-300 hover:shadow-lg'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-2xl font-bold ${serviceType === 'Standard Clean' ? 'text-teal-900' : 'text-slate-800'}`}>Standard Clean</h3>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${serviceType === 'Standard Clean' ? 'border-teal-500' : 'border-slate-300 group-hover:border-teal-300'}`}>
                  {serviceType === 'Standard Clean' && <div className="w-3 h-3 bg-teal-500 rounded-full"></div>}
                </div>
              </div>
              <p className={`${serviceType === 'Standard Clean' ? 'text-teal-800' : 'text-slate-600'} font-medium mb-6`}>Perfect for routine upkeep and maintaining a spotless, welcoming environment.</p>
              <ul className={`text-sm space-y-3 grow ${serviceType === 'Standard Clean' ? 'text-teal-800' : 'text-slate-600'}`}>
                <li className="flex items-start gap-3"><span className="text-teal-500 font-bold">✓</span> Surface dusting & wipe downs</li>
                <li className="flex items-start gap-3"><span className="text-teal-500 font-bold">✓</span> Vacuuming & mopping all floors</li>
                <li className="flex items-start gap-3"><span className="text-teal-500 font-bold">✓</span> Bathroom & kitchen sanitization</li>
                <li className="flex items-start gap-3"><span className="text-teal-500 font-bold">✓</span> Emptying trash receptacles</li>
              </ul>
            </div>

            <div onClick={() => setServiceType('The Spring Breeze Reset')} className={`group relative p-8 border-2 rounded-xl cursor-pointer transition-all duration-300 flex flex-col ${serviceType === 'The Spring Breeze Reset' ? 'border-teal-500 bg-teal-50 shadow-md transform -translate-y-1' : 'border-slate-200 hover:border-teal-300 hover:shadow-lg'}`}>
               <div className="flex items-center justify-between mb-4">
                <h3 className={`text-2xl font-bold ${serviceType === 'The Spring Breeze Reset' ? 'text-teal-900' : 'text-slate-800'}`}>The Spring Breeze Reset</h3>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${serviceType === 'The Spring Breeze Reset' ? 'border-teal-500' : 'border-slate-300 group-hover:border-teal-300'}`}>
                  {serviceType === 'The Spring Breeze Reset' && <div className="w-3 h-3 bg-teal-500 rounded-full"></div>}
                </div>
              </div>
              <p className={`${serviceType === 'The Spring Breeze Reset' ? 'text-teal-800' : 'text-slate-600'} font-medium mb-6`}>Our premium property opening package. A top-to-bottom seasonal deep clean.</p>
              <ul className={`text-sm space-y-3 grow ${serviceType === 'The Spring Breeze Reset' ? 'text-teal-800' : 'text-slate-600'}`}>
                <li className="flex items-start gap-3"><span className="text-teal-500 font-bold">✓</span> <span className="font-bold">Everything in Standard Clean</span></li>
                <li className="flex items-start gap-3"><span className="text-teal-500 font-bold">✓</span> Hand-washing baseboards & trim</li>
                <li className="flex items-start gap-3"><span className="text-teal-500 font-bold">✓</span> Deep scrubbing bathroom grout</li>
                <li className="flex items-start gap-3"><span className="text-teal-500 font-bold">✓</span> Cleaning inside empty cabinets/drawers</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 mt-8 border-t border-slate-100">
            <button disabled={!serviceType} onClick={() => setStep(2)} className="w-full px-8 py-5 text-xl font-bold text-white transition-all duration-300 rounded-xl bg-slate-800 hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl disabled:hover:shadow-none">
              {serviceType ? 'Continue to Property Details' : 'Please select a service above'}
            </button>
          </div>
        </div>
      )}

      {step === 2 && ( /* ... Keep existing Step 2 exactly the same ... */ 
        <div className="p-4 md:p-12 animate-fade-in">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-bold text-slate-700 uppercase tracking-wide">Estimated Sq Ft</label>
                <input type="number" value={propertyDetails.squareFootage} onChange={(e) => setPropertyDetails({ squareFootage: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 text-lg border-2 rounded-lg border-slate-200 focus:border-teal-500 focus:ring-0 transition-colors outline-none" placeholder="2000" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-bold text-slate-700 uppercase tracking-wide">Bedrooms</label>
                <input type="number" min="0" value={propertyDetails.bedrooms} onChange={(e) => setPropertyDetails({ bedrooms: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 text-lg border-2 rounded-lg border-slate-200 focus:border-teal-500 focus:ring-0 transition-colors outline-none" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-bold text-slate-700 uppercase tracking-wide">Bathrooms</label>
                <input type="number" min="0" value={propertyDetails.bathrooms} onChange={(e) => setPropertyDetails({ bathrooms: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 text-lg border-2 rounded-lg border-slate-200 focus:border-teal-500 focus:ring-0 transition-colors outline-none" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-bold text-slate-700 uppercase tracking-wide">Additional Rooms</label>
                <input type="number" min="0" value={propertyDetails.additionalRooms} onChange={(e) => setPropertyDetails({ additionalRooms: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 text-lg border-2 rounded-lg border-slate-200 focus:border-teal-500 focus:ring-0 transition-colors outline-none" placeholder="Offices, dens, etc." />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-2 rounded-lg border-slate-200 bg-slate-50">
              <div className="mb-3 sm:mb-0">
                <h4 className="font-bold text-slate-800 text-lg">Do you have pets?</h4>
                <p className="text-sm text-slate-500">Helps us account for extra dusting and pet hair removal.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={propertyDetails.hasPets} onChange={(e) => setPropertyDetails({ hasPets: e.target.checked })} />
                <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-.5 after:left-.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-teal-500 shadow-inner"></div>
              </label>
            </div>

            <div>
              <label className="block mb-4 text-sm font-bold tracking-wide uppercase text-slate-700">Optional Add-Ons</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['Inside Fridge', 'Inside Oven', 'Interior Windows'].map((addon) => (
                  <div key={addon} onClick={() => toggleAddOn(addon)} className={`p-4 border-2 rounded-lg cursor-pointer transition-colors flex items-center gap-3 ${addOns.includes(addon) ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-300'}`}>
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${addOns.includes(addon) ? 'bg-teal-500 border-teal-500' : 'border-slate-300'}`}>
                      {addOns.includes(addon) && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                    <span className={`font-semibold ${addOns.includes(addon) ? 'text-teal-900' : 'text-slate-700'}`}>{addon}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-4 pt-8 mt-8 border-t border-slate-100">
            <button onClick={() => setStep(1)} className="w-full sm:w-1/3 px-8 py-4 text-lg font-bold transition-all duration-300 bg-white border-2 text-slate-600 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300">
              Back
            </button>
            <button onClick={() => setStep(3)} className="w-full sm:w-2/3 px-8 py-4 text-lg font-bold text-white transition-all duration-300 rounded-xl bg-teal-600 hover:bg-teal-700 hover:shadow-xl">
              Calculate My Quote
            </button>
          </div>
        </div>
      )}

      {step === 3 && ( /* ... Keep existing Step 3 exactly the same ... */ 
        <div className="p-8 md:p-16 text-center animate-fade-in">
          <div className="inline-block p-8 bg-teal-50 rounded-3xl border-2 border-teal-100 mb-8 w-full max-w-md">
            <h3 className="text-xl font-bold text-teal-800 mb-2">{serviceType}</h3>
            <div className="text-7xl font-extrabold text-teal-600 mb-4 tracking-tighter">
              ${quoteTotal}
            </div>
            <p className="text-teal-700 font-medium">Estimated Flat Rate</p>
          </div>
          
          <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4 border-t border-slate-100 justify-center">
            <button onClick={() => setStep(2)} className="w-full sm:w-1/3 px-8 py-4 text-lg font-bold transition-all duration-300 bg-white border-2 text-slate-600 border-slate-200 rounded-xl hover:bg-slate-50">
              Edit Details
            </button>
            <button onClick={() => setStep(4)} className="w-full sm:w-2/3 px-8 py-4 text-lg font-bold text-white transition-all duration-300 rounded-xl bg-slate-800 hover:bg-slate-900 hover:shadow-xl">
              Proceed to Booking
            </button>
          </div>
        </div>
      )}

      {/* --- MODIFIED STEP 4: Added Returning Client Toggle --- */}
      {step === 4 && (
        <div className="p-8 md:p-12 animate-fade-in space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Full Name</label>
               <input type="text" placeholder="Full Name" value={contactInfo.name} onChange={(e) => setContactInfo({ name: e.target.value })} className="w-full p-4 border-2 rounded-lg outline-none focus:border-teal-500 transition-colors" />
             </div>
             <div>
               <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email Address</label>
               <input type="email" placeholder="Email Address" value={contactInfo.email} onChange={(e) => setContactInfo({ email: e.target.value })} className="w-full p-4 border-2 rounded-lg outline-none focus:border-teal-500 transition-colors" />
             </div>
             <div>
               <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Phone Number</label>
               <input type="tel" placeholder="Phone Number" value={contactInfo.phone} onChange={(e) => setContactInfo({ phone: e.target.value })} className="w-full p-4 border-2 rounded-lg outline-none focus:border-teal-500 transition-colors" />
             </div>
             <div>
               <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Property Address</label>
               <input type="text" placeholder="Clayton, NY area" value={contactInfo.address} onChange={(e) => setContactInfo({ address: e.target.value })} className="w-full p-4 border-2 rounded-lg outline-none focus:border-teal-500 transition-colors" />
             </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-6 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-800">Are you a returning client?</h4>
              <p className="text-sm text-slate-500">Returning clients bypass the standard scheduling deposit.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isReturning} onChange={(e) => setIsReturning(e.target.checked)} />
              <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-.5 after:left-.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-teal-500 shadow-inner"></div>
            </label>
          </div>
          
          <div className="flex flex-col-reverse sm:flex-row gap-4 pt-8 mt-8 border-t border-slate-100">
            <button onClick={() => setStep(3)} className="w-full sm:w-1/3 px-8 py-4 text-lg font-bold transition-all duration-300 bg-white border-2 text-slate-600 border-slate-200 rounded-xl hover:bg-slate-50">
              Back
            </button>
            <button onClick={() => setStep(5)} className="w-full sm:w-2/3 px-8 py-4 text-lg font-bold text-white transition-all duration-300 rounded-xl bg-teal-600 hover:bg-teal-700 hover:shadow-xl">
              Choose Date & Time
            </button>
          </div>
        </div>
      )}

      {/* --- NEW STEP 5: Scheduling and Deposit Flow --- */}
      {step === 5 && (
        <div className="p-6 md:p-12 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Left Side: The Calendar Component */}
            <div>
              <BookingCalendar onSelectSlot={(block) => setSelectedSlot(block)} />
              {selectedSlot && (
                <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-xl">
                  <p className="text-sm font-bold text-teal-800 uppercase tracking-wide">Selected Time:</p>
                  <p className="text-lg font-medium text-teal-900">
                    {new Date(selectedSlot.date).toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long', month: 'long', day: 'numeric' })} at {selectedSlot.startTime}
                  </p>
                </div>
              )}
            </div>

            {/* Right Side: Deposit / Checkout */}
            <div>
              <h3 className="text-xl font-black text-slate-800 mb-6 tracking-tight">Booking Summary</h3>
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600 font-medium">Estimated Total</span>
                  <span className="font-bold text-slate-800">${quoteTotal}</span>
                </div>
                {!isReturning && (
                  <div className="flex justify-between text-teal-600 border-t border-slate-200 pt-2 mt-2">
                    <span className="font-bold">Required Deposit</span>
                    <span className="font-bold">$20.00</span>
                  </div>
                )}
              </div>

              {/* Fake Payment Form for New Clients */}
              {!isReturning && (
                <div className="mb-8 animate-fade-in">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Secure Your Slot</h4>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Card Number (16 Digits)" 
                      value={ccNum}
                      onChange={(e) => {
                        // Strips anything that isn't a number and limits to 16
                        const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                        setCcNum(val);
                      }}
                      className="w-full p-4 border-2 rounded-xl outline-none focus:border-teal-500 transition-colors bg-white font-mono text-sm tracking-widest" 
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        value={ccExp}
                        onChange={(e) => {
                          // Strips letters, limits to 4 numbers, and auto-inserts the slash
                          let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                          if (val.length >= 3) val = `${val.slice(0, 2)}/${val.slice(2)}`;
                          setCcExp(val);
                        }}
                        className="w-full p-4 border-2 rounded-xl outline-none focus:border-teal-500 transition-colors bg-white font-mono text-sm tracking-widest text-center" 
                      />
                      <input 
                        type="text" 
                        placeholder="CVC" 
                        value={ccCvc}
                        onChange={(e) => {
                          // Strips letters and limits to 3 numbers
                          const val = e.target.value.replace(/\D/g, '').slice(0, 3);
                          setCcCvc(val);
                        }}
                        className="w-full p-4 border-2 rounded-xl outline-none focus:border-teal-500 transition-colors bg-white font-mono text-sm tracking-widest text-center" 
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-3 text-center flex items-center justify-center gap-1">
                    <span>🔒</span> Payments securely processed via Stripe (Demo)
                  </p>
                </div>
              )}

              {isReturning && (
                <div className="mb-8 p-6 bg-teal-50 border border-teal-100 rounded-2xl text-center text-teal-800 font-medium">
                  Welcome back! Your deposit is waived.
                </div>
              )}

              <button 
                onClick={handleBooking} 
                disabled={loading || !selectedSlot} 
                className="w-full py-5 text-xl font-bold text-white transition-all duration-300 rounded-xl bg-teal-600 hover:bg-teal-700 shadow-xl hover:-translate-y-1 disabled:bg-slate-300 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : (!isReturning ? "Pay $20 & Request Booking" : "Request Booking")}
              </button>
              
              <button onClick={() => setStep(4)} className="w-full mt-4 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                ← Back to Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}