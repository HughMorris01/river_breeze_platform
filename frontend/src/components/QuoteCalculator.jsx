// frontend/src/components/QuoteCalculator.jsx
export default function QuoteCalculator() {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10 border border-slate-100">
      <h2 className="text-3xl font-extrabold text-slate-800 mb-2 text-center">Get Your Instant Quote</h2>
      <p className="text-slate-500 text-center mb-8">Select a service to see our transparent pricing.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Standard Clean Card */}
        <div className="border-2 border-slate-200 rounded-lg p-6 hover:border-teal-500 cursor-pointer transition-all duration-200 hover:shadow-md">
          <h3 className="text-xl font-bold text-slate-700">Standard Clean</h3>
          <p className="text-slate-500 mt-2 text-sm">Perfect for routine upkeep and maintaining a spotless home.</p>
        </div>

        {/* Seasonal Reset Card */}
        <div className="border-2 border-slate-200 rounded-lg p-6 hover:border-teal-500 cursor-pointer transition-all duration-200 hover:shadow-md">
          <h3 className="text-xl font-bold text-teal-800">The Spring Breeze Reset</h3>
          <p className="text-teal-600 mt-2 text-sm">Our premium property opening package for the Wellesley Island season.</p>
        </div>
      </div>

      <button className="w-full bg-teal-600 text-white py-4 rounded-lg text-lg font-bold hover:bg-teal-700 shadow-md transition-colors">
        Continue to Property Details
      </button>
    </div>
  );
}