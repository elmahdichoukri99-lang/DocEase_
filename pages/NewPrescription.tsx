
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Printer, Save, User, Search, AlertTriangle, History, Receipt, CheckCircle, Quote, Info, Sparkles } from 'lucide-react';
import { AppState, Medicine, PrescriptionItem, Patient, PatientCategory, DrugInteraction } from '../types';
import { DRUG_INTERACTIONS } from '../constants';
import { v4 as uuidv4 } from 'uuid';

interface NewPrescriptionProps {
  state: AppState;
  onSave: (patient: Patient, items: PrescriptionItem[], amount: number, amountInWords: string) => void;
}

const NewPrescription: React.FC<NewPrescriptionProps> = ({ state, onSave }) => {
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<string>('');
  const [patientSex, setPatientSex] = useState<'M' | 'F'>('M');
  const [patientCategory, setPatientCategory] = useState<PatientCategory>(PatientCategory.MAN);
  const [items, setItems] = useState<PrescriptionItem[]>([]);
  const [amount, setAmount] = useState<string>('200');
  const [amountInWords, setAmountInWords] = useState('');
  const [searchMedicine, setSearchMedicine] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [warnings, setWarnings] = useState<DrugInteraction[]>([]);
  const [duplicates, setDuplicates] = useState<string[]>([]);

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ageNum = parseInt(patientAge);
    if (!isNaN(ageNum)) {
      if (ageNum < 15) setPatientCategory(PatientCategory.CHILD);
      else if (patientSex === 'F') setPatientCategory(PatientCategory.WOMAN);
      else setPatientCategory(PatientCategory.MAN);
    }
  }, [patientAge, patientSex]);

  useEffect(() => {
    const activeWarnings: DrugInteraction[] = [];
    const medIds = items.map(i => i.medicineId);
    
    // Safety check for interactions
    DRUG_INTERACTIONS.forEach(interaction => {
      const hasFirst = medIds.includes(interaction.drugs[0]);
      const hasSecond = medIds.includes(interaction.drugs[1]);
      if (hasFirst && hasSecond) activeWarnings.push(interaction);
    });
    setWarnings(activeWarnings);

    // Duplicates check
    const counts: Record<string, number> = {};
    medIds.forEach(id => { counts[id] = (counts[id] || 0) + 1; });
    setDuplicates(Object.keys(counts).filter(id => counts[id] > 1));

  }, [items]);

  const addItem = (med: Medicine) => {
    // Smart Integration: Exact drug name and AI-generated posology
    const newItem: PrescriptionItem = {
      id: uuidv4(),
      medicineId: med.id,
      medicineName: med.name, // Exact name from master list
      posology: med.defaultPosology[patientCategory] || med.defaultPosology[PatientCategory.MAN],
    };
    setItems([...items, newItem]);
    setSearchMedicine('');
    setShowResults(false);
  };

  const removeItem = (id: string) => setItems(items.filter(item => item.id !== id));
  const updatePosology = (id: string, pos: string) => setItems(items.map(i => i.id === id ? { ...i, posology: pos } : i));

  const handleSubmit = () => {
    if (!patientName || items.length === 0) return alert('Le nom du patient et au moins un médicament sont requis.');
    const patient: Patient = {
      id: uuidv4(),
      name: patientName,
      age: parseInt(patientAge) || 0,
      sex: patientSex,
      category: patientCategory,
      lastVisit: new Date().toISOString()
    };
    onSave(patient, items, parseFloat(amount), amountInWords);
    setPatientName(''); setPatientAge(''); setItems([]); setAmount('200'); setAmountInWords('');
    alert('Consultation et ordonnance enregistrées avec succès !');
  };

  const filteredMedicines = state.medicines.filter(m => 
    m.name.toLowerCase().includes(searchMedicine.toLowerCase()) || 
    m.category.toLowerCase().includes(searchMedicine.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500 pb-20">
      <header className="flex justify-between items-center no-print">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-[#10B981] rounded-2xl shadow-lg shadow-emerald-50">
            <Plus size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Consultation Digitale</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
              <Sparkles size={12} className="text-[#10B981]" /> Intelligence Assistive DocEase
            </p>
          </div>
        </div>
        <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2">
           <Info size={16} className="text-[#10B981]" />
           <p className="text-[10px] font-bold text-emerald-800 uppercase leading-tight">
             Note: Les suggestions AI sont assistives.<br/>La décision médicale finale appartient au médecin.
           </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 no-print">
        <div className="lg:col-span-7 space-y-6">
          {/* Patient Profile */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl space-y-6">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <User className="text-[#10B981]" size={20} /> Profil du Patient
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Nom Complet</span>
                <input type="text" value={patientName} onChange={e => setPatientName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#10B981] transition-all" placeholder="Ex: Ahmed Rami" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Âge</span>
                  <input type="number" value={patientAge} onChange={e => setPatientAge(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#10B981] transition-all" placeholder="Age" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Sexe</span>
                  <select value={patientSex} onChange={e => setPatientSex(e.target.value as 'M' | 'F')} className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#10B981] transition-all">
                    <option value="M">Masculin (M)</option>
                    <option value="F">Féminin (F)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Master List Search & Ordonnance */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl flex flex-col min-h-[450px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-gray-900">Ordonnance Intelligente</h3>
              <div className="relative w-64">
                <input 
                  type="text" 
                  value={searchMedicine} 
                  onChange={e => setSearchMedicine(e.target.value)} 
                  onFocus={() => setShowResults(true)} 
                  className="w-full pl-10 pr-4 py-2.5 bg-emerald-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#10B981] transition-all" 
                  placeholder="Chercher médicament..." 
                />
                <Search className="absolute left-3.5 top-3 text-[#10B981]" size={18} />
                {showResults && searchMedicine && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                    {filteredMedicines.map(m => (
                      <button key={m.id} onClick={() => addItem(m)} className="w-full px-4 py-3 text-left hover:bg-emerald-50 border-b border-gray-50 last:border-0 transition-colors">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-gray-800">{m.name}</p>
                          <Plus size={14} className="text-[#10B981]" />
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{m.category}</p>
                      </button>
                    ))}
                    {filteredMedicines.length === 0 && (
                      <div className="p-4 text-center text-gray-400 text-xs italic">Aucun résultat</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* AI Safety Panel */}
            {(warnings.length > 0 || duplicates.length > 0) && (
              <div className="mb-6 space-y-2">
                {duplicates.map((id, idx) => (
                  <div key={`dup-${idx}`} className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-3">
                    <AlertTriangle size={16} className="text-amber-600" />
                    <p className="text-xs font-bold text-amber-800 uppercase tracking-tight">Doublon Détecté: Médicament déjà présent dans l'ordonnance.</p>
                  </div>
                ))}
                {warnings.map((w, idx) => (
                  <div key={`warn-${idx}`} className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3">
                    <AlertTriangle size={16} className="text-red-600" />
                    <p className="text-xs font-bold text-red-800 uppercase tracking-tight">{w.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Editable Prescription List */}
            <div className="flex-1 space-y-4 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
              {items.map((it, idx) => (
                <div key={it.id} className="p-4 bg-gray-50 rounded-2xl flex gap-4 border border-transparent hover:border-emerald-200 transition-all group">
                  <div className="w-8 h-8 rounded-xl bg-white border flex items-center justify-center font-black text-[#10B981] text-xs shadow-sm">
                    {idx+1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="font-black uppercase text-sm tracking-tight text-gray-800">{it.medicineName}</p>
                      <button onClick={() => removeItem(it.id)} className="p-1 hover:bg-red-50 rounded-lg transition-colors group">
                        <Trash2 size={16} className="text-gray-300 group-hover:text-red-500" />
                      </button>
                    </div>
                    <textarea 
                      value={it.posology} 
                      onChange={e => updatePosology(it.id, e.target.value)} 
                      className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm font-bold text-gray-600 focus:ring-2 focus:ring-[#10B981] outline-none" 
                      rows={2}
                      placeholder="Posologie suggérée par AI..."
                    />
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="h-48 flex flex-col items-center justify-center text-gray-300 space-y-3 opacity-30">
                   <Receipt size={64} strokeWidth={1} />
                   <p className="font-black uppercase tracking-widest text-[10px]">Recherchez un médicament pour commencer</p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-8 border-t space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Facture (DH)</span>
                  <div className="flex items-center gap-3 bg-emerald-50 rounded-2xl px-4 py-2 border border-emerald-100">
                    <Receipt className="text-[#10B981]" size={20} />
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-20 bg-transparent font-black text-[#10B981] text-xl text-center focus:outline-none" />
                    <span className="font-black text-[#10B981]">DH</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Montant en lettres</span>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                    <Quote className="text-gray-300 shrink-0" size={18} />
                    <input type="text" value={amountInWords} onChange={e => setAmountInWords(e.target.value)} className="flex-1 bg-transparent font-bold text-gray-700 text-xs focus:outline-none" placeholder="Ex: Deux cents dirhams..." />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button onClick={() => window.print()} className="px-6 py-3 border-2 border-[#10B981] text-[#10B981] rounded-2xl font-black hover:bg-emerald-50 transition-all">IMPRIMER</button>
                <button onClick={handleSubmit} className="px-10 py-3 bg-[#10B981] text-white rounded-2xl font-black shadow-xl shadow-emerald-100 hover:bg-[#059669] transition-all transform active:scale-95">VALIDER LA VISITE</button>
              </div>
            </div>
          </div>
        </div>

        {/* Paper Preview */}
        <div className="lg:col-span-5 hidden lg:block sticky top-8 h-fit">
          <div className="bg-white shadow-2xl border p-12 aspect-[1/1.41] relative overflow-hidden ring-1 ring-gray-100">
            {state.settings.logoUrl && (
              <div 
                className="absolute pointer-events-none select-none z-0"
                style={{ 
                  top: `${state.settings.logoY}%`, 
                  left: `${state.settings.logoX}%`, 
                  transform: `translate(-50%, -50%) scale(${state.settings.logoScale})`,
                  opacity: state.settings.logoOpacity 
                }}
              >
                <img src={state.settings.logoUrl} alt="Logo" className="max-w-[280px] grayscale" />
              </div>
            )}
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between border-b-2 border-emerald-500 pb-4 mb-6">
                <div className="text-left"><p className="text-lg font-black text-emerald-800 leading-tight">{state.settings.nameFr}</p><p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{state.settings.specialtyFr}</p></div>
                <div className="text-right font-arabic" dir="rtl"><p className="text-2xl font-black text-emerald-800">{state.settings.nameAr}</p><p className="text-sm font-bold text-gray-500">{state.settings.specialtyAr}</p></div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl mb-8 flex justify-between font-bold text-[10px] uppercase tracking-wider text-gray-600 border border-gray-100">
                <p>Patient: <span className="text-gray-900">{patientName || '---'}</span></p>
                <p>Catégorie: <span className="text-emerald-600">{patientCategory}</span></p>
                <p>Date: <span className="text-gray-900">{new Date().toLocaleDateString('fr-FR')}</span></p>
              </div>
              <div className="flex-1 space-y-6">
                <p className="text-center font-black uppercase text-[10px] tracking-[0.4em] mb-10 text-emerald-600">Ordonnance</p>
                <div className="space-y-6">
                  {items.map((it, idx) => (
                    <div key={idx} className="flex gap-4">
                      <span className="font-black text-emerald-300 text-lg leading-none">{idx+1}.</span>
                      <div className="space-y-1">
                        <p className="font-black text-sm uppercase text-gray-900 tracking-tight">{it.medicineName}</p>
                        <p className="text-[11px] text-gray-600 font-bold italic leading-relaxed whitespace-pre-wrap">{it.posology}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-8 border-t border-gray-100 flex justify-between items-end text-[8px] font-bold text-gray-300 uppercase tracking-widest">
                <p>Cachet et Signature</p>
                <p className="text-[#10B981] flex items-center gap-1">DocEase Intelligence Assistée <CheckCircle size={8} /></p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
             <Info size={20} className="text-blue-500 shrink-0 mt-1" />
             <p className="text-[10px] font-bold text-blue-800 leading-relaxed uppercase">
               Aperçu Numérique Fidèle: L'impression directe respectera ce format. Assurez-vous d'avoir configuré votre en-tête dans les paramètres.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPrescription;
