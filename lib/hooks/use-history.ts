'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db, getWeekStart } from '@/lib/db/db';
import { compareWeeks } from '@/lib/utils/calculations';

export function useHistory() {
  const recentWorkouts = useLiveQuery(() => 
    db.workouts
      .orderBy('date')
      .reverse()
      .limit(50)
      .toArray()
  ) ?? [];

  const completedWorkouts = useLiveQuery(() =>
    db.workouts
      .where('completedAt')
      .above(0)
      .reverse()
      .toArray()
  ) ?? [];

  const getExerciseHistory = (exerciseName: string) => {
    return useLiveQuery(async () => {
      const workouts = await db.workouts
        .where('completedAt')
        .above(0)
        .reverse()
        .limit(100)
        .toArray();

      return workouts
        .filter(w => w.exercises.some(e => e.name === exerciseName))
        .map(w => {
          const exercise = w.exercises.find(e => e.name === exerciseName)!;
          const completedSets = exercise.sets.filter(
            s => s.completed && s.weight && s.reps
          );

          const maxWeight = Math.max(...completedSets.map(s => s.weight || 0));
          const totalVolume = completedSets.reduce(
            (sum, s) => sum + (s.weight || 0) * (s.reps || 0),
            0
          );

          return {
            date: w.date,
            maxWeight,
            totalVolume,
            sets: completedSets
          };
        });
    });
  };

  const getMonthWorkouts = (year: number, month: number) => {
    return useLiveQuery(async () => {
      const monthStart = new Date(year, month, 1).getTime();
      const monthEnd = new Date(year, month + 1, 0, 23, 59, 59).getTime();
      
      return await db.workouts
        .where('date')
        .between(monthStart, monthEnd)
        .toArray();
    });
  };

  const weeklyComparison = useLiveQuery(async () => {
    const thisWeekStart = getWeekStart();
    const lastWeekStart = thisWeekStart - 7 * 24 * 60 * 60 * 1000;

    const thisWeekEnd = thisWeekStart + 7 * 24 * 60 * 60 * 1000;
    const lastWeekEnd = lastWeekStart + 7 * 24 * 60 * 60 * 1000;

    const thisWeek = await db.workouts
      .where('date')
      .between(thisWeekStart, thisWeekEnd)
      .toArray();

    const lastWeek = await db.workouts
      .where('date')
      .between(lastWeekStart, lastWeekEnd)
      .toArray();

    return compareWeeks(thisWeek, lastWeek);
  });

  const personalRecords = useLiveQuery(() =>
    db.personalRecords.orderBy('date').reverse().limit(20).toArray()
  ) ?? [];

  const getExercisePRs = (exerciseName: string) => {
    return useLiveQuery(() =>
      db.personalRecords
        .where('exerciseName')
        .equals(exerciseName)
        .reverse()
        .toArray()
    );
  };

  const getCurrentStreak = useLiveQuery(async () => {
    const workouts = await db.workouts
      .where('completedAt')
      .above(0)
      .reverse()
      .toArray();

    if (workouts.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const workout of workouts) {
      const workoutDate = new Date(workout.date);
      workoutDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor(
        (today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff <= streak + 2) { // Allow 1 rest day
        streak++;
      } else {
        break;
      }
    }

    return streak;
  });

  return {
    recentWorkouts,
    completedWorkouts,
    personalRecords,
    weeklyComparison,
    getExerciseHistory,
    getExercisePRs,
    getMonthWorkouts,
    getCurrentStreak
  };
}
