
import React, { useState } from 'react';
import { Save, Languages, Layout, Move, Type, Pill, Plus, Trash2, Edit3, X, Sparkles } from 'lucide-react';
import { DoctorSettings, Medicine, PatientCategory } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface SettingsProps {
  settings: DoctorSettings;
  onUpdate: (newSettings: DoctorSettings) => void;
  medicines: Medicine[];
  onUpdateMedicines: (medicines: Medicine[]) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdate, medicines, onUpdateMedicines }) => {
  const [localSettings, setLocalSettings] = useState<DoctorSettings>(settings);
  const [localMedicines, setLocalMedicines] = useState<Medicine[]>(medicines);
  const [isAddingMed, setIsAddingMed] = useState(false);
  const [newMed, setNewMed] = useState<Partial<Medicine>>({
    name: '',
    category: '',
    defaultPosology: {
      [PatientCategory.MAN]: '',
      [PatientCategory.WOMAN]: '',
      [PatientCategory.CHILD]: '',
    }
  });

  const handleAddMed = () => {
    if (!newMed.name) return alert('Le nom du médicament est requis.');
    const med: Medicine = {
      id: uuidv4(),
      name: newMed.name!,
      category: newMed.category || 'Général',
      defaultPosology: newMed.defaultPosology as Medicine['defaultPosology'],
    };
    const updated = [med, ...localMedicines];
    setLocalMedicines(updated);
    onUpdateMedicines(updated);
    setIsAddingMed(false);
    setNewMed({ name: '', category: '', defaultPosology: { [PatientCategory.MAN]: '', [PatientCategory.WOMAN]: '', [PatientCategory.CHILD]: '' } });
  };

  const removeMed = (id: string) => {
    const updated = localMedicines.filter(m => m.id !== id);
    setLocalMedicines(updated);
    onUpdateMedicines(updated);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Configuration Cabinet</h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Personnalisation DocEase Suite</p>
        </div>
        <button onClick={() => { onUpdate(localSettings); alert('Paramètres enregistrés !'); }} className="bg-[#10B981] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-100 hover:bg-[#059669] transition-all transform active:scale-95">
          SAUVEGARDER TOUT
        </button>
      </header>

      {/* Medication Master List Management */}
      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black flex items-center gap-3"><Pill className="text-[#10B981]" size={24} /> Base de Données Médicaments</h3>
          <button 
            onClick={() => setIsAddingMed(!isAddingMed)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-[#10B981] rounded-xl font-black text-xs uppercase hover:bg-emerald-100 transition-all"
          >
            {isAddingMed ? <X size={16} /> : <Plus size={16} />}
            {isAddingMed ? 'Annuler' : 'Ajouter un Médicament'}
          </button>
        </div>

        {isAddingMed && (
          <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-emerald-100 animate-in zoom-in-95 duration-200 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Nom Exact (Base Ordonnance)</span>
                <input 
                  type="text" 
                  value={newMed.name} 
                  onChange={e => setNewMed({...newMed, name: e.target.value})} 
                  className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-[#10B981] transition-all" 
                  placeholder="Ex: Doliprane 1g" 
                />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Classe / Catégorie</span>
                <input 
                  type="text" 
                  value={newMed.category} 
                  onChange={e => setNewMed({...newMed, category: e.target.value})} 
                  className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-[#10B981] transition-all" 
                  placeholder="Ex: Analgésique" 
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
               <div className="space-y-2">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-2">Posologie AI: Homme</span>
                  <textarea value={newMed.defaultPosology?.Homme} onChange={e => setNewMed({...newMed, defaultPosology: {...newMed.defaultPosology!, Homme: e.target.value}})} className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-xs" rows={3} />
               </div>
               <div className="space-y-2">
                  <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-2">Posologie AI: Femme</span>
                  <textarea value={newMed.defaultPosology?.Femme} onChange={e => setNewMed({...newMed, defaultPosology: {...newMed.defaultPosology!, Femme: e.target.value}})} className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-xs" rows={3} />
               </div>
               <div className="space-y-2">
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest ml-2">Posologie AI: Enfant</span>
                  <textarea value={newMed.defaultPosology?.Enfant} onChange={e => setNewMed({...newMed, defaultPosology: {...newMed.defaultPosology!, Enfant: e.target.value}})} className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-xs" rows={3} />
               </div>
            </div>
            <div className="flex justify-end">
              <button onClick={handleAddMed} className="px-8 py-3 bg-[#10B981] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-50">Confirmer Ajout</button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                <th className="py-4 px-4">Médicament</th>
                <th className="py-4 px-4">Classe</th>
                <th className="py-4 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {localMedicines.map((m) => (
                <tr key={m.id} className="border-b hover:bg-emerald-50 transition-colors group">
                  <td className="py-4 px-4 font-black text-gray-800">{m.name}</td>
                  <td className="py-4 px-4"><span className="text-[10px] font-black bg-gray-100 text-gray-500 px-3 py-1 rounded-full">{m.category}</span></td>
                  <td className="py-4 px-4">
                    <button onClick={() => removeMed(m.id)} className="p-2 text-gray-300 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl space-y-8">
        <h3 className="text-xl font-black flex items-center gap-3"><Type className="text-[#10B981]" size={24} /> Accessibilité</h3>
        <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl">
          <span className="text-sm font-black uppercase tracking-widest text-gray-500">Taille du texte Interface</span>
          <input type="range" min="12" max="24" value={localSettings.textSize} onChange={e => setLocalSettings({...localSettings, textSize: parseInt(e.target.value)})} className="flex-1 h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
          <span className="font-black text-[#10B981]">{localSettings.textSize}px</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6">
          <div className="flex items-center gap-4"><Languages size={24} className="text-blue-500"/><h3 className="text-xs font-black uppercase tracking-widest text-blue-500">FRANÇAIS</h3></div>
          <input type="text" value={localSettings.nameFr} onChange={e => setLocalSettings({...localSettings, nameFr: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-bold" placeholder="Dr. Nom" />
          <input type="text" value={localSettings.specialtyFr} onChange={e => setLocalSettings({...localSettings, specialtyFr: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-bold" placeholder="Spécialité" />
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6 text-right font-arabic" dir="rtl">
          <div className="flex items-center gap-4 flex-row-reverse"><Languages size={24} className="text-[#10B981]"/><h3 className="text-2xl font-black text-[#10B981]">العربية</h3></div>
          <input type="text" value={localSettings.nameAr} onChange={e => setLocalSettings({...localSettings, nameAr: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-black text-xl" placeholder="الاسم" />
          <input type="text" value={localSettings.specialtyAr} onChange={e => setLocalSettings({...localSettings, specialtyAr: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-black text-xl" placeholder="التخصص" />
        </div>
      </div>
    </div>
  );
};

export default Settings;
