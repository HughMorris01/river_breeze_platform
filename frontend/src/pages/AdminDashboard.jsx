// frontend/src/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore.js';
import AvailabilityManager from '../components/AvailabilityManager';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending'); 
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { token } = useAuthStore();

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
        setRefreshTrigger(prev => prev + 1);
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

  // --- CLIENT ROSTER EXTRACTION ---
  // We extract the unique clients from the appointments data to build the roster dynamically
  const clientMap = new Map();
  appointments.forEach(appt => {
     if (!appt.client) return;
     const cid = appt.client._id;
     if (!clientMap.has(cid)) {
         clientMap.set(cid, { ...appt.client, lastJobDate: null, lastJobPrice: null, completedJobs: [] });
     }
     if (appt.status === 'Completed') {
         clientMap.get(cid).completedJobs.push(appt);
     }
  });

  const clientRoster = Array.from(clientMap.values()).map(c => {
     if (c.completedJobs.length > 0) {
         c.completedJobs.sort((a,b) => new Date(b.date) - new Date(a.date));
         c.lastJobDate = c.completedJobs[0].date;
         c.lastJobPrice = c.completedJobs[0].quotedPrice;
     }
     return c;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-1 md:p-12 pt-32 md:pt-40">
      <div className="max-w-7xl mx-auto">
        
        {/* CENTERED HEADER */}
        <div className="flex flex-col items-center justify-center mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
            Booking Dashboard
          </h1>
          <p className="text-slate-500 mt-3 text-sm md:text-base max-w-xl">
            Manage your appointments, availability, and complete client roster all in one place.
          </p>
        </div>

        {/* NOTIFICATION TABS */}
        <div className="flex justify-center gap-4 mb-8 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {['Pending', 'Confirmed', 'Completed', 'Canceled'].map(tab => (
            <div key={tab} className="relative">
              <button
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                  activeTab === tab 
                  ? 'bg-slate-800 text-white shadow-md' 
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
              {/* NOTIFICATION BADGE */}
              {tab === 'Pending' && pendingCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-sm ring-2 ring-slate-50 z-10 animate-in zoom-in">
                  {pendingCount}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto mb-12">
          <table className="w-full text-left border-collapse min-w-250">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="text-center p-4 text-xs uppercase tracking-wider font-bold">Date & Time</th>
                <th className="text-center p-4 text-xs uppercase tracking-wider font-bold">Client</th>
                <th className="text-center p-4 text-xs uppercase tracking-wider font-bold">Service</th>
                <th className="text-center p-4 text-xs uppercase tracking-wider font-bold">Price</th>
                <th className="text-center p-4 text-xs uppercase tracking-wider font-bold">Address</th>
                <th className="text-center p-4 text-xs uppercase tracking-wider font-bold">Status</th>
                <th className="text-center p-4 text-xs uppercase tracking-wider font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.map((appt) => (
                <tr key={appt._id} className={`transition-colors ${appt.status === 'Canceled' ? 'bg-slate-50 opacity-60' : 'hover:bg-slate-50'}`}>
                  
                  <td className="p-3 text-center">
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

                  <td className="p-3 text-center">
                    <div className="font-bold text-slate-800">{appt.client?.name}</div>
                    <div className="text-xs text-slate-500">{appt.client?.phone}</div>
                  </td>
                  
                  <td className="p-4 text-center">
                    <span className="text-sm font-medium text-slate-700">{appt.serviceType}</span>
                  </td>
                  
                  <td className="p-4 text-center">
                    <span className="text-lg font-bold text-teal-600">${appt.quotedPrice}</span>
                  </td>

                  <td className="p-4 text-xs text-slate-500 leading-tight text-center">
                    {appt.client?.address}
                    {appt.addOns?.length > 0 && (
                      <div className="mt-1 italic text-teal-600">Add-ons: {appt.addOns.join(', ')}</div>
                    )}
                  </td>
                  
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      appt.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                      appt.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                      appt.status === 'Canceled' ? 'bg-red-100 text-red-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {appt.status}
                    </span>
                  </td>
                  
                  <td className="p-4 text-center">
                    <div className="flex gap-2 justify-center">
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

        <AvailabilityManager refreshTrigger={refreshTrigger} />

        {/* NEW: CLIENT ROSTER SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-8 mb-12">
          <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50">
            <h2 className="text-xl font-bold text-slate-800">Client Roster</h2>
            <p className="text-sm text-slate-500 mt-1">View your complete client database and service history.</p>
          </div>
          <div className="p-6 md:p-8 max-h-[400px] overflow-y-auto">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clientRoster.length === 0 ? (
                   <p className="text-slate-500 italic">No clients found in the database.</p>
                ) : (
                   clientRoster.map(client => (
                     <div key={client._id} className="p-5 border-2 border-slate-100 rounded-xl bg-white hover:border-teal-100 transition-colors flex flex-col justify-between">
                        <div>
                          <p className="font-bold text-slate-800 text-lg">{client.name}</p>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{client.address}</p>
                          <p className="text-xs text-slate-500 font-medium mt-1 mb-4">{client.phone}</p>
                        </div>
                        <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                           <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Last Service</p>
                              <p className="text-sm font-medium text-slate-700 mt-0.5">
                                 {client.lastJobDate
                                   ? new Date(client.lastJobDate).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' })
                                   : 'No completed jobs'
                                 }
                              </p>
                           </div>
                           {client.lastJobPrice && (
                              <div className="text-right">
                                 <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Paid</p>
                                 <p className="text-sm font-bold text-teal-600 mt-0.5">${client.lastJobPrice}</p>
                              </div>
                           )}
                        </div>
                     </div>
                   ))
                )}
             </div>
          </div>
        </div>
        {/* END CLIENT ROSTER */}

      </div>
    </div>
  );
}