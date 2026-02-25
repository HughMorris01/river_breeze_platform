// frontend/src/components/Header.jsx
import { useAuthStore } from '../store/authStore';
import logo from '../assets/logo.png';

export default function Header({ view, setView }) {
  const { token } = useAuthStore();
  
  // Check if we are on the home screen to determine button styling
  const isHome = view === 'home';

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex justify-between items-start max-w-7xl mx-auto px-6 pt-6 md:px-10 md:pt-4">
      
      <div 
        onClick={() => setView('home')} 
        className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-95 -ml-10 -mt-12 md:-ml-4 md:-mt-8"
      >
        <img 
          src={logo} 
          alt="River Breeze Logo" 
          className="h-36 md:h-48 w-auto drop-shadow-xl" 
        />
      </div>
      
      {!token && (
        <button 
          onClick={() => setView(view === 'login' ? 'home' : 'login')}
          className={`px-4 py-2 text-[10px] md:text-xs font-bold border rounded-lg transition-all uppercase tracking-widest shadow-lg whitespace-nowrap
            ${isHome 
              ? 'text-white border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20' 
              : 'text-slate-700 border-slate-300 bg-white hover:bg-slate-50'
            }`}
        >
          {view === 'login' ? 'Calculator' : 'Admin Login'}
        </button>
      )}
    </nav>
  );
}