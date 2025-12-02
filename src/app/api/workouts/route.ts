import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

// Planos de treino baseados no nível
const workoutPlans = {
  beginner: {
    name: 'Plano Iniciante',
    description: 'Treinos leves para começar sua jornada',
    workouts: [
      {
        day: 'Segunda-feira',
        focus: 'Corpo Todo',
        exercises: [
          { name: 'Agachamento', sets: 3, reps: 12, rest: '60s' },
          { name: 'Flexão (joelhos)', sets: 3, reps: 10, rest: '60s' },
          { name: 'Prancha', sets: 3, reps: '30s', rest: '60s' },
          { name: 'Polichinelo', sets: 3, reps: 20, rest: '60s' },
        ],
      },
      {
        day: 'Quarta-feira',
        focus: 'Cardio Leve',
        exercises: [
          { name: 'Caminhada rápida', sets: 1, reps: '20min', rest: '-' },
          { name: 'Bicicleta ergométrica', sets: 1, reps: '15min', rest: '-' },
          { name: 'Alongamento', sets: 1, reps: '10min', rest: '-' },
        ],
      },
      {
        day: 'Sexta-feira',
        focus: 'Força e Resistência',
        exercises: [
          { name: 'Agachamento', sets: 3, reps: 15, rest: '60s' },
          { name: 'Remada com elástico', sets: 3, reps: 12, rest: '60s' },
          { name: 'Elevação lateral', sets: 3, reps: 12, rest: '60s' },
          { name: 'Abdominal', sets: 3, reps: 15, rest: '45s' },
        ],
      },
    ],
  },
  intermediate: {
    name: 'Plano Intermediário',
    description: 'Treinos moderados para evolução contínua',
    workouts: [
      {
        day: 'Segunda-feira',
        focus: 'Peito e Tríceps',
        exercises: [
          { name: 'Supino reto', sets: 4, reps: 12, rest: '60s' },
          { name: 'Supino inclinado', sets: 3, reps: 12, rest: '60s' },
          { name: 'Crucifixo', sets: 3, reps: 12, rest: '60s' },
          { name: 'Tríceps testa', sets: 3, reps: 12, rest: '60s' },
          { name: 'Tríceps corda', sets: 3, reps: 15, rest: '45s' },
        ],
      },
      {
        day: 'Quarta-feira',
        focus: 'Costas e Bíceps',
        exercises: [
          { name: 'Barra fixa', sets: 4, reps: 10, rest: '90s' },
          { name: 'Remada curvada', sets: 4, reps: 12, rest: '60s' },
          { name: 'Pulldown', sets: 3, reps: 12, rest: '60s' },
          { name: 'Rosca direta', sets: 3, reps: 12, rest: '60s' },
          { name: 'Rosca martelo', sets: 3, reps: 12, rest: '60s' },
        ],
      },
      {
        day: 'Sexta-feira',
        focus: 'Pernas e Ombros',
        exercises: [
          { name: 'Agachamento livre', sets: 4, reps: 12, rest: '90s' },
          { name: 'Leg press', sets: 4, reps: 15, rest: '60s' },
          { name: 'Stiff', sets: 3, reps: 12, rest: '60s' },
          { name: 'Desenvolvimento', sets: 4, reps: 12, rest: '60s' },
          { name: 'Elevação lateral', sets: 3, reps: 15, rest: '45s' },
        ],
      },
    ],
  },
  advanced: {
    name: 'Plano Avançado',
    description: 'Treinos intensos para máximos resultados',
    workouts: [
      {
        day: 'Segunda-feira',
        focus: 'Peito',
        exercises: [
          { name: 'Supino reto', sets: 5, reps: 10, rest: '90s' },
          { name: 'Supino inclinado', sets: 4, reps: 10, rest: '90s' },
          { name: 'Supino declinado', sets: 4, reps: 12, rest: '60s' },
          { name: 'Crucifixo inclinado', sets: 4, reps: 12, rest: '60s' },
          { name: 'Crossover', sets: 3, reps: 15, rest: '45s' },
        ],
      },
      {
        day: 'Terça-feira',
        focus: 'Costas',
        exercises: [
          { name: 'Barra fixa', sets: 5, reps: 12, rest: '90s' },
          { name: 'Remada curvada', sets: 5, reps: 10, rest: '90s' },
          { name: 'Pulldown', sets: 4, reps: 12, rest: '60s' },
          { name: 'Remada cavalinho', sets: 4, reps: 12, rest: '60s' },
          { name: 'Pullover', sets: 3, reps: 15, rest: '60s' },
        ],
      },
      {
        day: 'Quarta-feira',
        focus: 'Pernas',
        exercises: [
          { name: 'Agachamento livre', sets: 5, reps: 10, rest: '120s' },
          { name: 'Leg press 45°', sets: 4, reps: 15, rest: '90s' },
          { name: 'Hack squat', sets: 4, reps: 12, rest: '90s' },
          { name: 'Cadeira extensora', sets: 4, reps: 15, rest: '60s' },
          { name: 'Cadeira flexora', sets: 4, reps: 15, rest: '60s' },
        ],
      },
      {
        day: 'Quinta-feira',
        focus: 'Ombros',
        exercises: [
          { name: 'Desenvolvimento', sets: 5, reps: 10, rest: '90s' },
          { name: 'Elevação lateral', sets: 4, reps: 12, rest: '60s' },
          { name: 'Elevação frontal', sets: 4, reps: 12, rest: '60s' },
          { name: 'Crucifixo invertido', sets: 4, reps: 15, rest: '60s' },
          { name: 'Encolhimento', sets: 4, reps: 15, rest: '60s' },
        ],
      },
      {
        day: 'Sexta-feira',
        focus: 'Braços',
        exercises: [
          { name: 'Rosca direta', sets: 4, reps: 12, rest: '60s' },
          { name: 'Rosca alternada', sets: 4, reps: 12, rest: '60s' },
          { name: 'Rosca scott', sets: 3, reps: 12, rest: '60s' },
          { name: 'Tríceps testa', sets: 4, reps: 12, rest: '60s' },
          { name: 'Tríceps corda', sets: 4, reps: 15, rest: '45s' },
          { name: 'Mergulho', sets: 3, reps: 12, rest: '60s' },
        ],
      },
    ],
  },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const level = searchParams.get('level') as 'beginner' | 'intermediate' | 'advanced';

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Buscar dados do usuário
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('training_level, goal')
      .eq('id', userId)
      .single();

    if (userError) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const trainingLevel = level || userData.training_level || 'beginner';
    const plan = workoutPlans[trainingLevel];

    return NextResponse.json({
      success: true,
      plan,
      userLevel: trainingLevel,
    });
  } catch (error) {
    console.error('Erro ao buscar treinos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, workoutId, completed, date } = body;

    if (!userId || !workoutId) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Registrar treino completado
    const { data, error } = await supabase
      .from('workout_logs')
      .insert({
        user_id: userId,
        workout_id: workoutId,
        completed,
        completed_at: date || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao registrar treino:', error);
      return NextResponse.json(
        { error: 'Erro ao registrar treino' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      log: data,
    });
  } catch (error) {
    console.error('Erro no endpoint /api/workouts:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
