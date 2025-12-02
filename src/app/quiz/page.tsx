'use client';

import { useState } from 'react';
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
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function QuizPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    peso: '',
    altura: '',
    usa_caneta: '',
    nome_caneta: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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
      if (result && Array.isArray(result) && result[0]?.id) {
        localStorage.setItem('user_id', result[0].id.toString());
      }

      // Redirecionar para dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      alert('Erro ao salvar dados. Tente novamente.');
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
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
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
