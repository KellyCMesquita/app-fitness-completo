'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabaseClient } from '@/lib/supabase-client';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function QuizPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supabaseReady, setSupabaseReady] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    peso: '',
    altura: '',
    usa_caneta: '',
    nome_caneta: '',
  });

  useEffect(() => {
    // Verificar se Supabase está configurado
    setSupabaseReady(supabaseClient.isReady());
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null); // Limpar erro ao digitar
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Verificar se Supabase está configurado
      if (!supabaseClient.isReady()) {
        throw new Error('Supabase não configurado. Configure as variáveis de ambiente nas Configurações do Projeto.');
      }

      // Calcular IMC
      const peso = parseFloat(formData.peso);
      const altura = parseFloat(formData.altura);
      const imc = supabaseClient.calculateIMC(peso, altura);

      // Determinar nível baseado no IMC
      let nivel = 'Iniciante';
      if (imc >= 25 && imc < 30) {
        nivel = 'Intermediário';
      } else if (imc >= 30) {
        nivel = 'Avançado';
      }

      // Criar usuário
      const userData = {
        nome: formData.nome,
        idade: parseInt(formData.idade),
        peso: peso,
        altura: altura,
        imc: imc,
        nivel: nivel,
        usa_caneta: formData.usa_caneta === 'Sim',
        nome_caneta: formData.usa_caneta === 'Sim' ? formData.nome_caneta : undefined,
      };

      const result = await supabaseClient.createUser(userData);
      
      // Salvar ID do usuário no localStorage
      if (result && Array.isArray(result) && result.length > 0 && result[0]?.id) {
        localStorage.setItem('user_id', result[0].id.toString());
        console.log('✅ Usuário criado com sucesso:', result[0]);
        // Redirecionar para dashboard
        router.push('/dashboard');
      } else {
        throw new Error('Erro ao criar usuário. Verifique se as tabelas foram criadas no Supabase.');
      }
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      
      // Mensagens de erro específicas
      if (error.message?.includes('Supabase não configurado')) {
        setError('⚠️ Configure o Supabase nas Configurações do Projeto para continuar.');
      } else if (error.message?.includes('Unauthorized') || error.message?.includes('401')) {
        setError('🔑 Credenciais do Supabase inválidas. Verifique suas chaves de API nas Configurações.');
      } else if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        setError('📊 Tabela "users" não encontrada no banco de dados. Crie a estrutura do banco primeiro.');
      } else if (error.message?.includes('Network') || error.message?.includes('fetch')) {
        setError('🌐 Erro de conexão. Verifique sua internet e as configurações do Supabase.');
      } else {
        setError(`❌ Erro ao salvar dados: ${error.message || 'Tente novamente.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-6 text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {/* Alerta de configuração do Supabase */}
        {!supabaseReady && (
          <Alert className="mb-6 bg-orange-50 border-orange-200">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertTitle className="text-orange-800">Configuração Necessária</AlertTitle>
            <AlertDescription className="text-orange-700">
              Configure suas credenciais do Supabase nas Configurações do Projeto para salvar seus dados.
            </AlertDescription>
          </Alert>
        )}

        {/* Alerta de erro */}
        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Erro</AlertTitle>
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl">Quiz de Perfil</CardTitle>
            <CardDescription>
              Preencha seus dados para receber um plano personalizado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="nome">Seu nome</Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Digite seu nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  required
                />
              </div>

              {/* Idade */}
              <div className="space-y-2">
                <Label htmlFor="idade">Idade</Label>
                <Input
                  id="idade"
                  type="number"
                  placeholder="Digite sua idade"
                  value={formData.idade}
                  onChange={(e) => handleInputChange('idade', e.target.value)}
                  required
                  min="1"
                  max="120"
                />
              </div>

              {/* Peso */}
              <div className="space-y-2">
                <Label htmlFor="peso">Peso (kg)</Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.1"
                  placeholder="Digite seu peso"
                  value={formData.peso}
                  onChange={(e) => handleInputChange('peso', e.target.value)}
                  required
                  min="1"
                />
              </div>

              {/* Altura */}
              <div className="space-y-2">
                <Label htmlFor="altura">Altura (cm)</Label>
                <Input
                  id="altura"
                  type="number"
                  placeholder="Digite sua altura em centímetros"
                  value={formData.altura}
                  onChange={(e) => handleInputChange('altura', e.target.value)}
                  required
                  min="1"
                />
              </div>

              {/* Usa caneta */}
              <div className="space-y-2">
                <Label htmlFor="usa_caneta">Usa caneta emagrecedora?</Label>
                <Select
                  value={formData.usa_caneta}
                  onValueChange={(value) => handleInputChange('usa_caneta', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sim">Sim</SelectItem>
                    <SelectItem value="Não">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Nome da caneta (condicional) */}
              {formData.usa_caneta === 'Sim' && (
                <div className="space-y-2">
                  <Label htmlFor="nome_caneta">Qual caneta?</Label>
                  <Select
                    value={formData.nome_caneta}
                    onValueChange={(value) => handleInputChange('nome_caneta', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a caneta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Saxenda">Saxenda</SelectItem>
                      <SelectItem value="Wegovy">Wegovy</SelectItem>
                      <SelectItem value="Zepbound">Zepbound</SelectItem>
                      <SelectItem value="Mounjaro">Mounjaro</SelectItem>
                      <SelectItem value="Ozempic">Ozempic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Botão de envio */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                disabled={loading || !supabaseReady}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : !supabaseReady ? (
                  'Configure o Supabase primeiro'
                ) : (
                  'Enviar'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
