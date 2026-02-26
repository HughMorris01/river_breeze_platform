// frontend/src/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore.js';
import AvailabilityManager from '../components/AvailabilityManager';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending'); 
  const { token, logout } = useAuthStore();

  useEffect(() => {
    const loadInitialData = async () => {
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

    if (token) {
      loadInitialData();
    }
  }, [token]); 

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`/api/appointments/${id}/${action}`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        toast.success(`Appointment successfully ${action}ed!`);
        const refreshRes = await fetch('/api/appointments', {
          headers: { Authorization: `Bearer ${token}` }, 
        });
        const freshData = await refreshRes.json();
        setAppointments(freshData);
      } else {
        const data = await res.json();
        toast.error(`Failed to ${action}: ${data.message}`);
      }
    } catch (err) {
      console.error(`Error with ${action}:`, err);
      toast.error('A network error occurred.');
    }
  };

  // --- FILTERING LOGIC ---
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const filteredAppointments = appointments.filter((appt) => {
    // UPDATED: Now looks directly at appt.date!
    const apptDateStr = appt.date || appt.createdAt;
    const apptDate = new Date(apptDateStr);
    apptDate.setHours(0, 0, 0, 0);

    const isPastDue = apptDate < today;

    if (activeTab === 'Pending') return appt.status === 'Pending' && !isPastDue;
    if (activeTab === 'Confirmed') return appt.status === 'Confirmed' && !isPastDue;
    if (activeTab === 'Completed') return appt.status === 'Completed' || ((appt.status === 'Pending' || appt.status === 'Confirmed') && isPastDue);
    if (activeTab === 'Canceled') return appt.status === 'Canceled';
    return false;
  });

  const pendingCount = appointments.filter(appt => {
    const apptDate = new Date(appt.date || appt.createdAt);
    apptDate.setHours(0,0,0,0);
    return appt.status === 'Pending' && apptDate >= today;
  }).length;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex flex-wrap items-center gap-3 md:gap-4">
              Booking Dashboard
            </h1>
            <p className="text-slate-500 mt-2 text-sm md:text-base">Manage incoming leads and quotes.</p>
            {pendingCount > 0 && (
                <span className="bg-red-500 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full shadow-sm whitespace-nowrap mt-3 inline-block">
                  {pendingCount} Pending
                </span>
            )}
          </div>
          <button onClick={logout} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors font-semibold shadow-sm">
            Logout
          </button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {['Pending', 'Confirmed', 'Completed', 'Canceled'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === tab 
                ? 'bg-slate-800 text-white shadow-md' 
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto mb-12">
          <table className="w-full text-left border-collapse min-w-250">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-4 text-xs uppercase tracking-wider font-bold">Client</th>
                <th className="p-4 text-xs uppercase tracking-wider font-bold">Date & Time</th>
                <th className="p-4 text-xs uppercase tracking-wider font-bold">Service</th>
                <th className="p-4 text-xs uppercase tracking-wider font-bold">Price</th>
                <th className="p-4 text-xs uppercase tracking-wider font-bold">Details</th>
                <th className="p-4 text-xs uppercase tracking-wider font-bold">Status</th>
                <th className="p-4 text-xs uppercase tracking-wider font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.map((appt) => (
                <tr key={appt._id} className={`transition-colors ${appt.status === 'Canceled' ? 'bg-slate-50 opacity-60' : 'hover:bg-slate-50'}`}>
                  
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{appt.client?.name}</div>
                    <div className="text-xs text-slate-500">{appt.client?.phone}</div>
                  </td>
                  
                  <td className="p-4">
                    {/* NEW: Updated to render direct temporal data */}
                    {appt.date ? (
                      <>
                        <div className="font-bold text-slate-800">
                          {new Date(appt.date).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="text-xs text-teal-600 font-bold mt-0.5">
                          {appt.startTime} - {appt.endTime}
                        </div>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Unscheduled</span>
                    )}
                  </td>

                  <td className="p-4">
                    <span className="text-sm font-medium text-slate-700">{appt.serviceType}</span>
                  </td>
                  
                  <td className="p-4">
                    <span className="text-lg font-bold text-teal-600">${appt.quotedPrice}</span>
                  </td>

                  <td className="p-4 text-xs text-slate-500 leading-tight">
                    {appt.client?.address}
                    {appt.addOns?.length > 0 && (
                      <div className="mt-1 italic text-teal-600">Add-ons: {appt.addOns.join(', ')}</div>
                    )}
                  </td>
                  
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      appt.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                      appt.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                      appt.status === 'Canceled' ? 'bg-red-100 text-red-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {appt.status}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex gap-2">
                      {activeTab === 'Pending' && (
                        <>
                          <button onClick={() => handleAction(appt._id, 'confirm')} className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-lg shadow-sm transition-colors">Confirm</button>
                          <button onClick={() => handleAction(appt._id, 'cancel')} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors">Cancel</button>
                        </>
                      )}

                      {activeTab === 'Confirmed' && (
                         <button onClick={() => handleAction(appt._id, 'cancel')} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors">Cancel Booking</button>
                      )}

                      {activeTab === 'Completed' && appt.status !== 'Completed' && (
                        <>
                          <button onClick={() => handleAction(appt._id, 'complete')} className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm transition-colors">Mark Done</button>
                          <button onClick={() => handleAction(appt._id, 'cancel')} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors">Cancel</button>
                        </>
                      )}

                      {appt.status === 'Completed' && <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Finished</span>}
                      {appt.status === 'Canceled' && <span className="text-red-400 text-xs font-bold uppercase tracking-widest">Canceled</span>}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
          {filteredAppointments.length === 0 && (
            <div className="p-20 text-center text-slate-400 font-medium">
              No {activeTab.toLowerCase()} appointments found.
            </div>
          )}
        </div>

        <AvailabilityManager />
      </div>
    </div>
  );
}