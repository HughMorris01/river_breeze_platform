// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import Hero from './components/Hero';
import Testimonials from './components/Testimonials';
import QuoteCalculator from './components/QuoteCalculator';
import ReturningClientBooking from './components/ReturningClientBooking';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import Footer from './components/Footer';

export default function App() {
  const { token } = useAuthStore();
  const [view, setView] = useState('home');

  // WAKE UP PING FOR RENDER FREE TIER
  useEffect(() => {
    let timeoutId;

    const wakeUpServer = async () => {
      try {
        // If the server doesn't respond in 1.5 seconds, show the loading toast
        timeoutId = setTimeout(() => {
          toast.loading("Waking up secure booking server...", { id: 'cold-start', duration: 8000 });
        }, 1500);

        // Ping a lightweight public route just to spin up the Render instance
        const res = await fetch('/api/availability');
        
        // Clear the timeout if the server responds fast
        clearTimeout(timeoutId);
        
        // Dismiss the loading toast if it was triggered
        toast.dismiss('cold-start');

        if (res.ok) {
           console.log("Server is awake and ready.");
        }
      } catch (error) {
        console.error("Wake up ping failed:", error);
        clearTimeout(timeoutId);
        toast.dismiss('cold-start');
      }
    };

    wakeUpServer();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-teal-100 selection:text-teal-900">
      <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
      
      {!token && <Header view={view} setView={setView} />}

      <main className="grow">
        {token ? (
          <AdminDashboard />
        ) : (
          <>
            {view === 'home' && (
              <>
                <Hero onGetQuote={() => setView('quote')} onReturningClient={() => setView('returning')} />
                <Testimonials />
              </>
            )}
            
            {view === 'quote' && (
               <div className="pt-22 md:pt-38 pb-10 px-4">
                 <QuoteCalculator />
               </div>
            )}
            
            {view === 'returning' && (
              <div className="max-w-7xl mx-auto px-4 md:px-6 w-full pt-32 pb-10">
                <ReturningClientBooking onBack={() => setView('home')} />
              </div>
            )}
            
            {view === 'login' && (
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