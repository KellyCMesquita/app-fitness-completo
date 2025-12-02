import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

// Planos de dieta baseados no objetivo
const mealPlans = {
  lose_weight: {
    name: 'Plano para Perda de Peso',
    description: 'Refeições balanceadas com déficit calórico',
    meals: [
      {
        time: 'Café da manhã (7h-8h)',
        calories: 350,
        items: [
          '2 ovos mexidos',
          '2 fatias de pão integral',
          '1 banana',
          'Café sem açúcar',
        ],
        macros: { protein: 20, carbs: 40, fats: 12 },
      },
      {
        time: 'Lanche da manhã (10h)',
        calories: 150,
        items: [
          '1 iogurte grego natural',
          '1 colher de sopa de granola',
        ],
        macros: { protein: 12, carbs: 18, fats: 4 },
      },
      {
        time: 'Almoço (12h-13h)',
        calories: 500,
        items: [
          '150g de frango grelhado',
          '4 colheres de arroz integral',
          'Salada verde à vontade',
          '2 colheres de feijão',
        ],
        macros: { protein: 40, carbs: 50, fats: 10 },
      },
      {
        time: 'Lanche da tarde (16h)',
        calories: 200,
        items: [
          '1 fatia de queijo branco',
          '4 biscoitos integrais',
          '1 maçã',
        ],
        macros: { protein: 10, carbs: 25, fats: 6 },
      },
      {
        time: 'Jantar (19h-20h)',
        calories: 450,
        items: [
          '150g de peixe grelhado',
          '1 batata doce média',
          'Legumes refogados',
        ],
        macros: { protein: 35, carbs: 45, fats: 8 },
      },
      {
        time: 'Ceia (22h)',
        calories: 100,
        items: [
          '1 copo de leite desnatado',
          'Chá de camomila',
        ],
        macros: { protein: 8, carbs: 12, fats: 0 },
      },
    ],
    tips: [
      'Beba pelo menos 2L de água por dia',
      'Evite frituras e alimentos processados',
      'Faça refeições a cada 3 horas',
      'Evite carboidratos simples à noite',
    ],
  },
  gain_muscle: {
    name: 'Plano para Ganho de Massa',
    description: 'Refeições ricas em proteínas com superávit calórico',
    meals: [
      {
        time: 'Café da manhã (7h-8h)',
        calories: 550,
        items: [
          '4 ovos mexidos',
          '3 fatias de pão integral',
          '1 banana',
          'Vitamina de whey protein',
        ],
        macros: { protein: 40, carbs: 60, fats: 15 },
      },
      {
        time: 'Lanche da manhã (10h)',
        calories: 300,
        items: [
          '1 iogurte grego',
          '2 colheres de pasta de amendoim',
          '1 porção de aveia',
        ],
        macros: { protein: 20, carbs: 30, fats: 12 },
      },
      {
        time: 'Almoço (12h-13h)',
        calories: 700,
        items: [
          '200g de carne vermelha magra',
          '6 colheres de arroz integral',
          'Salada verde',
          '3 colheres de feijão',
          '1 batata doce',
        ],
        macros: { protein: 50, carbs: 80, fats: 15 },
      },
      {
        time: 'Lanche pré-treino (15h)',
        calories: 350,
        items: [
          '2 fatias de pão integral',
          '100g de peito de peru',
          '1 banana',
        ],
        macros: { protein: 25, carbs: 45, fats: 5 },
      },
      {
        time: 'Lanche pós-treino (17h)',
        calories: 400,
        items: [
          'Shake de whey protein',
          '1 banana',
          '2 colheres de aveia',
        ],
        macros: { protein: 35, carbs: 50, fats: 5 },
      },
      {
        time: 'Jantar (19h-20h)',
        calories: 650,
        items: [
          '200g de frango grelhado',
          '5 colheres de arroz integral',
          'Legumes variados',
          'Salada',
        ],
        macros: { protein: 45, carbs: 70, fats: 12 },
      },
      {
        time: 'Ceia (22h)',
        calories: 250,
        items: [
          '200g de queijo cottage',
          '1 colher de pasta de amendoim',
        ],
        macros: { protein: 30, carbs: 10, fats: 10 },
      },
    ],
    tips: [
      'Consuma proteína em todas as refeições',
      'Não pule refeições',
      'Beba 3L de água por dia',
      'Priorize carboidratos complexos',
    ],
  },
  maintain: {
    name: 'Plano de Manutenção',
    description: 'Refeições equilibradas para manter o peso',
    meals: [
      {
        time: 'Café da manhã (7h-8h)',
        calories: 400,
        items: [
          '2 ovos mexidos',
          '2 fatias de pão integral',
          '1 fruta',
          'Café com leite',
        ],
        macros: { protein: 25, carbs: 45, fats: 12 },
      },
      {
        time: 'Lanche da manhã (10h)',
        calories: 200,
        items: [
          '1 iogurte natural',
          '1 porção de castanhas',
        ],
        macros: { protein: 10, carbs: 20, fats: 8 },
      },
      {
        time: 'Almoço (12h-13h)',
        calories: 600,
        items: [
          '150g de proteína (frango/peixe/carne)',
          '5 colheres de arroz integral',
          'Salada verde',
          '2 colheres de feijão',
          'Legumes',
        ],
        macros: { protein: 40, carbs: 65, fats: 12 },
      },
      {
        time: 'Lanche da tarde (16h)',
        calories: 250,
        items: [
          '1 sanduíche natural',
          '1 suco natural',
        ],
        macros: { protein: 15, carbs: 35, fats: 6 },
      },
      {
        time: 'Jantar (19h-20h)',
        calories: 500,
        items: [
          '150g de proteína',
          '1 batata doce ou 3 colheres de arroz',
          'Salada e legumes',
        ],
        macros: { protein: 35, carbs: 50, fats: 10 },
      },
      {
        time: 'Ceia (22h)',
        calories: 150,
        items: [
          '1 copo de leite',
          '2 biscoitos integrais',
        ],
        macros: { protein: 10, carbs: 18, fats: 4 },
      },
    ],
    tips: [
      'Mantenha equilíbrio entre os macronutrientes',
      'Beba 2-3L de água por dia',
      'Permita-se uma refeição livre por semana',
      'Mantenha rotina de exercícios regular',
    ],
  },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const goal = searchParams.get('goal') as 'lose_weight' | 'gain_muscle' | 'maintain';

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
      .select('goal, daily_calories')
      .eq('id', userId)
      .single();

    if (userError) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const userGoal = goal || userData.goal || 'maintain';
    const plan = mealPlans[userGoal];

    // Calcular total de calorias do plano
    const totalCalories = plan.meals.reduce((sum, meal) => sum + meal.calories, 0);

    return NextResponse.json({
      success: true,
      plan,
      userGoal,
      dailyCalories: userData.daily_calories,
      planCalories: totalCalories,
    });
  } catch (error) {
    console.error('Erro ao buscar dieta:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, mealTime, calories, completed, date } = body;

    if (!userId || !mealTime) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Registrar refeição
    const { data, error } = await supabase
      .from('meal_logs')
      .insert({
        user_id: userId,
        meal_time: mealTime,
        calories,
        completed,
        logged_at: date || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao registrar refeição:', error);
      return NextResponse.json(
        { error: 'Erro ao registrar refeição' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      log: data,
    });
  } catch (error) {
    console.error('Erro no endpoint /api/meals:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
