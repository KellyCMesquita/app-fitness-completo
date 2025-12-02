'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabaseClient, SupabaseDiet } from '@/lib/supabase-client';
import { ArrowLeft, Plus, Apple, Loader2, Utensils } from 'lucide-react';

export default function DietasPage() {
  const router = useRouter();
  const [diets, setDiets] = useState<SupabaseDiet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    refeicao: '',
    calorias: '',
  });

  useEffect(() => {
    loadDiets();
  }, []);

  const loadDiets = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        router.push('/quiz');
        return;
      }

      const data = await supabaseClient.getDiets(parseInt(userId));
      setDiets(data);
    } catch (error) {
      console.error('Erro ao carregar dietas:', error);
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

      await supabaseClient.addDiet({
        user_id: parseInt(userId),
        refeicao: formData.refeicao,
        calorias: parseInt(formData.calorias),
      });

      // Resetar formulário
      setFormData({ refeicao: '', calorias: '' });
      setShowForm(false);

      // Recarregar lista
      await loadDiets();
    } catch (error) {
      console.error('Erro ao salvar refeição:', error);
      alert('Erro ao salvar refeição. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const totalCalorias = diets.reduce((sum, diet) => sum + diet.calorias, 0);

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
            className="bg-white text-green-600 hover:bg-green-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Refeição
          </Button>
        </div>

        {/* Card de resumo */}
        {diets.length > 0 && (
          <Card className="mb-8 shadow-2xl bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm opacity-90">Total de Calorias Hoje</p>
                <p className="text-5xl font-bold mt-2">{totalCalorias}</p>
                <p className="text-sm opacity-90 mt-1">kcal</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulário de adicionar refeição */}
        {showForm && (
          <Card className="mb-8 shadow-2xl">
            <CardHeader>
              <CardTitle>Adicionar Nova Refeição</CardTitle>
              <CardDescription>Registre o que você comeu</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="refeicao">Refeição</Label>
                  <Input
                    id="refeicao"
                    placeholder="Ex: Café da manhã, Almoço, Lanche..."
                    value={formData.refeicao}
                    onChange={(e) => setFormData({ ...formData, refeicao: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calorias">Calorias</Label>
                  <Input
                    id="calorias"
                    type="number"
                    placeholder="Ex: 350"
                    value={formData.calorias}
                    onChange={(e) => setFormData({ ...formData, calorias: e.target.value })}
                    required
                    min="1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={saving}>
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

        {/* Lista de refeições */}
        <Card className="shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Apple className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle>Suas Refeições</CardTitle>
                <CardDescription>Histórico de alimentação</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {diets.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Utensils className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma refeição registrada ainda.</p>
                <p className="text-sm mt-2">Clique em "Adicionar Refeição" para começar!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {diets.map((diet) => (
                  <div
                    key={diet.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{diet.refeicao}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            {diet.calorias} kcal
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {diet.data
                          ? new Date(diet.data).toLocaleDateString('pt-BR')
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
