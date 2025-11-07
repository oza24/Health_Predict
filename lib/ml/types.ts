// Machine Learning Types for Disease Prediction

export interface SymptomData {
  id: string;
  name: string;
  category: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration?: number; // in days
}

export interface DiseaseData {
  id: string;
  name: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  symptoms: string[]; // symptom IDs
  treatments: string[];
  prevention: string[];
}

export interface TrainingDataPoint {
  id: string;
  symptoms: string[]; // array of symptom IDs
  disease: string; // disease ID
  age?: number;
  gender?: 'male' | 'female' | 'other';
  medicalHistory?: string[];
  outcome: 'confirmed' | 'ruled_out' | 'pending';
  confidence: number; // 0-1
}

export interface PredictionRequest {
  symptoms: string[];
  age?: number;
  gender?: 'male' | 'female' | 'other';
  medicalHistory?: string[];
}

export interface PredictionResult {
  disease: string;
  probability: number;
  confidence: number;
  description: string;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
  alternativeDiagnoses?: Array<{
    disease: string;
    probability: number;
  }>;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
  trainingLoss: number[];
  validationLoss: number[];
}

export interface ModelConfig {
  algorithm: 'random_forest' | 'neural_network' | 'svm' | 'gradient_boosting';
  maxDepth?: number;
  nEstimators?: number;
  learningRate?: number;
  hiddenLayers?: number[];
  regularization?: number;
  testSize: number;
  randomState: number;
}

export interface TrainingJob {
  id: string;
  status: 'pending' | 'training' | 'completed' | 'failed';
  config: ModelConfig;
  metrics?: ModelMetrics;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
  modelPath?: string;
}
