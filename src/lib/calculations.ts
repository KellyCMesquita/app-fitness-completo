import { QuizData, HealthMetrics } from './types';

// Cálculo de IMC
export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

// Classificação do IMC
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Baixo peso';
  if (bmi < 25) return 'Peso normal';
  if (bmi < 30) return 'Sobrepeso';
  return 'Obesidade';
}

// Cálculo de calorias diárias (Fórmula de Harris-Benedict)
export function calculateDailyCalories(quizData: QuizData): number {
  const { age, weight, height, goal, training_level, uses_medication } = quizData;
  
  // TMB (Taxa Metabólica Basal) - usando fórmula simplificada
  let bmr = 10 * weight + 6.25 * height - 5 * age + 5; // Para homens (média)
  
  // Fator de atividade
  let activityFactor = 1.2; // Sedentário
  if (training_level === 'beginner') activityFactor = 1.375;
  if (training_level === 'intermediate') activityFactor = 1.55;
  if (training_level === 'advanced') activityFactor = 1.725;
  
  let dailyCalories = bmr * activityFactor;
  
  // Ajuste baseado no objetivo
  if (goal === 'lose_weight') {
    dailyCalories -= 500; // Déficit calórico
  } else if (goal === 'gain_muscle') {
    dailyCalories += 300; // Superávit calórico
  }
  
  // Ajuste para usuários de caneta (tendem a ter menos apetite)
  if (uses_medication) {
    dailyCalories *= 0.85; // Redução de 15%
  }
  
  return Math.round(dailyCalories);
}

// Peso alvo baseado no objetivo
export function calculateTargetWeight(quizData: QuizData): number {
  const { weight, height, goal } = quizData;
  const bmi = calculateBMI(weight, height);
  
  if (goal === 'lose_weight') {
    // Alvo: IMC 22 (peso saudável)
    const heightInMeters = height / 100;
    return Math.round(22 * heightInMeters * heightInMeters);
  } else if (goal === 'gain_muscle') {
    // Alvo: +5kg
    return weight + 5;
  }
  
  return weight; // Manter peso
}

// Recomendação de treino
export function getWorkoutRecommendation(quizData: QuizData): string {
  const { training_level, uses_medication, goal } = quizData;
  
  if (uses_medication) {
    return 'Treinos leves a moderados: caminhada, yoga, pilates e musculação leve. Evite exercícios muito intensos enquanto se adapta à medicação.';
  }
  
  if (training_level === 'beginner') {
    return goal === 'gain_muscle' 
      ? 'Treino de força 3x/semana com exercícios básicos (agachamento, supino, remada)'
      : 'Cardio leve 3x/semana + caminhadas diárias';
  }
  
  if (training_level === 'intermediate') {
    return goal === 'gain_muscle'
      ? 'Treino de hipertrofia 4x/semana com divisão de grupos musculares'
      : 'HIIT 3x/semana + musculação 2x/semana';
  }
  
  return goal === 'gain_muscle'
    ? 'Treino avançado 5-6x/semana com periodização e técnicas avançadas'
    : 'Treino funcional intenso 5x/semana + cardio estratégico';
}

// Gerar métricas completas
export function generateHealthMetrics(quizData: QuizData): HealthMetrics {
  const bmi = calculateBMI(quizData.weight, quizData.height);
  
  return {
    bmi,
    bmiCategory: getBMICategory(bmi),
    dailyCalories: calculateDailyCalories(quizData),
    targetWeight: calculateTargetWeight(quizData),
    recommendedWorkout: getWorkoutRecommendation(quizData),
  };
}
