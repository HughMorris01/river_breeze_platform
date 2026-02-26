// frontend/src/components/Hero.jsx
import riverView from '../assets/river-view.jpg';
import riverViewMobile from '../assets/river-view-mobile.jpg';

export default function Hero({ onGetQuote }) {
  return (
    // Swapped h-[100svh] for min-h-[100svh] and added pb-24 so it never hits the footer
    <div className="relative min-h-svh flex items-center justify-center overflow-hidden bg-slate-900 pb-24">
      
      <div className="absolute inset-0 bg-cover bg-center md:hidden" style={{ backgroundImage: `url(${riverViewMobile})` }} />
      <div className="absolute inset-0 bg-cover bg-center hidden md:block" style={{ backgroundImage: `url(${riverView})` }} />
      
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-black/80" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-0 md:px-6 text-center flex flex-col items-center justify-center h-full pt-40 md:pt-48">
        
        <h1 className="text-4xl md:text-8xl font-black text-white tracking-tight mb-4 md:mb-8 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] leading-[1.1] px-6">
          The Cleanest View on <br />
          <span className="text-teal-400">The St. Lawrence.</span>
        </h1>
        
        <p className="max-w-xl mx-auto text-lg md:text-2xl text-slate-100 font-medium leading-relaxed mb-10 md:mb-16 drop-shadow-md px-6">
          Premium domestic detailing for Clayton and Wellesley Island. 
          We handle the dirt so you can get back to the river.
        </p>

        <div className="flex flex-col w-full sm:w-auto sm:flex-row items-center justify-center gap-4 md:gap-6 mb-12 md:mb-20 px-6">
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
        
        {/* HORIZONTAL SCROLL CAROUSEL ON MOBILE, GRID ON DESKTOP */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto opacity-90 px-6 pb-4 snap-x" style={{ scrollbarWidth: 'none' }}>
          
          <div className="min-w-[85%] md:min-w-0 bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-left snap-center">
            <div className="flex text-teal-400 mb-3 text-sm">★★★★★</div>
            <p className="text-slate-200 text-sm md:text-base font-medium leading-relaxed mb-4">
              "Kate got our rental property completely turned around after a terrible tenant. The place looks brand new again. Absolute lifesaver."
            </p>
            <p className="text-white text-xs font-bold uppercase tracking-widest">— Sarah M., Wellesley Island</p>
          </div>

          <div className="min-w-[85%] md:min-w-0 bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-left snap-center">
            <div className="flex text-teal-400 mb-3 text-sm">★★★★★</div>
            <p className="text-slate-200 text-sm md:text-base font-medium leading-relaxed mb-4">
              "We've used three different cleaners in the Thousand Islands area and River Breeze is by far the most thorough. Highly recommend."
            </p>
            <p className="text-white text-xs font-bold uppercase tracking-widest">— David & Elena R., Clayton</p>
          </div>

          <div className="min-w-[85%] md:min-w-0 bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-left snap-center">
            <div className="flex text-teal-400 mb-3 text-sm">★★★★★</div>
            <p className="text-slate-200 text-sm md:text-base font-medium leading-relaxed mb-4">
              "The booking process is incredibly easy and she showed up exactly on time. Our hardwood floors have never looked this good."
            </p>
            <p className="text-white text-xs font-bold uppercase tracking-widest">— Marcus T., Fishers Landing</p>
          </div>

        </div>

      </div>
    </div>
  );
}