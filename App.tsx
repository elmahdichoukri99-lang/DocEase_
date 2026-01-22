
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import NewPrescription from './pages/NewPrescription';
import Appointments from './pages/Appointments';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import { AppState, DoctorSettings, Patient, PrescriptionItem, Prescription, Appointment, Medicine } from './types';
import { getInitialState, saveState, archiveDay } from './store';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(getInitialState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const handleNewDay = () => setState(prev => archiveDay(prev));
  const handleUpdateSettings = (newSettings: DoctorSettings) => setState(prev => ({ ...prev, settings: newSettings }));
  const handleUpdateMedicines = (newMedicines: Medicine[]) => setState(prev => ({ ...prev, medicines: newMedicines }));

  const handleSavePrescription = (patient: Patient, items: PrescriptionItem[], amount: number, amountInWords: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newPrescription: Prescription = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: patient.id,
      date: today,
      items,
      invoiceAmount: amount,
      amountInWords,
    };
    setState(prev => ({
      ...prev,
      patients: [...prev.patients, patient],
      prescriptions: [...prev.prescriptions, newPrescription],
      currentDayRevenue: prev.currentDayRevenue + amount,
    }));
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50" style={{ fontSize: `${state.settings.textSize}px` }}>
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard state={state} onNewDay={handleNewDay} />} />
            <Route path="/new-prescription" element={<NewPrescription state={state} onSave={handleSavePrescription} />} />
            <Route path="/appointments" element={<Appointments state={state} />} />
            <Route path="/patients" element={
              <div className="bg-white p-8 rounded-[2.5rem] border shadow-xl">
                <h2 className="text-3xl font-black mb-6">Dossiers Médicaux</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">
                        <th className="py-4 px-4">Patient</th>
                        <th className="py-4 px-4">Âge</th>
                        <th className="py-4 px-4">Catégorie</th>
                        <th className="py-4 px-4">Dernière Visite</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.patients.map((p, idx) => (
                        <tr key={idx} className="border-b hover:bg-emerald-50 transition-colors">
                          <td className="py-4 px-4 font-black text-gray-800">{p.name}</td>
                          <td className="py-4 px-4 font-bold">{p.age} ans</td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#10B981] text-[10px] font-black uppercase">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-xs font-bold text-gray-400">{p.lastVisit?.split('T')[0] || '---'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            } />
            <Route path="/analytics" element={<Analytics state={state} />} />
            <Route path="/settings" element={<Settings settings={state.settings} onUpdate={handleUpdateSettings} medicines={state.medicines} onUpdateMedicines={handleUpdateMedicines} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
