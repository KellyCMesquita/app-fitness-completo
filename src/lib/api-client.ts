import apiConfig from './api-config.json';

interface ApiEndpoint {
  name: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: Record<string, string>;
}

interface ApiConfig {
  endpoints: ApiEndpoint[];
  quiz: Array<{
    question: string;
    type: string;
    key: string;
    options?: string[];
  }>;
}

const config = apiConfig as ApiConfig;

// Substituir variáveis de template
function replaceTemplateVars(
  text: string,
  vars: Record<string, any>
): string {
  return text.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    const trimmedKey = key.trim();
    
    // Variáveis de ambiente
    if (trimmedKey.startsWith('env.')) {
      const envKey = trimmedKey.replace('env.', '');
      if (envKey === 'SUPABASE_KEY') {
        return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      }
      return process.env[`NEXT_PUBLIC_${envKey}`] || '';
    }
    
    // Variáveis de autenticação
    if (trimmedKey.startsWith('auth.')) {
      return vars[trimmedKey] || '';
    }
    
    // Variáveis normais
    return vars[trimmedKey] || '';
  });
}

// Cliente de API genérico
export async function callApi(
  endpointName: string,
  variables: Record<string, any> = {}
): Promise<any> {
  const endpoint = config.endpoints.find(e => e.name === endpointName);
  
  if (!endpoint) {
    throw new Error(`Endpoint "${endpointName}" não encontrado`);
  }

  // Substituir variáveis na URL
  const url = replaceTemplateVars(endpoint.url, variables);

  // Substituir variáveis nos headers
  const headers: Record<string, string> = {};
  Object.entries(endpoint.headers).forEach(([key, value]) => {
    headers[key] = replaceTemplateVars(value, variables);
  });

  // Preparar body se existir
  let body: string | undefined;
  if (endpoint.body) {
    const bodyObj: Record<string, any> = {};
    Object.entries(endpoint.body).forEach(([key, value]) => {
      bodyObj[key] = replaceTemplateVars(value, variables);
    });
    body = JSON.stringify(bodyObj);
  }

  // Fazer requisição
  const response = await fetch(url, {
    method: endpoint.method,
    headers,
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Funções específicas para cada endpoint
export const api = {
  // Criar usuário com dados do quiz
  createUserQuiz: async (userId: string, data: {
    nome: string;
    idade: number;
    peso: number;
    altura: number;
    imc: number;
    nivel: string;
    usa_caneta: boolean;
    caneta_tipo?: string;
    objetivo: string;
  }) => {
    return callApi('create_user_quiz', {
      'auth.uid': userId,
      nome: data.nome,
      idade: data.idade.toString(),
      peso: data.peso.toString(),
      altura: data.altura.toString(),
      imc: data.imc.toString(),
      nivel: data.nivel,
      usa_caneta: data.usa_caneta.toString(),
      caneta_tipo: data.caneta_tipo || '',
      objetivo: data.objetivo,
    });
  },

  // Buscar usuário
  getUser: async (userId: string) => {
    return callApi('get_user', {
      'auth.uid': userId,
    });
  },

  // Atualizar usuário
  updateUser: async (userId: string, data: {
    nome?: string;
    idade?: number;
    peso?: number;
    altura?: number;
    imc?: number;
    nivel?: string;
    usa_caneta?: boolean;
    caneta_tipo?: string;
    objetivo?: string;
  }) => {
    const vars: Record<string, string> = {
      'auth.uid': userId,
    };
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        vars[key] = value.toString();
      }
    });

    return callApi('update_user', vars);
  },

  // Adicionar progresso
  addProgresso: async (userId: string, data: {
    peso: number;
    humor?: string;
    fome?: string;
    colateral?: string;
  }) => {
    return callApi('add_progresso', {
      'auth.uid': userId,
      peso: data.peso.toString(),
      humor: data.humor || '',
      fome: data.fome || '',
      colateral: data.colateral || '',
    });
  },

  // Buscar progressos
  getProgressos: async (userId: string) => {
    return callApi('get_progressos', {
      'auth.uid': userId,
    });
  },

  // Registrar dose de caneta
  registrarDose: async (userId: string, data: {
    caneta: string;
    dose: number;
    data: string;
  }) => {
    return callApi('registrar_dose', {
      'auth.uid': userId,
      caneta: data.caneta,
      dose: data.dose.toString(),
      data: data.data,
    });
  },
};

// Exportar configuração do quiz
export const quizConfig = config.quiz;
