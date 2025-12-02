import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const period = searchParams.get('period') || '7'; // dias

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
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Buscar logs de peso
    const { data: weightLogs, error: weightError } = await supabase
      .from('weight_logs')
      .select('*')
      .eq('user_id', userId)
      .order('logged_at', { ascending: false })
      .limit(parseInt(period));

    // Buscar logs de treino
    const { data: workoutLogs, error: workoutError } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('completed_at', new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).toISOString());

    // Buscar logs de refeições
    const { data: mealLogs, error: mealError } = await supabase
      .from('meal_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).toISOString());

    // Calcular estatísticas
    const stats = {
      currentWeight: weightLogs && weightLogs.length > 0 ? weightLogs[0].weight : userData.weight,
      initialWeight: userData.weight,
      targetWeight: userData.target_weight,
      weightChange: weightLogs && weightLogs.length > 0 ? userData.weight - weightLogs[0].weight : 0,
      workoutsCompleted: workoutLogs?.filter(log => log.completed).length || 0,
      totalWorkouts: workoutLogs?.length || 0,
      mealsLogged: mealLogs?.length || 0,
      averageCalories: mealLogs && mealLogs.length > 0 
        ? Math.round(mealLogs.reduce((sum, log) => sum + (log.calories || 0), 0) / mealLogs.length)
        : 0,
      bmi: userData.bmi,
      dailyCaloriesTarget: userData.daily_calories,
    };

    // Calcular progresso
    const totalWeightToChange = Math.abs(userData.target_weight - userData.weight);
    const weightChanged = Math.abs(stats.weightChange);
    const progressPercentage = totalWeightToChange > 0 
      ? Math.min(Math.round((weightChanged / totalWeightToChange) * 100), 100)
      : 0;

    return NextResponse.json({
      success: true,
      user: userData,
      stats,
      progress: {
        percentage: progressPercentage,
        weightLogs: weightLogs || [],
        workoutLogs: workoutLogs || [],
        mealLogs: mealLogs || [],
      },
    });
  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, weight, date } = body;

    if (!userId || !weight) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Registrar peso
    const { data, error } = await supabase
      .from('weight_logs')
      .insert({
        user_id: userId,
        weight,
        logged_at: date || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao registrar peso:', error);
      return NextResponse.json(
        { error: 'Erro ao registrar peso' },
        { status: 500 }
      );
    }

    // Atualizar peso atual do usuário
    await supabase
      .from('users')
      .update({ weight })
      .eq('id', userId);

    return NextResponse.json({
      success: true,
      log: data,
    });
  } catch (error) {
    console.error('Erro no endpoint /api/progress:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
