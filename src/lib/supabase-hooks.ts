'use client';

import { useState, useEffect } from 'react';
import {
  supabaseClient,
  SupabaseUser,
  SupabaseProgress,
  SupabaseTraining,
  SupabaseDiet,
} from './supabase-client';

// Hook para gerenciar usuário
export function useUser(userId?: number) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const users = await supabaseClient.getUserById(id);
      if (users && users.length > 0) {
        setUser(users[0]);
      } else {
        setError('Usuário não encontrado');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar usuário');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: Omit<SupabaseUser, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await supabaseClient.createUser(userData);
      setUser(newUser);
      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar usuário');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (
    id: number,
    userData: Partial<Omit<SupabaseUser, 'id' | 'created_at'>>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await supabaseClient.updateUser(id, userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar usuário');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId]);

  return { user, loading, error, fetchUser, createUser, updateUser };
}

// Hook para gerenciar progresso
export function useProgress(userId?: number) {
  const [progress, setProgress] = useState<SupabaseProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await supabaseClient.getProgress(id);
      setProgress(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar progresso');
    } finally {
      setLoading(false);
    }
  };

  const addProgress = async (progressData: Omit<SupabaseProgress, 'id' | 'data'>) => {
    setLoading(true);
    setError(null);
    try {
      const newProgress = await supabaseClient.addProgress(progressData);
      setProgress((prev) => [newProgress, ...prev]);
      return newProgress;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar progresso');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProgress(userId);
    }
  }, [userId]);

  return { progress, loading, error, fetchProgress, addProgress };
}

// Hook para gerenciar treinos
export function useTrainings(userId?: number) {
  const [trainings, setTrainings] = useState<SupabaseTraining[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrainings = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await supabaseClient.getTrainings(id);
      setTrainings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar treinos');
    } finally {
      setLoading(false);
    }
  };

  const addTraining = async (trainingData: Omit<SupabaseTraining, 'id' | 'data'>) => {
    setLoading(true);
    setError(null);
    try {
      const newTraining = await supabaseClient.addTraining(trainingData);
      setTrainings((prev) => [newTraining, ...prev]);
      return newTraining;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar treino');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTrainings(userId);
    }
  }, [userId]);

  return { trainings, loading, error, fetchTrainings, addTraining };
}

// Hook para gerenciar dietas
export function useDiets(userId?: number) {
  const [diets, setDiets] = useState<SupabaseDiet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDiets = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await supabaseClient.getDiets(id);
      setDiets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar dietas');
    } finally {
      setLoading(false);
    }
  };

  const addDiet = async (dietData: Omit<SupabaseDiet, 'id' | 'data'>) => {
    setLoading(true);
    setError(null);
    try {
      const newDiet = await supabaseClient.addDiet(dietData);
      setDiets((prev) => [newDiet, ...prev]);
      return newDiet;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar dieta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchDiets(userId);
    }
  }, [userId]);

  return { diets, loading, error, fetchDiets, addDiet };
}
