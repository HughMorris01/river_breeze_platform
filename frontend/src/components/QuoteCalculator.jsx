// frontend/src/components/QuoteCalculator.jsx
import { useState, useMemo } from 'react';
import { useQuoteStore } from '../store/quoteStore';

export default function QuoteCalculator() {
  // Local state to track which step of the form the user is on
  const [step, setStep] = useState(1);
  
  // Global state to track the actual data
  const { 
    serviceType, setServiceType, 
    propertyDetails, setPropertyDetails,
    addOns, toggleAddOn
  } = useQuoteStore();

  // --- THE UPGRADED PRICING ENGINE ---
  const quoteTotal = useMemo(() => {
    let total = 0;
    
    // 1. Dynamic Base Rates (Spring Breeze deep clean takes longer per sq ft)
    const sqftRate = serviceType === 'The Spring Breeze Reset' ? 0.15 : 0.08;
    total += (propertyDetails.squareFootage || 0) * sqftRate;
    
    // 2. Room Modifiers (1.5x labor multiplier for deep cleans)
    const roomMultiplier = serviceType === 'The Spring Breeze Reset' ? 1.5 : 1;
    total += (propertyDetails.bedrooms || 0) * (15 * roomMultiplier);
    total += (propertyDetails.bathrooms || 0) * (25 * roomMultiplier);
    total += (propertyDetails.additionalRooms || 0) * (15 * roomMultiplier);
    
    // 3. Pet Surcharge (Adds 15% to the subtotal for pet hair/dander)
    if (propertyDetails.hasPets) {
      total *= 1.15; 
    }
    
    // 4. Add-Ons ($25 flat fee per extra service)
    total += addOns.length * 25;
    
    return Math.round(total); // Rounds to the nearest whole dollar
  }, [serviceType, propertyDetails, addOns]);


  return (
    <div className="max-w-4xl mx-auto mt-12 overflow-hidden bg-white shadow-2xl rounded-2xl mb-20">
      
      {/* Header Section */}
      <div className="px-8 py-10 text-center text-white bg-slate-800 transition-all duration-300">
        <h2 className="text-4xl font-extrabold tracking-tight">Instant Quote Calculator</h2>
        <p className="max-w-xl mx-auto mt-4 text-lg text-slate-300">
          {step === 1 && "Select a service below to begin customizing your cleaning package."}
          {step === 2 && "Tell us a bit about your home."}
          {step === 3 && "Here is your transparent, flat-rate estimate."}
        </p>
      </div>

      {/* --- STEP 1: SERVICE SELECTION --- */}
      {step === 1 && (
        <div className="p-8 md:p-12 animate-fade-in">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            {/* Standard Clean Card */}
            <div onClick={() => setServiceType('Standard Clean')} className={`group relative p-8 border-2 rounded-xl cursor-pointer transition-all duration-300 flex flex-col ${serviceType === 'Standard Clean' ? 'border-teal-500 bg-teal-50 shadow-md transform -translate-y-1' : 'border-slate-200 hover:border-teal-300 hover:shadow-lg'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-2xl font-bold ${serviceType === 'Standard Clean' ? 'text-teal-900' : 'text-slate-800'}`}>Standard Clean</h3>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${serviceType === 'Standard Clean' ? 'border-teal-500' : 'border-slate-300 group-hover:border-teal-300'}`}>
                  {serviceType === 'Standard Clean' && <div className="w-3 h-3 bg-teal-500 rounded-full"></div>}
                </div>
              </div>
              <p className={`${serviceType === 'Standard Clean' ? 'text-teal-800' : 'text-slate-600'} font-medium mb-6`}>Perfect for routine upkeep and maintaining a spotless, welcoming environment.</p>
              
              <ul className={`text-sm space-y-3 flex-grow ${serviceType === 'Standard Clean' ? 'text-teal-800' : 'text-slate-600'}`}>
                <li className="flex items-start gap-3"><span className="text-teal-500 font-bold">✓</span> Surface dusting & wipe downs</li>
                <li className="flex items-start gap-3"><span className="text-teal-500 font-bold">✓</span> Vacuuming & mopping all floors</li>
                <li className="flex items-start gap-3"><span className="text-teal-500 font-bold">✓</span> Bathroom & kitchen sanitization</li>
                <li className="flex items-start gap-3"><span className="text-teal-500 font-bold">✓</span> Emptying trash receptacles</li>
              </ul>
            </div>

            {/* Spring Breeze Reset Card */}
            <div onClick={() => setServiceType('The Spring Breeze Reset')} className={`group relative p-8 border-2 rounded-xl cursor-pointer transition-all duration-300 flex flex-col ${serviceType === 'The Spring Breeze Reset' ? 'border-teal-500 bg-teal-50 shadow-md transform -translate-y-1' : 'border-slate-200 hover:border-teal-300 hover:shadow-lg'}`}>
               <div className="flex items-center justify-between mb-4">
                <h3 className={`text-2xl font-bold ${serviceType === 'The Spring Breeze Reset' ? 'text-teal-900' : 'text-slate-800'}`}>The Spring Breeze Reset</h3>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${serviceType === 'The Spring Breeze Reset' ? 'border-teal-500' : 'border-slate-300 group-hover:border-teal-300'}`}>
                  {serviceType === 'The Spring Breeze Reset' && <div className="w-3 h-3 bg-teal-500 rounded-full"></div>}
                </div>
              </div>
              <p className={`${serviceType === 'The Spring Breeze Reset' ? 'text-teal-800' : 'text-slate-600'} font-medium mb-6`}>Our premium property opening package. A top-to-bottom seasonal deep clean.</p>
              
              <ul className={`text-sm space-y-3 flex-grow ${serviceType === 'The Spring Breeze Reset' ? 'text-teal-800' : 'text-slate-600'}`}>
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

      {/* --- STEP 2: PROPERTY DETAILS --- */}
      {step === 2 && (
        <div className="p-8 md:p-12 animate-fade-in">
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
                <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-teal-500 shadow-inner"></div>
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

      {/* --- STEP 3: FINAL QUOTE --- */}
      {step === 3 && (
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
            <button className="w-full sm:w-2/3 px-8 py-4 text-lg font-bold text-white transition-all duration-300 rounded-xl bg-slate-800 hover:bg-slate-900 hover:shadow-xl">
              Proceed to Booking
            </button>
          </div>
        </div>
      )}

    </div>
  );
}