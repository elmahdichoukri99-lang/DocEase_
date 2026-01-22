
import React from 'react';
import { Sun, ArrowRight, TrendingUp, Users, Calendar, FileText, CheckCircle, Shield, Clock } from 'lucide-react';
import { AppState, PatientCategory } from '../types';
import { Link } from 'react-router-dom';

interface DashboardProps {
  state: AppState;
  onNewDay: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onNewDay }) => {
  const today = new Date().toISOString().split('T')[0];
  const todaysPrescriptions = state.prescriptions.filter(p => p.date === today);
  const todaysRevenue = todaysPrescriptions.reduce((acc, p) => acc + p.invoiceAmount, 0);
  const todaysAppointments = state.appointments.filter(a => a.date === today);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Bonjour, <span className="text-[#10B981]">{state.settings.nameFr}</span></h2>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-gray-500 font-bold flex items-center gap-2">
              <Calendar size={16} className="text-[#10B981]" /> {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <p className="text-xs font-black text-[#10B981] uppercase tracking-widest flex items-center gap-1">
              <Shield size={12} /> DocEase Secure
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            if(window.confirm('Archiver la journée ?')) onNewDay();
          }}
          className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-4 rounded-2xl shadow-xl shadow-emerald-200 flex items-center gap-3 transition-all active:scale-95 font-black uppercase tracking-widest text-sm"
        >
          <Sun size={20} />
          Nouvelle Journée
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30 group hover:border-[#10B981]/20 transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-emerald-50 text-[#10B981] rounded-2xl">
              <TrendingUp size={28} />
            </div>
          </div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Honoraires du Jour</div>
          <div className="text-3xl font-black text-gray-900 mt-2">{todaysRevenue.toLocaleString()} <span className="text-[#10B981]">DH</span></div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30 group hover:border-[#10B981]/20 transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
              <Clock size={28} />
            </div>
            <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-1 rounded-full">{todaysAppointments.length}</span>
          </div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Rendez-vous du Jour</div>
          <div className="text-3xl font-black text-gray-900 mt-2">DocEase <span className="text-blue-200 text-2xl font-bold uppercase">Sync</span></div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30 group hover:border-[#10B981]/20 transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
              <CheckCircle size={28} />
            </div>
          </div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Patients Inscrits</div>
          <div className="text-3xl font-black text-gray-900 mt-2">{state.patients.length} <span className="text-purple-200 text-2xl font-bold uppercase">Dossiers</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-3 mb-8">
            <FileText size={24} className="text-[#10B981]" /> Activité de Consultation
          </h3>
          <div className="space-y-4">
            {todaysPrescriptions.slice(0, 5).map((p) => {
              const patient = state.patients.find(pat => pat.id === p.patientId);
              return (
                <div key={p.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-transparent hover:border-[#10B981]/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-black text-[#10B981] border border-emerald-100 shadow-sm">
                      {patient?.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-extrabold text-gray-800 tracking-tight">{patient?.name}</p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{patient?.category} • {patient?.age} ans</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900 text-lg">{p.invoiceAmount} DH</p>
                  </div>
                </div>
              );
            })}
            {todaysPrescriptions.length === 0 && (
              <div className="text-center py-20 text-gray-300">Aucune prescription aujourd'hui</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-emerald-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-2 tracking-tight">Nouvelle Consultation</h3>
              <p className="opacity-80 font-bold mb-8 max-w-xs">Gérez prescription et facturation en un clin d'oeil.</p>
              <Link to="/new-prescription" className="bg-white text-emerald-700 px-8 py-4 rounded-2xl font-black flex items-center gap-3 w-fit hover:scale-105 transition-all shadow-xl">
                Ouvrir DocEase <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30">
             <h3 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-widest text-xs">Patients par Catégorie</h3>
             <div className="space-y-6">
                {[PatientCategory.MAN, PatientCategory.WOMAN, PatientCategory.CHILD].map((cat) => {
                  const count = state.patients.filter(p => p.category === cat).length;
                  const total = state.patients.length || 1;
                  const perc = (count / total) * 100;
                  return (
                    <div key={cat} className="space-y-3">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                        <span className="text-gray-500">{cat}</span>
                        <span className="text-gray-900">{count}</span>
                      </div>
                      <div className="h-4 w-full bg-gray-50 rounded-full overflow-hidden p-0.5 border border-gray-100 shadow-inner">
                        <div className="h-full bg-[#10B981] rounded-full transition-all duration-1000" style={{ width: `${perc}%` }}></div>
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
