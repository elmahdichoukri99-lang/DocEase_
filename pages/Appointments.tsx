
import React from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { AppState } from '../types';

interface AppointmentsProps {
  state: AppState;
}

const Appointments: React.FC<AppointmentsProps> = ({ state }) => {
  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = state.appointments.filter(a => a.date === today);
  const futureAppointments = state.appointments.filter(a => a.date > today);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Rendez-vous</h2>
          <p className="text-gray-500 font-bold italic">Synchronisé avec l'application patient DocEase</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30">
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-3 mb-6">
            <Calendar className="text-[#10B981]" size={24} /> Aujourd'hui
          </h3>
          <div className="space-y-4">
            {todaysAppointments.length > 0 ? todaysAppointments.map(a => (
              <div key={a.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-transparent hover:border-emerald-100 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <Clock size={20} className="text-[#10B981]" />
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-800 tracking-tight">{a.patientName}</p>
                    <p className="text-xs text-[#10B981] font-bold uppercase tracking-widest">{a.time}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><CheckCircle size={20}/></button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><XCircle size={20}/></button>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 text-gray-400 italic">Aucun rendez-vous aujourd'hui</div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30">
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-3 mb-6">
            <AlertCircle className="text-blue-500" size={24} /> À venir
          </h3>
          <div className="space-y-4">
            {futureAppointments.length > 0 ? futureAppointments.map(a => (
              <div key={a.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <User size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-800 tracking-tight">{a.patientName}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{a.date} à {a.time}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase ${a.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {a.status}
                </span>
              </div>
            )) : (
              <div className="text-center py-12 text-gray-400 italic">Aucun rendez-vous futur enregistré</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
