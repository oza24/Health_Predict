// Dataset management for disease prediction

import { SymptomData, DiseaseData, TrainingDataPoint } from './types';

// Sample symptom data - in a real application, this would come from a database
export const SYMPTOMS: SymptomData[] = [
  // Respiratory symptoms
  { id: 'cough', name: 'Cough', category: 'respiratory', severity: 'moderate' },
  { id: 'shortness_breath', name: 'Shortness of breath', category: 'respiratory', severity: 'severe' },
  { id: 'chest_pain', name: 'Chest pain', category: 'respiratory', severity: 'severe' },
  { id: 'runny_nose', name: 'Runny nose', category: 'respiratory', severity: 'mild' },
  { id: 'sore_throat', name: 'Sore throat', category: 'respiratory', severity: 'moderate' },
  { id: 'sneezing', name: 'Sneezing', category: 'respiratory', severity: 'mild' },
  
  // Gastrointestinal symptoms
  { id: 'nausea', name: 'Nausea', category: 'gastrointestinal', severity: 'moderate' },
  { id: 'vomiting', name: 'Vomiting', category: 'gastrointestinal', severity: 'moderate' },
  { id: 'diarrhea', name: 'Diarrhea', category: 'gastrointestinal', severity: 'moderate' },
  { id: 'abdominal_pain', name: 'Abdominal pain', category: 'gastrointestinal', severity: 'moderate' },
  { id: 'loss_appetite', name: 'Loss of appetite', category: 'gastrointestinal', severity: 'mild' },
  
  // Neurological symptoms
  { id: 'headache', name: 'Headache', category: 'neurological', severity: 'moderate' },
  { id: 'dizziness', name: 'Dizziness', category: 'neurological', severity: 'moderate' },
  { id: 'fatigue', name: 'Fatigue', category: 'neurological', severity: 'mild' },
  { id: 'confusion', name: 'Confusion', category: 'neurological', severity: 'severe' },
  
  // Systemic symptoms
  { id: 'fever', name: 'Fever', category: 'systemic', severity: 'moderate' },
  { id: 'chills', name: 'Chills', category: 'systemic', severity: 'moderate' },
  { id: 'sweating', name: 'Excessive sweating', category: 'systemic', severity: 'mild' },
  { id: 'weight_loss', name: 'Unexpected weight loss', category: 'systemic', severity: 'severe' },
  { id: 'muscle_aches', name: 'Muscle aches', category: 'systemic', severity: 'moderate' },
  
  // Skin symptoms
  { id: 'rash', name: 'Skin rash', category: 'dermatological', severity: 'moderate' },
  { id: 'itching', name: 'Itching', category: 'dermatological', severity: 'mild' },
  { id: 'swelling', name: 'Swelling', category: 'dermatological', severity: 'moderate' },
];

// Sample disease data
export const DISEASES: DiseaseData[] = [
  {
    id: 'common_cold',
    name: 'Common Cold',
    description: 'A viral infection of the upper respiratory tract',
    category: 'respiratory',
    severity: 'low',
    symptoms: ['cough', 'runny_nose', 'sore_throat', 'fatigue', 'headache', 'sneezing'],
    treatments: ['Rest', 'Hydration', 'Over-the-counter pain relievers', 'Throat lozenges'],
    prevention: ['Hand hygiene', 'Avoid close contact with sick people', 'Boost immune system']
  },
  {
    id: 'flu',
    name: 'Influenza (Flu)',
    description: 'A viral infection affecting the respiratory system',
    category: 'respiratory',
    severity: 'medium',
    symptoms: ['fever', 'cough', 'fatigue', 'headache', 'chills', 'shortness_breath', 'muscle_aches', 'sore_throat'],
    treatments: ['Antiviral medication', 'Rest', 'Hydration', 'Pain relievers', 'Fever reducers'],
    prevention: ['Annual flu vaccination', 'Hand hygiene', 'Avoid crowds during flu season', 'Stay home when sick']
  },
  {
    id: 'covid19',
    name: 'COVID-19',
    description: 'Coronavirus disease caused by SARS-CoV-2',
    category: 'respiratory',
    severity: 'high',
    symptoms: ['fever', 'cough', 'shortness_breath', 'fatigue', 'loss_appetite', 'chest_pain', 'headache', 'muscle_aches'],
    treatments: ['Supportive care', 'Antiviral medication (if severe)', 'Hospitalization if needed', 'Oxygen therapy'],
    prevention: ['Vaccination', 'Mask wearing', 'Social distancing', 'Hand hygiene', 'Good ventilation']
  },
  {
    id: 'gastroenteritis',
    name: 'Viral Gastroenteritis',
    description: 'Inflammation of the stomach and intestines caused by a virus',
    category: 'gastrointestinal',
    severity: 'medium',
    symptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal_pain', 'fever'],
    treatments: ['Hydration', 'BRAT diet', 'Rest', 'Anti-nausea medication'],
    prevention: ['Hand hygiene', 'Food safety', 'Avoid contaminated water']
  },
  {
    id: 'migraine',
    name: 'Migraine',
    description: 'A neurological condition characterized by severe headaches',
    category: 'neurological',
    severity: 'medium',
    symptoms: ['headache', 'nausea', 'dizziness', 'fatigue', 'sensitivity_light'],
    treatments: ['Pain medication', 'Rest in dark room', 'Hydration', 'Preventive medication'],
    prevention: ['Identify triggers', 'Regular sleep schedule', 'Stress management']
  },
  {
    id: 'allergic_reaction',
    name: 'Allergic Reaction',
    description: 'Immune system response to allergens',
    category: 'allergic',
    severity: 'medium',
    symptoms: ['rash', 'itching', 'swelling', 'shortness_breath', 'nausea'],
    treatments: ['Antihistamines', 'Epinephrine (if severe)', 'Avoid allergen'],
    prevention: ['Identify allergens', 'Carry emergency medication', 'Avoid triggers']
  }
];

// Sample training data - in a real application, this would come from medical records
export const TRAINING_DATA: TrainingDataPoint[] = [
  // Common cold cases
  {
    id: '1',
    symptoms: ['cough', 'runny_nose', 'sore_throat'],
    disease: 'common_cold',
    age: 25,
    gender: 'male',
    outcome: 'confirmed',
    confidence: 0.9
  },
  {
    id: '2',
    symptoms: ['cough', 'runny_nose', 'fatigue'],
    disease: 'common_cold',
    age: 30,
    gender: 'female',
    outcome: 'confirmed',
    confidence: 0.85
  },
  
  // Flu cases
  {
    id: '3',
    symptoms: ['fever', 'cough', 'fatigue', 'headache'],
    disease: 'flu',
    age: 35,
    gender: 'male',
    outcome: 'confirmed',
    confidence: 0.9
  },
  {
    id: '4',
    symptoms: ['fever', 'chills', 'fatigue', 'shortness_breath'],
    disease: 'flu',
    age: 28,
    gender: 'female',
    outcome: 'confirmed',
    confidence: 0.88
  },
  
  // COVID-19 cases
  {
    id: '5',
    symptoms: ['fever', 'cough', 'shortness_breath', 'fatigue'],
    disease: 'covid19',
    age: 45,
    gender: 'male',
    outcome: 'confirmed',
    confidence: 0.95
  },
  {
    id: '6',
    symptoms: ['fever', 'loss_appetite', 'fatigue', 'chest_pain'],
    disease: 'covid19',
    age: 52,
    gender: 'female',
    outcome: 'confirmed',
    confidence: 0.92
  },
  
  // Gastroenteritis cases
  {
    id: '7',
    symptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal_pain'],
    disease: 'gastroenteritis',
    age: 22,
    gender: 'male',
    outcome: 'confirmed',
    confidence: 0.9
  },
  {
    id: '8',
    symptoms: ['nausea', 'diarrhea', 'fever'],
    disease: 'gastroenteritis',
    age: 38,
    gender: 'female',
    outcome: 'confirmed',
    confidence: 0.87
  },
  
  // Migraine cases
  {
    id: '9',
    symptoms: ['headache', 'nausea', 'dizziness'],
    disease: 'migraine',
    age: 29,
    gender: 'female',
    outcome: 'confirmed',
    confidence: 0.88
  },
  {
    id: '10',
    symptoms: ['headache', 'fatigue', 'nausea'],
    disease: 'migraine',
    age: 34,
    gender: 'male',
    outcome: 'confirmed',
    confidence: 0.85
  },
  
  // Allergic reaction cases
  {
    id: '11',
    symptoms: ['rash', 'itching', 'swelling'],
    disease: 'allergic_reaction',
    age: 26,
    gender: 'female',
    outcome: 'confirmed',
    confidence: 0.9
  },
  {
    id: '12',
    symptoms: ['rash', 'shortness_breath', 'nausea'],
    disease: 'allergic_reaction',
    age: 31,
    gender: 'male',
    outcome: 'confirmed',
    confidence: 0.93
  }
];

// Utility functions for dataset management
export class DatasetManager {
  static getSymptomById(id: string): SymptomData | undefined {
    return SYMPTOMS.find(symptom => symptom.id === id);
  }
  
  static getDiseaseById(id: string): DiseaseData | undefined {
    return DISEASES.find(disease => disease.id === id);
  }
  
  static getSymptomsByCategory(category: string): SymptomData[] {
    return SYMPTOMS.filter(symptom => symptom.category === category);
  }
  
  static getDiseasesByCategory(category: string): DiseaseData[] {
    return DISEASES.filter(disease => disease.category === category);
  }
  
  static getTrainingDataByDisease(diseaseId: string): TrainingDataPoint[] {
    return TRAINING_DATA.filter(data => data.disease === diseaseId);
  }
  
  static getAllSymptomIds(): string[] {
    return SYMPTOMS.map(symptom => symptom.id);
  }
  
  static getAllDiseaseIds(): string[] {
    return DISEASES.map(disease => disease.id);
  }
  
  static validateSymptomIds(symptomIds: string[]): { valid: string[], invalid: string[] } {
    const allSymptomIds = this.getAllSymptomIds();
    const valid = symptomIds.filter(id => allSymptomIds.includes(id));
    const invalid = symptomIds.filter(id => !allSymptomIds.includes(id));
    return { valid, invalid };
  }
  
  static validateDiseaseId(diseaseId: string): boolean {
    return this.getAllDiseaseIds().includes(diseaseId);
  }
}
