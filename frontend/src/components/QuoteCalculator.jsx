import { useState } from 'react';
import { useQuoteStore } from '../store/quoteStore';

export default function QuoteCalculator() {
  // Local state to track whether we are on Step 1 or Step 2
  const [step, setStep] = useState(1);
  
  // Global state to track the actual data
  const { serviceType, setServiceType, propertyDetails, setPropertyDetails } = useQuoteStore();

  return (
    <div className="max-w-4xl mx-auto mt-12 overflow-hidden bg-white shadow-2xl rounded-2xl">
      
      {/* Header Section */}
      <div className="px-8 py-10 text-center text-white bg-slate-800">
        <h2 className="text-4xl font-extrabold tracking-tight">Instant Quote Calculator</h2>
        <p className="max-w-xl mx-auto mt-4 text-lg text-slate-300">
          {step === 1 ? "Select a service below to begin customizing your cleaning package." : "Tell us a bit about your home."}
        </p>
      </div>

      {/* --- STEP 1: SERVICE SELECTION --- */}
      {step === 1 && (
        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            {/* Standard Clean Card */}
            <div
              onClick={() => setServiceType('Standard Clean')}
              className={`group relative p-8 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                serviceType === 'Standard Clean'
                  ? 'border-teal-500 bg-teal-50 shadow-md transform -translate-y-1'
                  : 'border-slate-200 hover:border-teal-300 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-2xl font-bold ${serviceType === 'Standard Clean' ? 'text-teal-900' : 'text-slate-800'}`}>
                  Standard Clean
                </h3>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${serviceType === 'Standard Clean' ? 'border-teal-500' : 'border-slate-300 group-hover:border-teal-300'}`}>
                  {serviceType === 'Standard Clean' && <div className="w-3 h-3 bg-teal-500 rounded-full"></div>}
                </div>
              </div>
              <p className={`${serviceType === 'Standard Clean' ? 'text-teal-700' : 'text-slate-500'} leading-relaxed`}>
                Perfect for routine upkeep and maintaining a spotless, welcoming environment.
              </p>
            </div>

            {/* Spring Breeze Reset Card */}
            <div
              onClick={() => setServiceType('The Spring Breeze Reset')}
              className={`group relative p-8 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                serviceType === 'The Spring Breeze Reset'
                  ? 'border-teal-500 bg-teal-50 shadow-md transform -translate-y-1'
                  : 'border-slate-200 hover:border-teal-300 hover:shadow-lg'
              }`}
            >
               <div className="flex items-center justify-between mb-4">
                <h3 className={`text-2xl font-bold ${serviceType === 'The Spring Breeze Reset' ? 'text-teal-900' : 'text-slate-800'}`}>
                  The Spring Breeze Reset
                </h3>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${serviceType === 'The Spring Breeze Reset' ? 'border-teal-500' : 'border-slate-300 group-hover:border-teal-300'}`}>
                  {serviceType === 'The Spring Breeze Reset' && <div className="w-3 h-3 bg-teal-500 rounded-full"></div>}
                </div>
              </div>
              <p className={`${serviceType === 'The Spring Breeze Reset' ? 'text-teal-700' : 'text-slate-500'} leading-relaxed`}>
                Our premium property opening package for the season. Deep cleaning top to bottom.
              </p>
            </div>

          </div>

          <div className="pt-8 mt-8 border-t border-slate-100">
            <button
              disabled={!serviceType}
              onClick={() => setStep(2)} // This pushes the user to the next screen
              className="w-full px-8 py-5 text-xl font-bold text-white transition-all duration-300 rounded-xl bg-slate-800 hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl disabled:hover:shadow-none"
            >
              {serviceType ? 'Continue to Property Details' : 'Please select a service above'}
            </button>
          </div>
        </div>
      )}

      {/* --- STEP 2: PROPERTY DETAILS --- */}
      {step === 2 && (
        <div className="p-8 md:p-12">
          <div className="space-y-8">
            
            {/* Square Footage Input */}
            <div>
              <label className="block mb-2 text-sm font-bold text-slate-700 uppercase tracking-wide">
                Estimated Square Footage
              </label>
              <input 
                type="number" 
                value={propertyDetails.squareFootage}
                onChange={(e) => setPropertyDetails({ squareFootage: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 text-lg border-2 rounded-lg border-slate-200 focus:border-teal-500 focus:ring-0 transition-colors outline-none"
                placeholder="e.g., 2000"
              />
            </div>

            {/* Bed & Bath Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Bedrooms
                </label>
                <input 
                  type="number" 
                  min="0"
                  value={propertyDetails.bedrooms}
                  onChange={(e) => setPropertyDetails({ bedrooms: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 text-lg border-2 rounded-lg border-slate-200 focus:border-teal-500 focus:ring-0 transition-colors outline-none"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Bathrooms
                </label>
                <input 
                  type="number" 
                  min="0"
                  value={propertyDetails.bathrooms}
                  onChange={(e) => setPropertyDetails({ bathrooms: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 text-lg border-2 rounded-lg border-slate-200 focus:border-teal-500 focus:ring-0 transition-colors outline-none"
                />
              </div>
            </div>

          </div>

          {/* Action Area for Step 2 */}
          <div className="flex gap-4 pt-8 mt-8 border-t border-slate-100">
            <button
              onClick={() => setStep(1)} // Sends them back to step 1
              className="w-1/3 px-8 py-5 text-xl font-bold transition-all duration-300 bg-white border-2 text-slate-600 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300"
            >
              Back
            </button>
            <button
              className="w-2/3 px-8 py-5 text-xl font-bold text-white transition-all duration-300 rounded-xl bg-teal-600 hover:bg-teal-700 hover:shadow-xl"
            >
              Calculate My Quote
            </button>
          </div>
        </div>
      )}

    </div>
  );
}