'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabaseClient, SupabaseUser } from '@/lib/supabase-client';
import { Dumbbell, Apple, TrendingUp, User, ArrowLeft, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          router.push('/quiz');
          return;
        }

        const users = await supabaseClient.getUserById(parseInt(userId));
        if (users && users.length > 0) {
          setUser(users[0]);
        } else {
          router.push('/quiz');
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        router.push('/quiz');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Header com informações do usuário */}
        <Card className="mb-8 shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-green-500 rounded-full">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl">Olá, {user.nome}! 👋</CardTitle>
                <CardDescription className="text-lg">
                  Bem-vindo ao seu painel personalizado
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Peso</p>
                <p className="text-2xl font-bold text-blue-600">{user.peso} kg</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Altura</p>
                <p className="text-2xl font-bold text-green-600">{user.altura} cm</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">IMC</p>
                <p className="text-2xl font-bold text-purple-600">{user.imc.toFixed(1)}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">Nível</p>
                <p className="text-2xl font-bold text-orange-600">{user.nivel}</p>
              </div>
            </div>
            {user.usa_caneta && user.nome_caneta && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  💉 Usando: <span className="font-semibold">{user.nome_caneta}</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cards de navegação */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Treinos */}
          <Card
            className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105"
            onClick={() => router.push('/treinos')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Dumbbell className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Treinos</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Acompanhe seus treinos e registre novas atividades físicas
              </CardDescription>
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                Ver Treinos
              </Button>
            </CardContent>
          </Card>

          {/* Dietas */}
          <Card
            className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105"
            onClick={() => router.push('/dietas')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Apple className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Dietas</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Registre suas refeições e monitore suas calorias diárias
              </CardDescription>
              <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                Ver Dietas
              </Button>
            </CardContent>
          </Card>

          {/* Progresso */}
          <Card
            className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105"
            onClick={() => router.push('/progresso')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Progresso</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Acompanhe sua evolução de peso e IMC ao longo do tempo
              </CardDescription>
              <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                Ver Progresso
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
