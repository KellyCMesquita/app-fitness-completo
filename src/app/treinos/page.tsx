'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabaseClient, SupabaseTraining } from '@/lib/supabase-client';
import { ArrowLeft, Plus, Dumbbell, Loader2, Clock, Flame } from 'lucide-react';

export default function TreinosPage() {
  const router = useRouter();
  const [trainings, setTrainings] = useState<SupabaseTraining[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    tipo: '',
    duracao: '',
    calorias: '',
  });

  useEffect(() => {
    loadTrainings();
  }, []);

  const loadTrainings = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        router.push('/quiz');
        return;
      }

      const data = await supabaseClient.getTrainings(parseInt(userId));
      setTrainings(data);
    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        router.push('/quiz');
        return;
      }

      await supabaseClient.addTraining({
        user_id: parseInt(userId),
        tipo: formData.tipo,
        duracao: parseInt(formData.duracao),
        calorias: parseInt(formData.calorias),
      });

      // Resetar formulário
      setFormData({ tipo: '', duracao: '', calorias: '' });
      setShowForm(false);

      // Recarregar lista
      await loadTrainings();
    } catch (error) {
      console.error('Erro ao salvar treino:', error);
      alert('Erro ao salvar treino. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

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
            className="bg-white text-blue-600 hover:bg-blue-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Treino
          </Button>
        </div>

        {/* Formulário de adicionar treino */}
        {showForm && (
          <Card className="mb-8 shadow-2xl">
            <CardHeader>
              <CardTitle>Adicionar Novo Treino</CardTitle>
              <CardDescription>Registre seu treino realizado</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de treino</Label>
                  <Input
                    id="tipo"
                    placeholder="Ex: Corrida, Musculação, Yoga..."
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duracao">Duração (minutos)</Label>
                  <Input
                    id="duracao"
                    type="number"
                    placeholder="Ex: 30"
                    value={formData.duracao}
                    onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
                    required
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calorias">Calorias queimadas</Label>
                  <Input
                    id="calorias"
                    type="number"
                    placeholder="Ex: 250"
                    value={formData.calorias}
                    onChange={(e) => setFormData({ ...formData, calorias: e.target.value })}
                    required
                    min="1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={saving}>
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

        {/* Lista de treinos */}
        <Card className="shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Dumbbell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Seus Treinos</CardTitle>
                <CardDescription>Histórico de atividades físicas</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {trainings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum treino registrado ainda.</p>
                <p className="text-sm mt-2">Clique em "Adicionar Treino" para começar!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trainings.map((training) => (
                  <div
                    key={training.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{training.tipo}</h3>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{training.duracao} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Flame className="w-4 h-4" />
                            <span>{training.calorias} kcal</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {training.data
                          ? new Date(training.data).toLocaleDateString('pt-BR')
                          : 'Hoje'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
