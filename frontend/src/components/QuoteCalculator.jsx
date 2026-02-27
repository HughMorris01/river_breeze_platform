// frontend/src/components/QuoteCalculator.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ADD_ON_OPTIONS = [
  { id: 'appliances', label: 'Kitchen Appliances (Fridge, Oven, Microwave)', price: 45, time: 0.75 },
  { id: 'windows', label: 'Interior Windows', price: 30, time: 0.5 },
  { id: 'baseboards', label: 'Deep Clean Baseboards', price: 35, time: 0.5 },
  { id: 'cabinets', label: 'Inside Cabinets', price: 40, time: 0.75 },
  { id: 'linens', label: 'Change Bed Linens', price: 15, time: 0.25 }
];

export default function QuoteCalculator() {
  const [serviceType, setServiceType] = useState('Standard Clean');
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [sqft, setSqft] = useState(1000);
  const [additionalRooms, setAdditionalRooms] = useState(0);
  const [pets, setPets] = useState(0);
  
  // New State for Accordion
  const [showAddOns, setShowAddOns] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  
  const [quote, setQuote] = useState({ price: 0, time: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    let price = 0;
    let time = 0;

    if (serviceType === 'Express Touch-Up') {
      price = 59.99;
      time = 1.0;
    } else {
      price = serviceType === 'The Spring Breeze Reset' ? 140 : 85;
      time = serviceType === 'The Spring Breeze Reset' ? 2.5 : 1.25;

      if (bedrooms > 1) {
        price += (bedrooms - 1) * 10;
        time += (bedrooms - 1) * 0.15;
      }
      
      // FIXED: $20 per full bath = $10 per 0.5 bath increment
      if (bathrooms > 1) {
        price += (bathrooms - 1) * 20; 
        time += (bathrooms - 1) * 0.2;
      }

      if (sqft > 1000) {
        const extra = sqft - 1000;
        price += (extra / 500) * 5; 
        time += (extra / 500) * 0.1; 
      }

      price += additionalRooms * 10;
      time += additionalRooms * 0.15;

      price += pets * 5;
      time += pets * 0.1;
    }

    selectedAddOns.forEach(id => {
      const addon = ADD_ON_OPTIONS.find(a => a.id === id);
      if (addon) {
        price += addon.price;
        time += addon.time;
      }
    });

    const snappedTime = Math.round(time * 4) / 4;
    setQuote({ price, time: snappedTime });
  }, [serviceType, bedrooms, bathrooms, sqft, additionalRooms, pets, selectedAddOns]);

  const toggleAddOn = (id) => {
    setSelectedAddOns(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const displayPrice = Number.isInteger(quote.price) ? quote.price : quote.price.toFixed(2);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">Instant Quote Calculator</h1>
        <p className="text-slate-500 mt-4 text-sm md:text-base max-w-2xl mx-auto">
          Customize your cleaning package below. Our smart engine will instantly calculate an accurate price and time estimate based on your exact needs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8 bg-white p-6 md:p-10 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100">
          
          {/* EXPANDED DESCRIPTIONS FOR SERVICE TYPE */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Select Service Type</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => setServiceType('Express Touch-Up')}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-start h-full ${serviceType === 'Express Touch-Up' ? 'border-teal-500 bg-teal-50 shadow-md ring-1 ring-teal-500' : 'border-slate-200 hover:border-teal-200 hover:bg-slate-50'}`}
              >
                <div className="font-bold text-slate-800 text-lg">Express</div>
                <div className="text-xs text-slate-500 mt-2 leading-relaxed">A rapid 1-hour surface wipe down and quick tidy. Perfect for last-minute guests or a quick refresh between deep cleans.</div>
              </button>
              <button 
                onClick={() => setServiceType('Standard Clean')}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-start h-full ${serviceType === 'Standard Clean' ? 'border-teal-500 bg-teal-50 shadow-md ring-1 ring-teal-500' : 'border-slate-200 hover:border-teal-200 hover:bg-slate-50'}`}
              >
                <div className="font-bold text-slate-800 text-lg">Standard</div>
                <div className="text-xs text-slate-500 mt-2 leading-relaxed">Perfect for routine upkeep and pristine maintenance. Includes deep dusting, vacuuming, mopping, and full surface sanitization.</div>
              </button>
              <button 
                onClick={() => setServiceType('The Spring Breeze Reset')}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-start h-full ${serviceType === 'The Spring Breeze Reset' ? 'border-teal-500 bg-teal-50 shadow-md ring-1 ring-teal-500' : 'border-slate-200 hover:border-teal-200 hover:bg-slate-50'}`}
              >
                <div className="font-bold text-slate-800 text-lg">Deep Reset</div>
                <div className="text-xs text-slate-500 mt-2 leading-relaxed">Massive, top-to-bottom clean for a completely fresh start. Includes intense scrubbing, heavy buildup removal, and detailed attention to neglected areas.</div>
              </button>
            </div>
            
            {serviceType === 'Express Touch-Up' && (
              <div className="mt-4 text-xs font-bold text-amber-600 bg-amber-50 p-3 rounded-lg inline-block border border-amber-100">
                Note: House size parameters do not apply to the fixed 1-Hour Express package.
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* BEDROOMS & BATHROOMS */}
          <div className={`grid grid-cols-2 gap-4 md:gap-8 transition-opacity ${serviceType === 'Express Touch-Up' ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Bedrooms</label>
              <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                <button onClick={() => setBedrooms(Math.max(1, bedrooms - 1))} className="px-4 py-3 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors font-bold text-lg w-12 md:w-16">-</button>
                <div className="flex-1 text-center font-black text-slate-800 text-lg">{bedrooms}</div>
                <button onClick={() => setBedrooms(bedrooms + 1)} className="px-4 py-3 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors font-bold text-lg w-12 md:w-16">+</button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Bathrooms</label>
              <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                <button onClick={() => setBathrooms(Math.max(1, bathrooms - 0.5))} className="px-2 md:px-4 py-3 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors font-bold text-lg w-12 md:w-16">-</button>
                <div className="flex-1 text-center font-black text-slate-800 text-lg">{bathrooms}</div>
                <button onClick={() => setBathrooms(bathrooms + 0.5)} className="px-2 md:px-4 py-3 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors font-bold text-lg w-12 md:w-16">+</button>
              </div>
            </div>
          </div>

          {/* SQUARE FOOTAGE */}
          <div className={`transition-opacity ${serviceType === 'Express Touch-Up' ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex justify-between items-end mb-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Estimated Size</label>
              <span className="font-black text-teal-600 text-lg">{sqft} <span className="text-xs font-bold text-slate-400 uppercase">sq ft</span></span>
            </div>
            <input 
              type="range" 
              min="500" max="5000" step="100" 
              value={sqft} 
              onChange={(e) => setSqft(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600 outline-none"
            />
          </div>

          <hr className="border-slate-100" />

          {/* FIXED MOBILE LAYOUT: ADDITIONAL ROOMS */}
          <div className={`transition-opacity ${serviceType === 'Express Touch-Up' ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
             <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Additional Rooms</label>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                    <strong className="text-slate-500">Included:</strong> 1 Kitchen, 1 Living Room, 1 Dining Room. <br/>
                    Use this counter to add extra spaces like a Study, Kids Playroom, Sunroom, or Home Gym.
                  </p>
                </div>
                {/* W-FULL ON MOBILE, W-AUTO ON DESKTOP */}
                <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shrink-0 h-14 w-full md:w-auto">
                  <button onClick={() => setAdditionalRooms(Math.max(0, additionalRooms - 1))} className="px-4 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors font-bold text-xl w-16 h-full">-</button>
                  <div className="flex-1 md:w-12 text-center font-black text-slate-800 text-xl">{additionalRooms}</div>
                  <button onClick={() => setAdditionalRooms(additionalRooms + 1)} className="px-4 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors font-bold text-xl w-16 h-full">+</button>
                </div>
             </div>
          </div>

          <hr className="border-slate-100" />

          {/* PETS */}
          <div className={`transition-opacity ${serviceType === 'Express Touch-Up' ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex justify-between items-end mb-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Pets (Dogs / Cats)</label>
              <span className="font-black text-teal-600 text-lg">{pets === 5 ? '5+' : pets}</span>
            </div>
            <div className="relative px-1">
              <input 
                type="range" 
                min="0" max="5" step="1" 
                value={pets} 
                onChange={(e) => setPets(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600 outline-none"
              />
              <div className="flex justify-between text-xs text-slate-400 font-bold mt-3 px-1">
                <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5+</span>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* NEW ACCORDION: ADD-ONS */}
          <div>
            <button 
              onClick={() => setShowAddOns(!showAddOns)}
              className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
            >
              <span className="font-bold uppercase tracking-widest text-slate-600 text-xs">
                Optional Add-ons {selectedAddOns.length > 0 && <span className="ml-2 bg-teal-500 text-white px-2 py-0.5 rounded-full text-[10px]">{selectedAddOns.length} Selected</span>}
              </span>
              <svg className={`w-5 h-5 text-slate-400 transition-transform ${showAddOns ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showAddOns && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 animate-in fade-in slide-in-from-top-2">
                {ADD_ON_OPTIONS.map(addon => (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddOn(addon.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${selectedAddOns.includes(addon.id) ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-200'}`}
                  >
                    <span className={`text-sm font-bold ${selectedAddOns.includes(addon.id) ? 'text-teal-800' : 'text-slate-700'}`}>
                      {addon.label}
                    </span>
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors shrink-0 ml-3 ${selectedAddOns.includes(addon.id) ? 'bg-teal-500 border-teal-500' : 'border-slate-300 bg-white'}`}>
                      {selectedAddOns.includes(addon.id) && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: THE FLOATING SUMMARY */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-slate-800 rounded-3xl p-8 text-white shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-slate-100 border-b border-slate-700 pb-4">Your Estimate</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Service</span>
                <span className="font-bold text-right text-sm">{serviceType}</span>
              </div>
              
              {serviceType !== 'Express Touch-Up' && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Property</span>
                    <span className="font-bold text-right">{bedrooms} Bed, {bathrooms} Bath</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Size</span>
                    <span className="font-bold text-right">{sqft} sq ft</span>
                  </div>
                  {(additionalRooms > 0 || pets > 0) && (
                     <div className="flex justify-between items-center">
                       <span className="text-slate-400 text-sm">Extras</span>
                       <span className="font-bold text-right text-sm">
                          {additionalRooms > 0 ? `${additionalRooms} Extra Rooms ` : ''} 
                          {pets > 0 ? `| ${pets} Pets` : ''}
                       </span>
                     </div>
                  )}
                </>
              )}

              {selectedAddOns.length > 0 && (
                <div className="flex justify-between items-start pt-2 border-t border-slate-700">
                  <span className="text-slate-400 text-sm mt-0.5">Add-ons</span>
                  <div className="text-right">
                    {selectedAddOns.map(id => (
                       <div key={id} className="text-xs font-medium text-teal-300 mb-1">
                         + {ADD_ON_OPTIONS.find(a => a.id === id).label}
                       </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 mb-8 border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Est. Duration</span>
                <span className="font-bold text-teal-400">{quote.time} Hours</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Price</span>
                <span className="text-4xl font-black text-white">${displayPrice}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/booking', { state: { quoteDetails: { serviceType, bedrooms, bathrooms, sqft, additionalRooms, pets, selectedAddOns, quote } } })}
              className="w-full py-4 text-center bg-teal-500 hover:bg-teal-400 text-slate-900 font-black text-lg rounded-xl transition-all shadow-lg hover:shadow-teal-500/30 hover:-translate-y-1"
            >
              Book This Package
            </button>
            <p className="text-center text-xs text-slate-500 mt-4">
              Final price subject to in-person walkthrough.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}