
export enum PatientCategory {
  MAN = 'Homme',
  WOMAN = 'Femme',
  CHILD = 'Enfant'
}

export interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed';
}

export interface Medicine {
  id: string;
  name: string;
  defaultPosology: {
    [key in PatientCategory]: string;
  };
  category: string;
}

export interface DrugInteraction {
  drugs: [string, string];
  severity: 'moderate' | 'high';
  message: string;
}

export interface PrescriptionItem {
  id: string;
  medicineId: string;
  medicineName: string;
  posology: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  sex: 'M' | 'F';
  category: PatientCategory;
  lastVisit?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  date: string;
  items: PrescriptionItem[];
  invoiceAmount: number;
  amountInWords?: string;
}

export interface DailyRecord {
  date: string;
  totalRevenue: number;
  patientsCount: number;
  segments: {
    [key in PatientCategory]: number;
  };
}

export interface DoctorSettings {
  nameFr: string;
  specialtyFr: string;
  diplomaFr: string;
  nameAr: string;
  specialtyAr: string;
  diplomaAr: string;
  logoUrl: string | null;
  logoOpacity: number;
  logoX: number;
  logoY: number;
  logoScale: number;
  textSize: number;
}

export interface AppState {
  currentDayRevenue: number;
  history: DailyRecord[];
  patients: Patient[];
  prescriptions: Prescription[];
  appointments: Appointment[];
  settings: DoctorSettings;
  medicines: Medicine[];
}
