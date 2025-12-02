import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createClient();

    // Validar dados recebidos
    const { name, age, weight, height, goal, uses_medication, medication_type, training_level } = body;

    if (!name || !age || !weight || !height || !goal) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Calcular IMC
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    // Calcular peso alvo baseado no objetivo
    let targetWeight = weight;
    if (goal === 'lose_weight') {
      targetWeight = Math.round(weight * 0.9); // 10% de perda
    } else if (goal === 'gain_muscle') {
      targetWeight = Math.round(weight * 1.05); // 5% de ganho
    }

    // Calcular calorias diárias
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5; // Fórmula Mifflin-St Jeor
    let dailyCalories = Math.round(bmr * 1.55); // Atividade moderada

    if (goal === 'lose_weight') {
      dailyCalories -= 500; // Déficit calórico
    } else if (goal === 'gain_muscle') {
      dailyCalories += 300; // Superávit calórico
    }

    // Inserir no banco de dados
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        name,
        age,
        weight,
        height,
        goal,
        uses_medication,
        medication_type,
        training_level: training_level || 'beginner',
        bmi: parseFloat(bmi),
        target_weight: targetWeight,
        daily_calories: dailyCalories,
      })
      .select()
      .single();

    if (userError) {
      console.error('Erro ao inserir usuário:', userError);
      return NextResponse.json(
        { error: 'Erro ao salvar dados do usuário' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      userId: userData.id,
      metrics: {
        bmi: parseFloat(bmi),
        targetWeight,
        dailyCalories,
      },
    });
  } catch (error) {
    console.error('Erro no endpoint /api/quiz:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user: data });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
