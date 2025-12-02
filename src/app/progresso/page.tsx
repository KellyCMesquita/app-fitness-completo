'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabaseClient, SupabaseProgress, SupabaseUser } from '@/lib/supabase-client';
import { ArrowLeft, Plus, TrendingUp, Loader2, Scale } from 'lucide-react';

export default function ProgressoPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<SupabaseProgress[]>([]);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    peso: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        router.push('/quiz');
        return;
      }

      // Carregar usuário para pegar altura
      const users = await supabaseClient.getUserById(parseInt(userId));
      if (users && users.length > 0) {
        setUser(users[0]);
      }

      // Carregar progresso
      const data = await supabaseClient.getProgress(parseInt(userId));
      setProgress(data);
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const userId = localStorage.getItem('user_id');
      if (!userId || !user) {
        router.push('/quiz');
        return;
      }

      const peso = parseFloat(formData.peso);
      const imc = supabaseClient.calculateIMC(peso, user.altura);

      await supabaseClient.addProgress({
        user_id: parseInt(userId),
        peso: peso,
        imc: imc,
      });

      // Resetar formulário
      setFormData({ peso: '' });
      setShowForm(false);

      // Recarregar lista
      await loadData();
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
      alert('Erro ao salvar progresso. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const getIMCStatus = (imc: number) => {
    if (imc < 18.5) return { label: 'Abaixo do peso', color: 'text-blue-600 bg-blue-100' };
    if (imc < 25) return { label: 'Peso normal', color: 'text-green-600 bg-green-100' };
    if (imc < 30) return { label: 'Sobrepeso', color: 'text-yellow-600 bg-yellow-100' };
    if (imc < 35) return { label: 'Obesidade I', color: 'text-orange-600 bg-orange-100' };
    if (imc < 40) return { label: 'Obesidade II', color: 'text-red-600 bg-red-100' };
    return { label: 'Obesidade III', color: 'text-red-700 bg-red-200' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  const latestProgress = progress[0];
  const imcStatus = latestProgress ? getIMCStatus(latestProgress.imc) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-purple-600 hover:bg-purple-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Progresso
          </Button>
        </div>

        {/* Card de resumo atual */}
        {latestProgress && imcStatus && (
          <Card className="mb-8 shadow-2xl bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-sm opacity-90">Peso Atual</p>
                  <p className="text-5xl font-bold mt-2">{latestProgress.peso}</p>
                  <p className="text-sm opacity-90 mt-1">kg</p>
                </div>
                <div className="text-center">
                  <p className="text-sm opacity-90">IMC Atual</p>
                  <p className="text-5xl font-bold mt-2">{latestProgress.imc.toFixed(1)}</p>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${imcStatus.color}`}>
                    {imcStatus.label}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulário de adicionar progresso */}
        {showForm && (
          <Card className="mb-8 shadow-2xl">
            <CardHeader>
              <CardTitle>Adicionar Novo Progresso</CardTitle>
              <CardDescription>Registre seu peso atual</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="peso">Peso (kg)</Label>
                  <Input
                    id="peso"
                    type="number"
                    step="0.1"
                    placeholder="Ex: 75.5"
                    value={formData.peso}
                    onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                    required
                    min="1"
                  />
                  {user && formData.peso && (
                    <p className="text-sm text-gray-600">
                      IMC calculado: {supabaseClient.calculateIMC(parseFloat(formData.peso), user.altura).toFixed(1)}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de progresso */}
        <Card className="shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>Seu Progresso</CardTitle>
                <CardDescription>Histórico de evolução</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {progress.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Scale className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum progresso registrado ainda.</p>
                <p className="text-sm mt-2">Clique em "Adicionar Progresso" para começar!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {progress.map((item, index) => {
                  const status = getIMCStatus(item.imc);
                  const isLatest = index === 0;
                  const previous = progress[index + 1];
                  const weightDiff = previous ? item.peso - previous.peso : 0;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 border rounded-lg transition-colors ${
                        isLatest ? 'bg-purple-50 border-purple-200' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{item.peso} kg</h3>
                            {isLatest && (
                              <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                                Atual
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                              IMC: {item.imc.toFixed(1)} - {status.label}
                            </div>
                            {previous && weightDiff !== 0 && (
                              <div
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  weightDiff < 0
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {weightDiff > 0 ? '+' : ''}
                                {weightDiff.toFixed(1)} kg
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {item.data
                            ? new Date(item.data).toLocaleDateString('pt-BR')
                            : 'Hoje'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
