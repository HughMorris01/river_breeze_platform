// frontend/src/App.jsx
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import Hero from './components/Hero';
import Testimonials from './components/Testimonials';
import QuoteCalculator from './components/QuoteCalculator';
import ReturningClientBooking from './components/ReturningClientBooking';
import ReturningConfirm from './pages/ReturningConfirm';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';

export default function App() {
  const { token } = useAuthStore();

  // WAKE UP PING FOR RENDER FREE TIER
  useEffect(() => {
    let timeoutId;

    const wakeUpServer = async () => {
      try {
        timeoutId = setTimeout(() => {
          toast.loading("Waking up secure booking server...", { id: 'cold-start', duration: 8000 });
        }, 1500);

        const res = await fetch('/api/availability');
        
        clearTimeout(timeoutId);
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
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-teal-100 selection:text-teal-900">
        <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
        
        {/* The Header is now globally present for unauthenticated users */}
        {!token && <Header />}

        <main className="grow">
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={
              <>
                <Hero />
                <Testimonials />
              </>
            } />
            
            <Route path="/quote" element={
               <div className="pt-22 md:pt-38 pb-10 px-4">
                 <QuoteCalculator />
               </div>
            } />
            
            <Route path="/returning" element={
              <div className="max-w-7xl mx-auto px-4 md:px-6 w-full pt-32 pb-10">
                <ReturningClientBooking />
              </div>
            } />

            <Route path="/returning/confirm" element={
              <div className="max-w-7xl mx-auto px-4 md:px-6 w-full pt-32 pb-10">
                <ReturningConfirm />
              </div>
            } />
            
            {/* If logged in, redirect away from login screen */}
            <Route path="/login" element={
              token ? <Navigate to="/admin" /> : (
                <div className="pt-32 md:pt-48 pb-10 px-4">
                  <LoginPage />
                </div>
              )
            } />

            {/* PROTECTED ROUTE: Must have a token to view Dashboard */}
            <Route path="/admin" element={
              token ? <AdminDashboard /> : <Navigate to="/login" />
            } />

            {/* CATCH-ALL: Redirect bad URLs back to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

       <Footer />
      </div>
    </Router>
  );
}