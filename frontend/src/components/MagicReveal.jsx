// frontend/src/components/MagicReveal.jsx
import { useState, useEffect } from 'react';
import messyRoom from '../assets/messy-room.png';
import cleanRoom from '../assets/clean-room.png';
import messyRoomMobile from '../assets/messy-room-mobile.png';
import cleanRoomMobile from '../assets/clean-room-mobile.png';

export default function MagicReveal({ onComplete }) {
  const [position, setPosition] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Automatically slide the wand across over 5 seconds (half speed)
    const interval = setInterval(() => {
      setPosition((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsDone(true), 500); // Wait a beat before closing
          return 100;
        }
        return prev + 1;
      });
    }, 50); // <-- CHANGED THIS FROM 25 TO 50
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isDone) onComplete();
  }, [isDone, onComplete]);

  return (
    <div className="fixed inset-0 z-100 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl aspect-3/4 md:aspect-video rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(45,212,191,0.3)] border-4 border-white/20">
        
        {/* --- BEFORE IMAGES (Messy) --- */}
        <img 
          src={messyRoomMobile} 
          className="absolute inset-0 w-full h-full object-cover md:hidden"
          alt="Before cleaning mobile"
        />
        <img 
          src={messyRoom} 
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
          alt="Before cleaning desktop"
        />

        {/* --- AFTER IMAGES (Clean) - Clipped by the wand position --- */}
        <div 
          className="absolute inset-0 w-full h-full z-10"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img 
            src={cleanRoomMobile} 
            className="absolute inset-0 w-full h-full object-cover md:hidden"
            alt="After cleaning mobile"
          />
          <img 
            src={cleanRoom} 
            className="absolute inset-0 w-full h-full object-cover hidden md:block"
            alt="After cleaning desktop"
          />
        </div>

        {/* --- THE MAGIC WAND LINE --- */}
        <div 
          className="absolute inset-y-0 w-1 bg-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.9)] z-20"
          style={{ left: `${position}%` }}
        >
          {/* Wand Icon */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 text-4xl drop-shadow-2xl">
            ✨
          </div>
        </div>

        {/* OVERLAY TEXT */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 bg-black/60 backdrop-blur-md px-8 py-3 rounded-full border border-white/10 shadow-2xl transition-all">
          <p className="text-white font-black tracking-widest uppercase text-xs md:text-lg whitespace-nowrap">
            {position < 100 ? "Working our magic..." : "Sparkling Clean!"}
          </p>
        </div>
      </div>
    </div>
  );
}