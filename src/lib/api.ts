// Utilitários para chamadas à API do Health Life

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Erro desconhecido',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de rede',
      };
    }
  }

  // Quiz / Usuários
  async createUser(userData: {
    name: string;
    age: number;
    weight: number;
    height: number;
    goal: string;
    uses_medication?: boolean;
    medication_type?: string;
    training_level?: string;
  }) {
    return this.request('/quiz', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUser(userId: string) {
    return this.request(`/quiz?userId=${userId}`);
  }

  // Treinos
  async getWorkouts(userId: string, level?: string) {
    const params = new URLSearchParams({ userId });
    if (level) params.append('level', level);
    return this.request(`/workouts?${params.toString()}`);
  }

  async logWorkout(data: {
    userId: string;
    workoutId: string;
    completed: boolean;
    date?: string;
  }) {
    return this.request('/workouts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Dieta
  async getMealPlan(userId: string, goal?: string) {
    const params = new URLSearchParams({ userId });
    if (goal) params.append('goal', goal);
    return this.request(`/meals?${params.toString()}`);
  }

  async logMeal(data: {
    userId: string;
    mealTime: string;
    calories?: number;
    completed: boolean;
    date?: string;
  }) {
    return this.request('/meals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Progresso
  async getProgress(userId: string, period: number = 7) {
    return this.request(`/progress?userId=${userId}&period=${period}`);
  }

  async logWeight(data: {
    userId: string;
    weight: number;
    date?: string;
  }) {
    return this.request('/progress', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Medicação
  async getMedicationReminders(userId: string) {
    return this.request(`/medication?userId=${userId}`);
  }

  async createMedicationReminder(data: {
    userId: string;
    medicationType: string;
    dose: string;
    reminderTime: string;
    frequency?: string;
  }) {
    return this.request('/medication', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logMedicationTaken(data: {
    reminderId: string;
    taken: boolean;
    takenAt?: string;
  }) {
    return this.request('/medication', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMedicationReminder(reminderId: string) {
    return this.request(`/medication?reminderId=${reminderId}`, {
      method: 'DELETE',
    });
  }
}

// Instância global do cliente
export const api = new ApiClient();

// Hooks React para usar com a API
export function useApi() {
  return api;
}

// Utilitários de formatação
export const formatters = {
  weight: (weight: number) => `${weight.toFixed(1)} kg`,
  height: (height: number) => `${height} cm`,
  bmi: (bmi: number) => bmi.toFixed(1),
  calories: (calories: number) => `${calories} kcal`,
  date: (date: string) => new Date(date).toLocaleDateString('pt-BR'),
  time: (time: string) => time.substring(0, 5), // HH:MM
};

// Validadores
export const validators = {
  isValidWeight: (weight: number) => weight > 0 && weight < 500,
  isValidHeight: (height: number) => height > 0 && height < 300,
  isValidAge: (age: number) => age > 0 && age < 150,
  isValidCalories: (calories: number) => calories > 0 && calories < 10000,
};

// Constantes
export const GOALS = {
  lose_weight: 'Perder Peso',
  gain_muscle: 'Ganhar Massa',
  maintain: 'Manter Forma',
} as const;

export const TRAINING_LEVELS = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
} as const;

export const FREQUENCIES = {
  daily: 'Diário',
  weekly: 'Semanal',
  monthly: 'Mensal',
} as const;
