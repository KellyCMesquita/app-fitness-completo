import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

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

    // Buscar lembretes de medicação
    const { data: reminders, error } = await supabase
      .from('medication_reminders')
      .select('*')
      .eq('user_id', userId)
      .order('reminder_time', { ascending: true });

    if (error) {
      console.error('Erro ao buscar lembretes:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar lembretes' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reminders: reminders || [],
    });
  } catch (error) {
    console.error('Erro no endpoint /api/medication:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, medicationType, dose, reminderTime, frequency } = body;

    if (!userId || !medicationType || !dose || !reminderTime) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Criar lembrete de medicação
    const { data, error } = await supabase
      .from('medication_reminders')
      .insert({
        user_id: userId,
        medication_type: medicationType,
        dose,
        reminder_time: reminderTime,
        frequency: frequency || 'weekly',
        active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar lembrete:', error);
      return NextResponse.json(
        { error: 'Erro ao criar lembrete' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reminder: data,
    });
  } catch (error) {
    console.error('Erro no endpoint /api/medication:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { reminderId, taken, takenAt } = body;

    if (!reminderId) {
      return NextResponse.json(
        { error: 'reminderId é obrigatório' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Registrar que medicação foi tomada
    const { data, error } = await supabase
      .from('medication_logs')
      .insert({
        reminder_id: reminderId,
        taken,
        taken_at: takenAt || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao registrar medicação:', error);
      return NextResponse.json(
        { error: 'Erro ao registrar medicação' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      log: data,
    });
  } catch (error) {
    console.error('Erro no endpoint /api/medication:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reminderId = searchParams.get('reminderId');

    if (!reminderId) {
      return NextResponse.json(
        { error: 'reminderId é obrigatório' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Desativar lembrete
    const { error } = await supabase
      .from('medication_reminders')
      .update({ active: false })
      .eq('id', reminderId);

    if (error) {
      console.error('Erro ao desativar lembrete:', error);
      return NextResponse.json(
        { error: 'Erro ao desativar lembrete' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Lembrete desativado com sucesso',
    });
  } catch (error) {
    console.error('Erro no endpoint /api/medication:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
