import { useState } from 'react';
import { useAuthStore } from './store/authStore';
import Header from './components/Header';
import Hero from './components/Hero';
import QuoteCalculator from './components/QuoteCalculator';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import Footer from './components/Footer';

export default function App() {
  const { token } = useAuthStore();
  const [view, setView] = useState('home');

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {!token && <Header view={view} setView={setView} />}

      <main>
        {token ? (
          <AdminDashboard />
        ) : (
          <>
            {view === 'home' && <Hero onGetQuote={() => setView('quote')} />}
            {view === 'quote' && (
               // Added massive top padding to clear the absolute logo
               <div className="pt-22 md:pt-38 pb-10 px-4">
                 <QuoteCalculator />
               </div>
            )}
            {view === 'login' && (
              // Added massive top padding here too
              <div className="pt-32 md:pt-48 pb-10 px-4">
                <LoginPage onBack={() => setView('home')} />
              </div>
            )}
          </>
        )}
      </main>

     <Footer />
    </div>
  );
}