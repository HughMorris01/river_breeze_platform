// frontend/src/components/Hero.jsx
import { Link } from 'react-router-dom';
import riverView from '../assets/river-view.jpg';
import riverViewMobile from '../assets/river-view-mobile.jpg';

export default function Hero() {
  return (
    <div className="relative min-h-svh flex items-center justify-center overflow-hidden bg-slate-900 pb-12">
      {/* Backgrounds */}
      <div className="absolute inset-0 bg-cover bg-center md:hidden" style={{ backgroundImage: `url(${riverViewMobile})` }} />
      <div className="absolute inset-0 bg-cover bg-center hidden md:block" style={{ backgroundImage: `url(${riverView})` }} />
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-black/80" />

      <div className="relative z-10 w-full mx-auto text-center flex flex-col items-center justify-center h-full pt-40 md:pt-48">
        
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl md:text-8xl font-black text-white tracking-tight mb-4 md:mb-8 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] leading-[1.1]">
            The Cleanest View on <br />
            <span className="text-teal-400">The St. Lawrence.</span>
          </h1>
          
          <p className="max-w-xl mx-auto text-lg md:text-2xl text-slate-100 font-medium leading-relaxed mb-10 md:mb-16 drop-shadow-md">
            Premium domestic detailing for Clayton, Wellesley Island and the 1000 Islands Region. 
            We handle the dirt so you can get back to the river.
          </p>

          <div className="flex flex-col w-full sm:w-auto sm:flex-row items-center justify-center gap-4 md:gap-6">
            <Link 
              to="/quote" 
              className="opacity-85 flex items-center justify-center w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 bg-teal-500/80  text-white text-lg md:text-xl font-bold rounded-2xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-teal-400/40 hover:-translate-y-1 transition-all duration-300"
            >
              Get an Instant Quote
            </Link>
            <Link 
              to="/returning"
              className="opacity-99 flex items-center justify-center w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 bg-white/10 backdrop-blur-xl text-white text-lg md:text-xl font-bold rounded-2xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-white/20 hover:-translate-y-1 transition-all duration-300"
            >
              Returning Clients
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}