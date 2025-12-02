// Cliente direto para API REST do Supabase usando a configuração de services.json
import servicesConfig from '@/config/services.json';

// Types
export interface SupabaseUser {
  id?: number;
  nome: string;
  idade: number;
  peso: number;
  altura: number;
  imc: number;
  nivel: string;
  usa_caneta: boolean;
  nome_caneta?: string;
  created_at?: string;
}

export interface SupabaseProgress {
  id?: number;
  user_id: number;
  peso: number;
  imc: number;
  data?: string;
}

export interface SupabaseTraining {
  id?: number;
  user_id: number;
  tipo: string;
  duracao: number;
  calorias: number;
  data?: string;
}

export interface SupabaseDiet {
  id?: number;
  user_id: number;
  refeicao: string;
  calorias: number;
  data?: string;
}

// Configuração do serviço
const supabaseService = servicesConfig.services.find(s => s.id === 'supabase_service');

if (!supabaseService) {
  throw new Error('Configuração do Supabase não encontrada');
}

// Cliente Supabase REST
class SupabaseRestClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseUrl = supabaseService!.baseUrl;
    this.headers = supabaseService!.headers;
  }

  private async request<T>(
    url: string,
    method: string = 'GET',
    body?: any
  ): Promise<T> {
    const options: RequestInit = {
      method,
      headers: this.headers,
    };

    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${url}`, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Supabase API Error: ${error}`);
    }

    // Para DELETE, pode não ter conteúdo
    if (method === 'DELETE') {
      return {} as T;
    }

    return response.json();
  }

  // ========== USUÁRIOS ==========

  async createUser(userData: Omit<SupabaseUser, 'id' | 'created_at'>): Promise<SupabaseUser> {
    return this.request<SupabaseUser>('users', 'POST', userData);
  }

  async getUserById(userId: number): Promise<SupabaseUser[]> {
    return this.request<SupabaseUser[]>(`users?id=eq.${userId}`);
  }

  async updateUser(
    userId: number,
    userData: Partial<Omit<SupabaseUser, 'id' | 'created_at'>>
  ): Promise<SupabaseUser> {
    return this.request<SupabaseUser>(`users?id=eq.${userId}`, 'PATCH', userData);
  }

  async deleteUser(userId: number): Promise<void> {
    return this.request<void>(`users?id=eq.${userId}`, 'DELETE');
  }

  // ========== PROGRESSO ==========

  async addProgress(progressData: Omit<SupabaseProgress, 'id' | 'data'>): Promise<SupabaseProgress> {
    return this.request<SupabaseProgress>('progresso', 'POST', progressData);
  }

  async getProgress(userId: number): Promise<SupabaseProgress[]> {
    return this.request<SupabaseProgress[]>(`progresso?user_id=eq.${userId}&order=data.desc`);
  }

  // ========== TREINOS ==========

  async addTraining(trainingData: Omit<SupabaseTraining, 'id' | 'data'>): Promise<SupabaseTraining> {
    return this.request<SupabaseTraining>('treinos', 'POST', trainingData);
  }

  async getTrainings(userId: number): Promise<SupabaseTraining[]> {
    return this.request<SupabaseTraining[]>(`treinos?user_id=eq.${userId}&order=data.desc`);
  }

  // ========== DIETAS ==========

  async addDiet(dietData: Omit<SupabaseDiet, 'id' | 'data'>): Promise<SupabaseDiet> {
    return this.request<SupabaseDiet>('dietas', 'POST', dietData);
  }

  async getDiets(userId: number): Promise<SupabaseDiet[]> {
    return this.request<SupabaseDiet[]>(`dietas?user_id=eq.${userId}&order=data.desc`);
  }

  // ========== UTILITÁRIOS ==========

  // Calcular IMC
  calculateIMC(peso: number, altura: number): number {
    const alturaMetros = altura / 100;
    return Number((peso / (alturaMetros * alturaMetros)).toFixed(2));
  }

  // Classificar IMC
  classifyIMC(imc: number): string {
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    if (imc < 35) return 'Obesidade grau I';
    if (imc < 40) return 'Obesidade grau II';
    return 'Obesidade grau III';
  }
}

// Instância global
export const supabaseClient = new SupabaseRestClient();

// Hook para usar no React
export function useSupabaseClient() {
  return supabaseClient;
}
