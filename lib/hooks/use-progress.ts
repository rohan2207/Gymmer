"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/schema";
import { estimated1RM } from "@/lib/utils";

export interface ExerciseDataPoint {
  dateISO: string;
  maxWeight: number;
  bestReps: number;
  estimated1RM: number;
  totalVolume: number;
  failureSets: number;
}

export function useExerciseProgress(exerciseId: string | undefined) {
  return (
    useLiveQuery(async () => {
      if (!exerciseId) return [];

      const sessionExercises = await db.sessionExercises
        .where("exerciseId")
        .equals(exerciseId)
        .toArray();

      const points: ExerciseDataPoint[] = [];

      for (const se of sessionExercises) {
        const session = await db.sessions.get(se.sessionId);
        if (!session?.finishedAt) continue;

        const sets = await db.sessionSets
          .where("sessionExerciseId")
          .equals(se.id!)
          .toArray();

        const workingSets = sets.filter((s) => !s.isWarmup && s.weight && s.reps);
        if (workingSets.length === 0) continue;

        const maxWeight = Math.max(...workingSets.map((s) => s.weight!));
        const bestSet = workingSets.reduce((a, b) =>
          (a.weight ?? 0) * (a.reps ?? 0) > (b.weight ?? 0) * (b.reps ?? 0)
            ? a
            : b
        );
        const totalVolume = workingSets.reduce(
          (sum, s) => sum + (s.weight ?? 0) * (s.reps ?? 0),
          0
        );

        points.push({
          dateISO: session.dateISO,
          maxWeight,
          bestReps: bestSet.reps ?? 0,
          estimated1RM: estimated1RM(bestSet.weight ?? 0, bestSet.reps ?? 0),
          totalVolume,
          failureSets: sets.filter((s) => s.isFailure).length,
        });
      }

      return points.sort((a, b) => a.dateISO.localeCompare(b.dateISO));
    }, [exerciseId]) ?? []
  );
}

export interface WeeklySummary {
  weekLabel: string;
  totalSets: number;
  totalVolume: number;
  failureSets: number;
  muscleGroups: Record<string, number>;
}

export function useWeeklySummaries() {
  return (
    useLiveQuery(async () => {
      const sessions = await db.sessions
        .filter((s) => !!s.finishedAt)
        .toArray();

      const exerciseMap = new Map(
        (await db.exercises.toArray()).map((e) => [e.id, e])
      );

      const weekMap = new Map<string, WeeklySummary>();

      for (const session of sessions) {
        const d = new Date(session.dateISO);
        const dayOfWeek = d.getDay();
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - ((dayOfWeek + 6) % 7)); // Monday
        const weekLabel = weekStart.toISOString().slice(0, 10);

        if (!weekMap.has(weekLabel)) {
          weekMap.set(weekLabel, {
            weekLabel,
            totalSets: 0,
            totalVolume: 0,
            failureSets: 0,
            muscleGroups: {},
          });
        }
        const week = weekMap.get(weekLabel)!;

        const exercises = await db.sessionExercises
          .where("sessionId")
          .equals(session.id!)
          .toArray();

        for (const ex of exercises) {
          const sets = await db.sessionSets
            .where("sessionExerciseId")
            .equals(ex.id!)
            .toArray();

          const workingSets = sets.filter((s) => !s.isWarmup);
          week.totalSets += workingSets.length;
          week.failureSets += workingSets.filter((s) => s.isFailure).length;

          const vol = workingSets.reduce(
            (sum, s) => sum + (s.weight ?? 0) * (s.reps ?? 0),
            0
          );
          week.totalVolume += vol;

          const exercise = exerciseMap.get(ex.exerciseId);
          if (exercise) {
            const muscle = exercise.primaryMuscle;
            week.muscleGroups[muscle] =
              (week.muscleGroups[muscle] ?? 0) + workingSets.length;
          }
        }
      }

      return Array.from(weekMap.values()).sort((a, b) =>
        b.weekLabel.localeCompare(a.weekLabel)
      );
    }) ?? []
  );
}
