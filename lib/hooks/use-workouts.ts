'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db, getWeekStart } from '@/lib/db/db';
import type { Workout, WorkoutExercise, WorkoutSet, Template } from '@/lib/types';
import { calculateOneRepMax } from '@/lib/utils/calculations';

export function useWorkouts() {
  const allWorkouts = useLiveQuery(() => 
    db.workouts.orderBy('date').reverse().toArray()
  ) ?? [];

  const createWorkout = async (
    template: Template,
    dayName: string,
    date: Date = new Date()
  ): Promise<number> => {
    const templateDay = template.days.find(d => d.dayName === dayName);
    if (!templateDay) throw new Error('Day not found in template');

    const workout: Omit<Workout, 'id'> = {
      templateId: template.id!,
      templateName: template.name,
      dayName,
      date: date.getTime(),
      startedAt: Date.now(),
      exercises: templateDay.exercises.map(te => ({
        id: `${Date.now()}-${te.id}`,
        templateExerciseId: te.id,
        name: te.name,
        isCompleted: false,
        sets: Array.from({ length: te.sets }, (_, i) => ({
          id: `${Date.now()}-${te.id}-${i}`,
          setNumber: i + 1,
          reps: null,
          weight: null,
          completed: false
        }))
      }))
    };

    return await db.workouts.add(workout);
  };

  const updateWorkout = async (id: number, updates: Partial<Workout>) => {
    return await db.workouts.update(id, updates);
  };

  const completeWorkout = async (id: number) => {
    const workout = await db.workouts.get(id);
    if (!workout) return;

    const completedAt = Date.now();
    const duration = workout.startedAt 
      ? Math.floor((completedAt - workout.startedAt) / 1000)
      : undefined;

    await db.workouts.update(id, {
      completedAt,
      duration
    });

    // Check for PRs
    await checkAndRecordPRs(workout);
  };

  const updateExercise = async (
    workoutId: number,
    exerciseId: string,
    updates: Partial<WorkoutExercise>
  ) => {
    const workout = await db.workouts.get(workoutId);
    if (!workout) return;

    const exercises = workout.exercises.map(ex =>
      ex.id === exerciseId ? { ...ex, ...updates } : ex
    );

    return await db.workouts.update(workoutId, { exercises });
  };

  const updateSet = async (
    workoutId: number,
    exerciseId: string,
    setId: string,
    updates: Partial<WorkoutSet>
  ) => {
    const workout = await db.workouts.get(workoutId);
    if (!workout) return;

    const exercises = workout.exercises.map(ex => {
      if (ex.id !== exerciseId) return ex;
      
      return {
        ...ex,
        sets: ex.sets.map(set =>
          set.id === setId ? { ...set, ...updates } : set
        )
      };
    });

    return await db.workouts.update(workoutId, { exercises });
  };

  const deleteWorkout = async (id: number) => {
    return await db.workouts.delete(id);
  };

  const getWorkoutsByWeek = (weekStart: number) => {
    return useLiveQuery(async () => {
      const weekEnd = weekStart + 7 * 24 * 60 * 60 * 1000;
      return await db.workouts
        .where('date')
        .between(weekStart, weekEnd)
        .toArray();
    });
  };

  const getTodaysWorkout = useLiveQuery(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();
    const todayEnd = todayStart + 24 * 60 * 60 * 1000;

    const workouts = await db.workouts
      .where('date')
      .between(todayStart, todayEnd)
      .toArray();

    return workouts[0];
  });

  const checkAndRecordPRs = async (workout: Workout) => {
    for (const exercise of workout.exercises) {
      const completedSets = exercise.sets.filter(
        s => s.completed && s.weight && s.reps
      );

      for (const set of completedSets) {
        if (!set.weight || !set.reps) continue;

        const oneRepMax = calculateOneRepMax(set.weight, set.reps);
        
        // Get existing PRs for this exercise
        const existingPRs = await db.personalRecords
          .where('exerciseName')
          .equals(exercise.name)
          .toArray();

        const isPR = existingPRs.length === 0 || 
          oneRepMax > Math.max(...existingPRs.map(pr => pr.oneRepMax));

        if (isPR) {
          await db.personalRecords.add({
            exerciseName: exercise.name,
            weight: set.weight,
            reps: set.reps,
            date: workout.date,
            workoutId: workout.id!,
            oneRepMax
          });

          // Mark set as PR
          set.isPersonalRecord = true;
        }
      }
    }

    // Update workout with PR markers
    await db.workouts.update(workout.id!, { exercises: workout.exercises });
  };

  return {
    allWorkouts,
    getTodaysWorkout,
    createWorkout,
    updateWorkout,
    completeWorkout,
    updateExercise,
    updateSet,
    deleteWorkout,
    getWorkoutsByWeek
  };
}
