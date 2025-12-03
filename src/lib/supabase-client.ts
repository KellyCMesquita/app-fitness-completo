// Cliente direto para API REST do Supabase usando variáveis de ambiente
'use client';

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

// Configuração do Supabase a partir das variáveis de ambiente
const getSupabaseConfig = () => {
  // No client-side, as variáveis de ambiente são injetadas durante o build
  const supabaseUrl = typeof window !== 'undefined' 
    ? (window as any).__NEXT_PUBLIC_SUPABASE_URL__ || process.env.NEXT_PUBLIC_SUPABASE_URL
    : process.env.NEXT_PUBLIC_SUPABASE_URL;
    
  const supabaseAnonKey = typeof window !== 'undefined'
    ? (window as any).__NEXT_PUBLIC_SUPABASE_ANON_KEY__ || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Variáveis de ambiente do Supabase não configuradas. Configure em Configurações do Projeto.');
    return null;
  }

  return {
    baseUrl: `${supabaseUrl}/rest/v1/`,
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  };
};

// Cliente Supabase REST
class SupabaseRestClient {
  private baseUrl: string;
  private headers: Record<string, string>;
  private isConfigured: boolean;

  constructor() {
    const config = getSupabaseConfig();
    
    if (!config) {
      this.isConfigured = false;
      this.baseUrl = '';
      this.headers = {};
      return;
    }

    this.isConfigured = true;
    this.baseUrl = config.baseUrl;
    this.headers = config.headers;
  }

  private checkConfiguration() {
    if (!this.isConfigured) {
      throw new Error('Supabase não configurado. Configure as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    }
  }

  private async request<T>(
    url: string,
    method: string = 'GET',
    body?: any
  ): Promise<T> {
    this.checkConfiguration();

    const options: RequestInit = {
      method,
      headers: this.headers,
    };

    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${this.baseUrl}${url}`, options);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Erro ${response.status}: ${response.statusText}`;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      // Para DELETE, pode não ter conteúdo
      if (method === 'DELETE') {
        return {} as T;
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Erro na requisição Supabase:', error);
      throw error;
    }
  }

  // ========== USUÁRIOS ==========

  async createUser(userData: Omit<SupabaseUser, 'id' | 'created_at'>): Promise<SupabaseUser[]> {
    return this.request<SupabaseUser[]>('users', 'POST', userData);
  }

  async getUserById(userId: number): Promise<SupabaseUser[]> {
    return this.request<SupabaseUser[]>(`users?id=eq.${userId}`);
  }

  async updateUser(
    userId: number,
    userData: Partial<Omit<SupabaseUser, 'id' | 'created_at'>>
  ): Promise<SupabaseUser[]> {
    return this.request<SupabaseUser[]>(`users?id=eq.${userId}`, 'PATCH', userData);
  }

  async deleteUser(userId: number): Promise<void> {
    return this.request<void>(`users?id=eq.${userId}`, 'DELETE');
  }

  // ========== PROGRESSO ==========

  async addProgress(progressData: Omit<SupabaseProgress, 'id' | 'data'>): Promise<SupabaseProgress[]> {
    return this.request<SupabaseProgress[]>('progresso', 'POST', progressData);
  }

  async getProgress(userId: number): Promise<SupabaseProgress[]> {
    return this.request<SupabaseProgress[]>(`progresso?user_id=eq.${userId}&order=data.desc`);
  }

  // ========== TREINOS ==========

  async addTraining(trainingData: Omit<SupabaseTraining, 'id' | 'data'>): Promise<SupabaseTraining[]> {
    return this.request<SupabaseTraining[]>('treinos', 'POST', trainingData);
  }

  async getTrainings(userId: number): Promise<SupabaseTraining[]> {
    return this.request<SupabaseTraining[]>(`treinos?user_id=eq.${userId}&order=data.desc`);
  }

  // ========== DIETAS ==========

  async addDiet(dietData: Omit<SupabaseDiet, 'id' | 'data'>): Promise<SupabaseDiet[]> {
    return this.request<SupabaseDiet[]>('dietas', 'POST', dietData);
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

  // Verificar se está configurado
  isReady(): boolean {
    return this.isConfigured;
  }
}

// Instância global
export const supabaseClient = new SupabaseRestClient();

// Hook para usar no React
export function useSupabaseClient() {
  return supabaseClient;
}
