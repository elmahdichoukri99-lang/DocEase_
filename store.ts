
import { AppState, DailyRecord, Patient, Prescription, DoctorSettings, PatientCategory } from './types';
import { INITIAL_MEDICINES, DEFAULT_SETTINGS } from './constants';

const STORAGE_KEY = 'medscript_data_v2';

export const getInitialState = (): AppState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    if (!parsed.appointments) parsed.appointments = [];
    return parsed;
  }
  return {
    currentDayRevenue: 0,
    history: [],
    patients: [],
    prescriptions: [],
    appointments: [
      { id: '1', patientName: 'Ahmed Rami', date: new Date().toISOString().split('T')[0], time: '10:30', status: 'confirmed' },
      { id: '2', patientName: 'Sara Bennani', date: new Date().toISOString().split('T')[0], time: '14:00', status: 'pending' }
    ],
    settings: DEFAULT_SETTINGS,
    medicines: INITIAL_MEDICINES,
  };
};

export const saveState = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const archiveDay = (state: AppState): AppState => {
  const today = new Date().toISOString().split('T')[0];
  const todaysPrescriptions = state.prescriptions.filter(p => p.date === today);
  const revenue = todaysPrescriptions.reduce((acc, p) => acc + p.invoiceAmount, 0);
  
  const segments = {
    [PatientCategory.MAN]: 0,
    [PatientCategory.WOMAN]: 0,
    [PatientCategory.CHILD]: 0,
  };

  todaysPrescriptions.forEach(p => {
    const patient = state.patients.find(pat => pat.id === p.patientId);
    if (patient) {
      segments[patient.category]++;
    }
  });

  const newRecord: DailyRecord = {
    date: today,
    totalRevenue: revenue,
    patientsCount: todaysPrescriptions.length,
    segments,
  };

  return {
    ...state,
    history: [newRecord, ...state.history],
    currentDayRevenue: 0,
  };
};
