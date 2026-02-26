// frontend/src/components/ReturningClientBooking.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Autocomplete from 'react-google-autocomplete'; // <-- NEW IMPORT
import toast from 'react-hot-toast';

export default function ReturningClientBooking() {
  const [address, setAddress] = useState('');
  const [identity, setIdentity] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!address || !identity) {
      return toast.error("Please provide both pieces of information.");
    }

    setLoading(true);

    try {
      const res = await fetch('/api/clients/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, identity })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile found! Let's get you scheduled.");
        navigate('/returning/confirm', { state: { clientData: data } });
      } else {
        toast.error("We couldn't find an active profile matching those details.");
        navigate('/quote');
      }

    } catch (err) {
      console.error("Verification failed:", err);
      toast.error("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white shadow-2xl rounded-2xl overflow-hidden mb-20 border border-slate-100">
      
      <div className="px-8 py-10 text-center text-white bg-slate-800">
        <h2 className="text-3xl font-extrabold tracking-tight">Welcome Back</h2>
        <p className="mt-3 text-slate-300 font-medium">
          Verify your property details to skip the quote process and book your next service.
        </p>
      </div>

      <div className="p-8 md:p-12">
        <form onSubmit={handleVerify} className="space-y-6">
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
              Property Address
            </label>
            {/* GOOGLE AUTOCOMPLETE COMPONENT */}
            <Autocomplete
              apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
              onPlaceSelected={(place) => {
                if (place.formatted_address) {
                  setAddress(place.formatted_address);
                }
              }}
              options={{
                types: ['address'],
                componentRestrictions: { country: 'us' },
                strictBounds: true,
                // This creates a ~50 mile bounding box around Clayton, NY
                bounds: {
                  north: 44.96, 
                  south: 43.51, 
                  east: -75.06, 
                  west: -77.10, 
                }
              }}
              className="w-full p-4 border-2 rounded-xl outline-none focus:border-teal-500 transition-colors bg-slate-50 focus:bg-white text-lg font-medium text-slate-800"
              placeholder="Start typing your address..."
            />
          </div>

          <div>
             <div className="flex justify-between items-end mb-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">
                  Verify Identity
                </label>
             </div>
            <input 
              type="text" 
              value={identity} 
              onChange={(e) => setIdentity(e.target.value)} 
              className="w-full p-4 border-2 rounded-xl outline-none focus:border-teal-500 transition-colors bg-slate-50 focus:bg-white text-lg font-medium text-slate-800" 
              placeholder="Email address OR Phone number" 
            />
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              disabled={loading} 
              className="w-full py-5 text-xl font-bold text-white transition-all duration-300 rounded-xl bg-teal-600 hover:bg-teal-700 shadow-xl hover:-translate-y-1 disabled:bg-slate-300 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed"
            >
              {loading ? "Searching Records..." : "Find My Profile"}
            </button>
          </div>
          
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500 mb-4">New to River Breeze?</p>
          <Link to="/quote" className="text-teal-600 font-bold hover:text-teal-700 transition-colors">
            Get an instant quote instead →
          </Link>
        </div>
      </div>
    </div>
  );
}