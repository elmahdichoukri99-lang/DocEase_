
import { Medicine, DoctorSettings, PatientCategory, DrugInteraction } from './types';

export const INITIAL_MEDICINES: Medicine[] = [
  { 
    id: '1', 
    name: 'Aclav 1g SA', 
    category: 'Antibiotique',
    defaultPosology: {
      [PatientCategory.MAN]: '1 sachet toutes les 12 heures pendant 7 jours',
      [PatientCategory.WOMAN]: '1 sachet toutes les 12 heures pendant 7 jours',
      [PatientCategory.CHILD]: 'Dose de 80mg/kg/jour répartie en 2 prises',
    }
  },
  { 
    id: '2', 
    name: 'Doliprane 1g comprimé effervescent', 
    category: 'Analgésique',
    defaultPosology: {
      [PatientCategory.MAN]: '1 comprimé toutes les 8 heures en cas de douleur',
      [PatientCategory.WOMAN]: '1 comprimé toutes les 8 heures en cas de douleur',
      [PatientCategory.CHILD]: '60 mg/kg/jour en 4 ou 6 prises (utiliser Doliprane Pédiatrique)',
    }
  },
  { 
    id: '3', 
    name: 'Amoxicilline 500mg', 
    category: 'Antibiotique',
    defaultPosology: {
      [PatientCategory.MAN]: '1 gélule 3 fois par jour pendant 7 jours',
      [PatientCategory.WOMAN]: '1 gélule 3 fois par jour pendant 7 jours',
      [PatientCategory.CHILD]: '50mg/kg/jour en 3 prises',
    }
  },
  { 
    id: '4', 
    name: 'Spasfon Lyoc 80mg', 
    category: 'Antispasmodique',
    defaultPosology: {
      [PatientCategory.MAN]: '2 lyoc au moment de la crise, à renouveler si besoin',
      [PatientCategory.WOMAN]: '2 lyoc au moment de la crise, max 6 par jour',
      [PatientCategory.CHILD]: '1 lyoc dissous dans un peu d\'eau',
    }
  },
  { 
    id: '5', 
    name: 'Ventoline 100µg Inhalateur', 
    category: 'Bronchodilatateur',
    defaultPosology: {
      [PatientCategory.MAN]: '2 bouffées en cas de crise, max 8 par jour',
      [PatientCategory.WOMAN]: '2 bouffées en cas de crise, max 8 par jour',
      [PatientCategory.CHILD]: '1 à 2 bouffées selon l\'âge et la sévérité',
    }
  }
];

export const DRUG_INTERACTIONS: DrugInteraction[] = [
  {
    drugs: ['3', '1'], 
    severity: 'moderate',
    message: 'Risque de duplication de classe antibiotique (Pénicillines).'
  }
];

export const DEFAULT_SETTINGS: DoctorSettings = {
  nameFr: 'Dr. Jean Dupont',
  specialtyFr: 'Médecin Généraliste',
  diplomaFr: 'Faculté de Médecine de Paris',
  nameAr: 'د. جان دوبون',
  specialtyAr: 'طبيب عام',
  diplomaAr: 'كلية الطب بباريس',
  logoUrl: null,
  logoOpacity: 0.1,
  logoX: 50,
  logoY: 50,
  logoScale: 1,
  textSize: 16,
};

export const COLORS = {
  primary: '#10B981', 
  primaryDark: '#059669', 
  bg: '#f8fafc',
  white: '#ffffff',
};
