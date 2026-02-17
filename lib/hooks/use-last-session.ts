"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/schema";
import { TRAINING_CYCLE } from "@/lib/types";

export interface LastExerciseData {
  exerciseId: string;
  bestWeight: number;
  bestReps: number;
}

export type LastSessionMap = Record<string, LastExerciseData[]>;

/**
 * For each training template, fetch the most recent completed session
 * and return the best (heaviest) working set per exercise.
 */
export function useLastSessionsForAllTemplates(): LastSessionMap | undefined {
  return useLiveQuery(async () => {
    const result: LastSessionMap = {};

    for (const templateId of TRAINING_CYCLE) {
      const lastSession = await db.sessions
        .where("dateISO")
        .above("")
        .reverse()
        .filter((s) => s.templateId === templateId && !!s.finishedAt)
        .first();

      if (!lastSession) continue;

      const exercises = await db.sessionExercises
        .where("sessionId")
        .equals(lastSession.id!)
        .sortBy("order");

      const exerciseData: LastExerciseData[] = [];

      for (const ex of exercises) {
        const sets = await db.sessionSets
          .where("sessionExerciseId")
          .equals(ex.id!)
          .filter((s) => !s.isWarmup && !!s.weight && !!s.reps)
          .toArray();

        if (sets.length === 0) continue;

        const best = sets.reduce((a, b) =>
          (b.weight ?? 0) > (a.weight ?? 0) ? b : a
        );

        exerciseData.push({
          exerciseId: ex.exerciseId,
          bestWeight: best.weight!,
          bestReps: best.reps!,
        });
      }

      result[templateId] = exerciseData;
    }

    return result;
  });
}

/**
 * For a specific template, fetch the last completed session's data.
 * Returns a map of exerciseId -> { bestWeight, bestReps } for the best working set.
 */
export function useLastSessionForTemplate(
  templateId: string | undefined
): Map<string, { weight: number; reps: number }> | undefined {
  return useLiveQuery(
    async () => {
      if (!templateId) return new Map();

      const lastSession = await db.sessions
        .where("dateISO")
        .above("")
        .reverse()
        .filter((s) => s.templateId === templateId && !!s.finishedAt)
        .first();

      if (!lastSession) return new Map();

      const exercises = await db.sessionExercises
        .where("sessionId")
        .equals(lastSession.id!)
        .toArray();

      const map = new Map<string, { weight: number; reps: number }>();

      for (const ex of exercises) {
        const sets = await db.sessionSets
          .where("sessionExerciseId")
          .equals(ex.id!)
          .filter((s) => !s.isWarmup && !!s.weight && !!s.reps)
          .toArray();

        if (sets.length === 0) continue;

        const best = sets.reduce((a, b) =>
          (b.weight ?? 0) > (a.weight ?? 0) ? b : a
        );

        map.set(ex.exerciseId, {
          weight: best.weight!,
          reps: best.reps!,
        });
      }

      return map;
    },
    [templateId]
  );
}
