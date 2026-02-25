// frontend/src/App.jsx
import { useState } from 'react';
import { useAuthStore } from './store/authStore';
import Hero from './components/Hero';
import QuoteCalculator from './components/QuoteCalculator';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';

export default function App() {
  const { token } = useAuthStore();
  const [view, setView] = useState('home'); // 'home', 'quote', 'login'

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navigation Bar */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <h1 
          onClick={() => setView('home')} 
          className="text-2xl font-black text-slate-800 tracking-tighter cursor-pointer"
        >
          River Breeze <span className="text-teal-500 font-medium italic">Domestic Detailing</span>
        </h1>
        
        {!token && (
          <button 
            onClick={() => setView(view === 'login' ? 'home' : 'login')}
            className="px-4 py-2 text-sm font-bold text-slate-600 border-2 border-slate-200 rounded-xl hover:bg-slate-100 transition-all"
          >
            {view === 'login' ? 'Back Home' : 'Admin Login'}
          </button>
        )}
      </nav>

      <main>
        {/* If Admin is logged in, show Dashboard */}
        {token ? (
          <AdminDashboard />
        ) : (
          <>
            {/* Logic to switch between Home, Quote, and Login */}
            {view === 'home' && <Hero onGetQuote={() => setView('quote')} />}
            {view === 'quote' && <QuoteCalculator />}
            {view === 'login' && <LoginPage onBack={() => setView('home')} />}
          </>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="py-10 text-center text-slate-400 text-sm">
        © 2026 River Breeze Domestic Detailing • Clayton, NY
      </footer>
    </div>
  );
}