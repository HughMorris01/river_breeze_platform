// frontend/src/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore.js';
import AvailabilityManager from '../components/AvailabilityManager';

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const { token, logout } = useAuthStore();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/appointments', {
          headers: { Authorization: `Bearer ${token}` }, 
        });
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error("Error fetching leads:", err);
      }
    };

    if (token) fetchLeads();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 p-8 pt-32 md:pt-40">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Booking Dashboard</h1>
            <p className="text-slate-500">Manage incoming leads and quotes.</p>
          </div>
          <button onClick={logout} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors font-semibold">
            Logout
          </button>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-12">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-4 text-xs uppercase tracking-wider font-bold">Client</th>
                <th className="p-4 text-xs uppercase tracking-wider font-bold">Service</th>
                <th className="p-4 text-xs uppercase tracking-wider font-bold">Price</th>
                <th className="p-4 text-xs uppercase tracking-wider font-bold">Status</th>
                <th className="p-4 text-xs uppercase tracking-wider font-bold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((appt) => (
                <tr key={appt._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{appt.client?.name}</div>
                    <div className="text-xs text-slate-500">{appt.client?.phone}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-slate-700">{appt.serviceType}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-lg font-bold text-teal-600">${appt.quotedPrice}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      appt.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-500 leading-tight">
                    {appt.client?.address}
                    {appt.addOns.length > 0 && (
                      <div className="mt-1 italic text-teal-600">Add-ons: {appt.addOns.join(', ')}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {appointments.length === 0 && (
            <div className="p-20 text-center text-slate-400 font-medium">No leads found yet. Time to market!</div>
          )}
        </div>

        {/* Availability Manager */}
        <AvailabilityManager />

      </div>
    </div>
  );
}