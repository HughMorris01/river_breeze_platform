// frontend/src/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore.js';
import AvailabilityManager from '../components/AvailabilityManager';
import toast from 'react-hot-toast'; // Import the toast tool

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const { token, logout } = useAuthStore();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch('/api/appointments', {
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

  const handleConfirm = async (id) => {
    try {
      const res = await fetch(`/api/appointments/${id}/confirm`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        setAppointments(appointments.map(appt => 
          appt._id === id ? { ...appt, status: 'Confirmed' } : appt
        ));
        // Sleek success toast instead of native alert
        toast.success('Appointment confirmed! An email has been sent to the client.');
      } else {
        const data = await res.json();
        // Sleek error toast
        toast.error(`Failed to confirm: ${data.message}`);
      }
    } catch (err) {
      console.error("Error confirming:", err);
      toast.error('A network error occurred.');
    }
  };

  // Calculate how many pending appointments exist
  const pendingCount = appointments.filter(appt => appt.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            {/* Added flex-wrap and responsive text sizing */}
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex flex-wrap items-center gap-3 md:gap-4">
              Booking Dashboard
            </h1>
            <p className="text-slate-500 mt-2 text-sm md:text-base">Manage incoming leads and quotes.</p>
            {pendingCount > 0 && (
                <span className="bg-red-500 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                  {pendingCount} Pending
                </span>
              )}
          </div>
          <button onClick={logout} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors font-semibold shadow-sm">
            Logout
          </button>
        </div>

        {/* FIXED: Added overflow-x-auto to the wrapper */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto mb-12">
          {/* FIXED: Added min-w-[800px] to force a horizontal scroll on mobile instead of squishing */}
          <table className="w-full text-left border-collapse min-w-200">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-4 text-xs uppercase tracking-wider font-bold">Client</th>
                <th className="p-4 text-xs uppercase tracking-wider font-bold">Service</th>
                <th className="p-4 text-xs uppercase tracking-wider font-bold">Price</th>
                <th className="p-4 text-xs uppercase tracking-wider font-bold">Status</th>
                <th className="p-4 text-xs uppercase tracking-wider font-bold">Details</th>
                <th className="p-4 text-xs uppercase tracking-wider font-bold">Actions</th>
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
                  <td className="p-4">
                    {/* NEW: Action Button */}
                    {appt.status === 'Pending' ? (
                      <button 
                        onClick={() => handleConfirm(appt._id)}
                        className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                      >
                        Confirm Booking
                      </button>
                    ) : (
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Confirmed</span>
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

        <AvailabilityManager />
      </div>
    </div>
  );
}