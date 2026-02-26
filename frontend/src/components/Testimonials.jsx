// frontend/src/components/Testimonials.jsx
import { useEffect, useRef } from 'react';

const TESTIMONIALS = [
  { stars: '★★★★★', text: '"Kate got our rental property completely turned around after a terrible tenant. The place looks brand new again. Absolute lifesaver."', author: 'Sarah M., Wellesley Island' },
  { stars: '★★★★★', text: '"We\'ve used three different cleaners in the Thousand Islands and River Breeze is by far the most thorough. Highly recommend."', author: 'David & Elena R., Clayton' },
  { stars: '★★★★★', text: '"The booking process is incredibly easy and she showed up exactly on time. Our hardwood floors have never looked this good."', author: 'Marcus T., Fishers Landing' },
  { stars: '★★★★★', text: '"The attention to detail on our porch and windows was incredible. It\'s like seeing the river in 4K for the first time."', author: 'Jason P., Wellesley Island' },
  { stars: '★★★★★', text: '"Professional, punctual, and left our cottage spotless. Katherine is the only person we trust with our summer home."', author: 'The Miller Family, Clayton' },
  { stars: '★★★★★', text: '"River Breeze handles our turnovers with such efficiency. I never have to worry about the state of the house for new guests."', author: 'Linda S., TI Park' },
  { stars: '★★★★★', text: '"Unmatched service in the region. The Spring Reset is an absolute must for anyone opening up their cottage."', author: 'Robert K., Wellesley Island' }
];

const INFINITE_LIST = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

export default function Testimonials() {
  const sliderRef = useRef(null);
  
  // Using useRef instead of useState prevents the component from re-rendering 60 times a second!
  const isSliderHovered = useRef(false);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.scrollLeft = slider.scrollWidth / 3;

    let animationId;
    const autoScroll = () => {
      // Only scroll if the user is not actively touching or hovering
      if (!isSliderHovered.current) {
        slider.scrollLeft += 1.2; // Speed

        // Seamless loop reset
        if (slider.scrollLeft >= (slider.scrollWidth / 3) * 2) {
          slider.scrollLeft = slider.scrollWidth / 3;
        } else if (slider.scrollLeft <= 0) {
          slider.scrollLeft = slider.scrollWidth / 3;
        }
      }
      animationId = requestAnimationFrame(autoScroll);
    };

    animationId = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Manual Desktop Controls
  const handleScrollLeft = () => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: -350, behavior: 'smooth' });
  };
  const handleScrollRight = () => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: 350, behavior: 'smooth' });
  };

  return (
    <section className="bg-black py-20 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center md:text-left">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Loved by <span className="text-teal-400">River Locals.</span>
        </h2>
      </div>

      <div 
        className="relative w-full max-w-[100vw]"
        style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
        // Exact Northern Legacy mouse/touch handlers
        onMouseEnter={() => { isSliderHovered.current = true; }}
        onMouseLeave={() => { isSliderHovered.current = false; }}
        onTouchStart={() => { isSliderHovered.current = true; }}
        onTouchEnd={() => { setTimeout(() => isSliderHovered.current = false, 500); }}
      >
        {/* Left Arrow (Converted from your Northern Legacy CSS) */}
        <button 
          className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-4 w-12 h-12 rounded-full bg-white text-black border border-slate-300 shadow-md items-center justify-center text-3xl font-bold cursor-pointer z-20 transition-all hover:bg-slate-200"
          onClick={handleScrollLeft}
        >&#8249;</button>

        <div 
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto py-4 px-[10vw] cursor-grab active:cursor-grabbing hide-scrollbar"
          // Exact inline styles from Northern Legacy
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollSnapType: 'none', scrollBehavior: 'auto' }}
        >
          {INFINITE_LIST.map((t, i) => (
            <div key={i} className="w-[85vw] md:w-100 shrink-0">
              <div className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-3xl h-full flex flex-col justify-between shadow-xl transition-colors hover:bg-white/10 select-none">
                <div>
                  <div className="flex text-teal-400 mb-4 text-sm">{t.stars}</div>
                  <p className="text-slate-200 text-base md:text-lg font-medium leading-relaxed mb-8">
                    {t.text}
                  </p>
                </div>
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest">{t.author}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow (Converted from your Northern Legacy CSS) */}
        <button 
          className="hidden md:flex absolute top-1/2 -translate-y-1/2 right-4 w-12 h-12 rounded-full bg-white text-black border border-slate-300 shadow-md items-center justify-center text-3xl font-bold cursor-pointer z-20 transition-all hover:bg-slate-200"
          onClick={handleScrollRight}
        >&#8250;</button>
      </div>
    </section>
  );
}