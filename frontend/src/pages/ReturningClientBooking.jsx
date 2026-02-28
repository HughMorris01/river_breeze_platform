// frontend/src/pages/ReturningClientBooking.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import BookingCalendar from '../components/BookingCalendar';
import toast from 'react-hot-toast';

const ADD_ON_OPTIONS = [
  { id: 'appliances', label: 'Kitchen Appliances (Fridge, Oven, Microwave)', price: 45, time: 0.75 },
  { id: 'windows', label: 'Interior Windows', price: 30, time: 0.5 },
  { id: 'baseboards', label: 'Deep Clean Baseboards', price: 35, time: 0.5 },
  { id: 'cabinets', label: 'Inside Cabinets', price: 40, time: 0.75 },
  { id: 'linens', label: 'Change Bed Linens', price: 15, time: 0.25 }
];

const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = ('' + phone).replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6,10)}`;
  }
  return phone; 
};

export default function ReturningClientBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const clientData = location.state?.clientData;
  const lastJob = clientData?.lastAppointment;

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [serviceType, setServiceType] = useState(lastJob?.serviceType || 'Standard Clean');
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [showAddOns, setShowAddOns] = useState(false);
  
  const [clientNotes, setClientNotes] = useState('');
  
  const [dynamicQuote, setDynamicQuote] = useState({ 
    price: lastJob?.quotedPrice || 95, 
    time: lastJob?.estimatedHours || 2.0 
  });

  useEffect(() => {
    if (!isEditing && lastJob) {
      setDynamicQuote({ price: lastJob.quotedPrice, time: lastJob.estimatedHours });
      setServiceType(lastJob.serviceType);
      setSelectedAddOns([]);
      setShowAddOns(false);
      return;
    }

    let price = 0;
    let time = 0;

    const beds = clientData?.bedrooms || 1;
    const baths = clientData?.bathrooms || 1;
    const sqft = clientData?.squareFootage || 1000;
    const extras = clientData?.additionalRooms || 0;
    const petCount = clientData?.pets || 0; 

    if (serviceType === 'Express Touch-Up') {
      price = 59.99;
      time = 1.0;
    } else {
      price = serviceType === 'The Spring Breeze Reset' ? 140 : 85;
      time = serviceType === 'The Spring Breeze Reset' ? 2.5 : 1.25;

      if (beds > 1) {
        price += (beds - 1) * 10;
        time += (beds - 1) * 0.15;
      }
      if (baths > 1) {
        price += (baths - 1) * 20;
        time += (baths - 1) * 0.2;
      }
      if (sqft > 1000) {
        const extraSqft = sqft - 1000;
        price += (extraSqft / 500) * 5;
        time += (extraSqft / 500) * 0.1;
      }
      price += extras * 10;
      time += extras * 0.15;
      price += petCount * 5;
      time += petCount * 0.1;
    }

    selectedAddOns.forEach(id => {
      const addon = ADD_ON_OPTIONS.find(a => a.id === id);
      if (addon) {
        price += addon.price;
        time += addon.time;
      }
    });

    const snappedTime = Math.round(time * 4) / 4;
    setDynamicQuote({ price, time: snappedTime });

  }, [isEditing, lastJob, serviceType, selectedAddOns, clientData]);

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

  const toggleAddOn = (id) => {
    setSelectedAddOns(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleBooking = async () => {
    if (!selectedSlot) return toast.error("Please select an available date and time.");
    setLoading(true);

    try {
      const addOnLabels = selectedAddOns.map(id => ADD_ON_OPTIONS.find(a => a.id === id).label);

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: clientData._id,
          serviceType,
          addOns: addOnLabels, 
          quotedPrice: dynamicQuote.price, 
          date: selectedSlot.date,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          estimatedHours: dynamicQuote.time,
          clientNotes 
        }),
      });

      if (res.ok) {
        toast.success("Your slot has been reserved!", { duration: 6000 });
        navigate('/'); 
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to book appointment.");
      }
    } catch {
      toast.error("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const displayPrice = Number.isInteger(dynamicQuote.price) ? dynamicQuote.price : dynamicQuote.price.toFixed(2);

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

          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-800 mb-6 tracking-tight border-b border-slate-100 pb-4">Property Profile</h3>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Service Address</p>
                <p className="text-lg font-medium text-slate-800">{clientData.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Contact</p>
                  <p className="font-medium text-slate-800">{formatPhone(clientData.phone)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Specs</p>
                  <p className="font-medium text-slate-800">{clientData.bedrooms} Bed, {clientData.bathrooms} Bath</p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl border-2 transition-all ${isEditing ? 'border-slate-200 bg-white' : 'border-teal-500 bg-teal-50'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-teal-700 mb-1">
                    {isEditing ? 'New Estimate' : 'Last Service'}
                  </p>
                  <p className="text-lg font-bold text-slate-800">{serviceType}</p>
                  <p className="text-sm font-medium text-slate-500">
                    Billed: ${displayPrice} • Est. Time: {dynamicQuote.time} hrs
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setSelectedSlot(null);
                  }}
                  className="text-xs font-bold px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Service'}
                </button>
              </div>

              {isEditing && (
                <div className="pt-4 border-t border-slate-200 mt-4 animate-in fade-in slide-in-from-top-2">
                  <div className="mb-6">
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Change Package</label>
                    <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="w-full p-3 border-2 rounded-lg outline-none focus:border-teal-500 bg-slate-50 font-medium cursor-pointer">
                      <option value="Express Touch-Up">Express Touch-Up</option>
                      <option value="Standard Clean">Standard Clean</option>
                      <option value="The Spring Breeze Reset">Deep Reset</option>
                    </select>
                  </div>

                  <div>
                    <button 
                      onClick={() => setShowAddOns(!showAddOns)}
                      className="w-full flex justify-between items-center p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                    >
                      <span className="font-bold uppercase tracking-widest text-slate-600 text-[10px]">
                        Optional Add-ons {selectedAddOns.length > 0 && <span className="ml-2 bg-teal-500 text-white px-2 py-0.5 rounded-full">{selectedAddOns.length} Selected</span>}
                      </span>
                      <svg className={`w-4 h-4 text-slate-400 transition-transform ${showAddOns ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showAddOns && (
                      <div className="grid grid-cols-1 gap-2 mt-3 animate-in fade-in slide-in-from-top-2">
                        {ADD_ON_OPTIONS.map(addon => (
                          <button
                            key={addon.id}
                            onClick={() => toggleAddOn(addon.id)}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all text-left ${selectedAddOns.includes(addon.id) ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-200 bg-white'}`}
                          >
                            <span className={`text-xs font-bold ${selectedAddOns.includes(addon.id) ? 'text-teal-800' : 'text-slate-600'}`}>
                              {addon.label}
                            </span>
                            <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ml-2 ${selectedAddOns.includes(addon.id) ? 'bg-teal-500 border-teal-500' : 'border-slate-300 bg-white'}`}>
                              {selectedAddOns.includes(addon.id) && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
              )}
            </div>

            {/* CLIENT NOTES INPUT WITH COUNTER */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Special Instructions (Optional)</label>
              <textarea 
                value={clientNotes} 
                onChange={(e) => setClientNotes(e.target.value)}
                maxLength={200}
                placeholder="Any specific requests, gate codes, or pet instructions for Kate?" 
                className="w-full p-4 border-2 rounded-xl outline-none focus:border-teal-500 transition-colors bg-slate-50 focus:bg-white min-h-25 resize-none text-sm"
              />
              <div className={`text-right text-[10px] font-bold tracking-wider mt-1 ${clientNotes.length === 200 ? 'text-red-500' : 'text-slate-400'}`}>
                {clientNotes.length} / 200
              </div>
            </div>

          </div>

          <div>
            <BookingCalendar 
              onSelectSlot={(block) => setSelectedSlot(block)} 
              estimatedHours={dynamicQuote.time} 
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