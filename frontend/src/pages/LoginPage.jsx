// frontend/src/pages/LoginPage.jsx
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function LoginPage({ onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      // Save admin data and token to our Zustand store
      login(data, data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md p-4 bg-white shadow-2xl rounded-2xl border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Admin Login</h2>
          <p className="text-slate-500 mt-2">Enter your credentials to manage leads.</p>
        </div>

        {error && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border-2 rounded-xl outline-none focus:border-teal-500 transition-colors" 
              placeholder="admin@riverbreeze.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border-2 rounded-xl outline-none focus:border-teal-500 transition-colors" 
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all shadow-lg active:scale-[0.98]"
          >
            Login to Dashboard
          </button>
        </form>

        <button 
          onClick={onBack}
          className="w-full mt-4 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors"
        >
          ← Back to Calculator
        </button>
      </div>
    </div>
  );
}