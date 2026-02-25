// frontend/src/components/Hero.jsx
import riverView from '../assets/river-view.jpg';
import riverViewMobile from '../assets/river-view-mobile.jpg';

export default function Hero({ onGetQuote }) {
  return (
    <div className="relative h-svh min-h-150 md:min-h-187.5 flex items-center justify-center overflow-hidden bg-slate-900">
      
      <div className="absolute inset-0 bg-cover bg-center md:hidden" style={{ backgroundImage: `url(${riverViewMobile})` }} />
      <div className="absolute inset-0 bg-cover bg-center hidden md:block" style={{ backgroundImage: `url(${riverView})` }} />
      
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-black/70" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center flex flex-col items-center justify-center h-full pt-32 pb-12 md:pt-0 md:pb-0">
        
        <h1 className="text-3xl md:text-8xl md:mt-32 font-black text-white tracking-tight mb-4 md:mb-8 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] leading-[1.1]">
          The Cleanest View on <br />
          <span className="text-teal-400">The St. Lawrence.</span>
        </h1>
        
        
        <p className="max-w-xl mx-auto text-lg md:text-2xl text-slate-100 font-medium leading-relaxed mb-16 md:mb-24 drop-shadow-md">
          Premium domestic detailing for Clayton and Wellesley Island. 
          We handle the dirt so you can get back to the river.
        </p>

        {/* Added translate-y-3 here to bypass flexbox and visually nudge the buttons down */}
        <div className="flex flex-col w-full sm:w-auto sm:flex-row items-center justify-center gap-6 md:gap-6 translate-y-10 md:translate-y-0">
          <button 
            onClick={onGetQuote}
            className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 bg-teal-500 text-white text-lg md:text-xl font-bold rounded-2xl shadow-2xl hover:bg-teal-400 hover:-translate-y-1 transition-all"
          >
            Get an Instant Quote
          </button>
          
          <button className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 bg-white/10 backdrop-blur-md text-white text-lg md:text-xl font-bold rounded-2xl border-2 border-white/20 hover:bg-white/20 transition-all">
            Returning Clients
          </button>
        </div>
      </div>
    </div>
  );
}