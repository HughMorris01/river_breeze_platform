// frontend/src/components/Hero.jsx
import riverView from '../assets/river-view.jpg';
import riverViewMobile from '../assets/river-view-mobile.jpg';

export default function Hero({ onGetQuote }) {
  return (
    <div className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-slate-900">
      
      {/* Mobile Background (Shown only on small screens) */}
      <div 
        className="absolute inset-0 bg-cover bg-center md:hidden transition-transform duration-1000"
        style={{ backgroundImage: `url(${riverViewMobile})` }}
      />

      {/* Desktop Background (Hidden on mobile, shown on md screens and up) */}
      <div 
        className="absolute inset-0 bg-cover bg-center hidden md:block transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: `url(${riverView})` }}
      />
      
      {/* CLEAN VIEW FIX: 
          Removed 'backdrop-blur' to keep the image sharp. 
          Using a slightly darker gradient at the bottom for text contrast.
      */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />

      {/* Content Layer */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight mb-6 drop-shadow-2xl">
          The Cleanest View on <br />
          <span className="text-teal-400">The St. Lawrence.</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-100 font-medium leading-relaxed mb-12 drop-shadow-lg">
          Premium domestic detailing for Clayton and Wellesley Island. 
          We handle the dirt so you can get back to the river.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={onGetQuote}
            className="w-full sm:w-auto px-12 py-6 bg-teal-500 text-white text-xl font-bold rounded-2xl shadow-2xl hover:bg-teal-400 hover:-translate-y-1 transition-all active:scale-95"
          >
            Get an Instant Quote
          </button>
          
          <button className="w-full sm:w-auto px-12 py-6 bg-white/10 text-white text-xl font-bold rounded-2xl border-2 border-white/30 hover:bg-white/20 transition-all">
            Returning Clients
          </button>
        </div>
      </div>
    </div>
  );
}