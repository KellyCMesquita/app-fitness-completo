// Tipos do Quiz
export interface QuizData {
  id?: string;
  user_id?: string;
  name?: string;
  nome?: string;
  age?: number;
  idade?: number;
  height?: number; // em cm
  altura?: number;
  weight?: number; // em kg
  peso?: number;
  goal?: 'lose_weight' | 'gain_muscle' | 'maintain';
  objetivo?: string;
  training_level?: 'beginner' | 'intermediate' | 'advanced';
  nivel?: string;
  uses_medication?: boolean;
  usa_caneta?: boolean;
  medication_type?: string;
  caneta_tipo?: string;
  medication_dose?: string;
  medication_duration?: string;
  side_effects?: string[];
  imc?: number;
  created_at?: string;
}

// Tipos de Cálculos
export interface HealthMetrics {
  bmi: number;
  bmiCategory: string;
  dailyCalories: number;
  targetWeight?: number;
  recommendedWorkout: string;
}

// Tipos de Progresso
export interface Progress {
  id?: string;
  user_id: string;
  date: string;
  weight: number;
  bmi: number;
  calories_consumed?: number;
  workout_completed?: boolean;
  medication_taken?: boolean;
  notes?: string;
}

// Tipos de Refeições
export interface Meal {
  id?: string;
  user_id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  description: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

// Tipos de Treinos
export interface Workout {
  id?: string;
  user_id: string;
  date: string;
  workout_type: string;
  duration: number; // em minutos
  calories_burned?: number;
  completed: boolean;
  notes?: string;
}

// Tipos de Medicação
export interface MedicationTracking {
  id?: string;
  user_id: string;
  date: string;
  medication_type: string;
  dose: string;
  time_taken: string;
  side_effects?: string[];
  notes?: string;
}

// Tipos da API
export interface ApiUser {
  id: string;
  nome: string;
  idade: number;
  peso: number;
  altura: number;
  imc: number;
  nivel: string;
  usa_caneta: boolean;
  caneta_tipo?: string;
  objetivo: string;
  created_at?: string;
}

export interface ApiProgresso {
  id?: string;
  user_id: string;
  peso: number;
  humor?: string;
  fome?: string;
  colateral?: string;
  data?: string;
}

export interface ApiCanetaUso {
  id?: string;
  user_id: string;
  nome_caneta: string;
  dose_mg: number;
  data: string;
}
