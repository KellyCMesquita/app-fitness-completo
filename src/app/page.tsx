'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Activity, Dumbbell, Apple, TrendingUp } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const handleStartQuiz = () => {
    router.push('/quiz');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-green-500">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo/Icon */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <Activity className="w-12 h-12" />
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <Dumbbell className="w-12 h-12" />
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <Apple className="w-12 h-12" />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Fitness Pro
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Inteligente
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
            Planos personalizados de treino e dieta com acompanhamento completo
            para usuários de canetas emagrecedoras
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <Dumbbell className="w-8 h-8 mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">Treinos Personalizados</h3>
              <p className="text-sm text-blue-100">Adaptados ao seu nível e objetivo</p>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <Apple className="w-8 h-8 mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">Dieta Inteligente</h3>
              <p className="text-sm text-blue-100">Contador de calorias e sugestões diárias</p>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <TrendingUp className="w-8 h-8 mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">Acompanhamento</h3>
              <p className="text-sm text-blue-100">Evolução completa do seu progresso</p>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-8">
            <Button
              size="lg"
              onClick={handleStartQuiz}
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
            >
              Começar Quiz
              <Activity className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-blue-100 mt-4">
              ⚡ Quiz rápido de 2 minutos para personalizar seu plano
            </p>
          </div>

          {/* Imagem de fundo decorativa */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-300/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-full py-6 text-center text-white/60 text-sm">
        <p>💪 Transforme seu corpo com inteligência e ciência</p>
      </div>
    </div>
  );
}
