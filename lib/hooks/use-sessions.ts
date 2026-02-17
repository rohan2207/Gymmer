"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/schema";
import type {
  Session,
  SessionExercise,
  SessionSet,
  Template,
} from "@/lib/types";

export function useSessionForDate(dateISO: string) {
  return useLiveQuery(
    () => db.sessions.where("dateISO").equals(dateISO).first(),
    [dateISO]
  );
}

export function useSessionExercises(sessionId: number | undefined) {
  return (
    useLiveQuery(
      () =>
        sessionId
          ? db.sessionExercises
              .where("sessionId")
              .equals(sessionId)
              .sortBy("order")
          : [],
      [sessionId]
    ) ?? []
  );
}

export function useSessionSets(sessionExerciseId: number | undefined) {
  return (
    useLiveQuery(
      () =>
        sessionExerciseId
          ? db.sessionSets
              .where("sessionExerciseId")
              .equals(sessionExerciseId)
              .sortBy("setNumber")
          : [],
      [sessionExerciseId]
    ) ?? []
  );
}

export function useAllSessionSetsForSession(sessionId: number | undefined) {
  return (
    useLiveQuery(async () => {
      if (!sessionId) return [];
      const exercises = await db.sessionExercises
        .where("sessionId")
        .equals(sessionId)
        .toArray();
      const exIds = exercises.map((e) => e.id!);
      const sets = await db.sessionSets
        .where("sessionExerciseId")
        .anyOf(exIds)
        .toArray();
      return sets;
    }, [sessionId]) ?? []
  );
}

/**
 * Create a new session from a template. Pre-generates all exercise rows and set rows.
 * Optionally auto-fills weights from last session for this template.
 */
export async function startSession(
  dateISO: string,
  template: Template,
  autoFillWeights: boolean
): Promise<number> {
  // Create the session
  const sessionId = await db.sessions.add({
    dateISO,
    templateId: template.id,
    startedAt: Date.now(),
  } as Session);

  // Collect last session weights per exercise
  const lastWeights: Record<string, { weight: number; reps: number }[]> = {};

  if (autoFillWeights) {
    const lastSession = await db.sessions
      .where("dateISO")
      .below(dateISO)
      .reverse()
      .filter((s) => s.templateId === template.id && !!s.finishedAt)
      .first();

    if (lastSession) {
      const lastExercises = await db.sessionExercises
        .where("sessionId")
        .equals(lastSession.id!)
        .toArray();

      for (const ex of lastExercises) {
        const sets = await db.sessionSets
          .where("sessionExerciseId")
          .equals(ex.id!)
          .sortBy("setNumber");
        lastWeights[ex.exerciseId] = sets
          .filter((s) => !s.isWarmup && s.weight)
          .map((s) => ({ weight: s.weight!, reps: s.reps ?? 0 }));
      }
    }
  }

  // Create exercises and sets
  for (const item of template.items) {
    const seId = await db.sessionExercises.add({
      sessionId: sessionId as number,
      exerciseId: item.exerciseId,
      order: item.order,
      targetRepsMin: item.repsMin,
      targetRepsMax: item.repsMax,
    } as SessionExercise);

    const lastEx = lastWeights[item.exerciseId] ?? [];

    for (let s = 1; s <= item.sets; s++) {
      const prevSet = lastEx[s - 1];
      await db.sessionSets.add({
        sessionExerciseId: seId as number,
        setNumber: s,
        targetRepsMin: item.repsMin,
        targetRepsMax: item.repsMax,
        weight: prevSet?.weight ?? undefined,
        reps: undefined,
        isFailure: false,
        isWarmup: false,
      } as SessionSet);
    }
  }

  return sessionId as number;
}

export async function finishSession(sessionId: number, dateISO: string) {
  await db.sessions.update(sessionId, { finishedAt: Date.now() });

  // Mark the scheduled workout as done
  const sw = await db.scheduledWorkouts
    .where("dateISO")
    .equals(dateISO)
    .first();
  if (sw) {
    await db.scheduledWorkouts.update(sw.id!, { status: "done" });
  }
}

export async function undoFinishSession(sessionId: number, dateISO: string) {
  await db.sessions.update(sessionId, { finishedAt: undefined });

  const sw = await db.scheduledWorkouts
    .where("dateISO")
    .equals(dateISO)
    .first();
  if (sw) {
    await db.scheduledWorkouts.update(sw.id!, { status: "planned" });
  }
}

export async function updateSet(
  setId: number,
  updates: Partial<SessionSet>
) {
  await db.sessionSets.update(setId, updates);
}

export async function addSetToExercise(sessionExerciseId: number) {
  const existing = await db.sessionSets
    .where("sessionExerciseId")
    .equals(sessionExerciseId)
    .count();

  const first = await db.sessionSets
    .where("sessionExerciseId")
    .equals(sessionExerciseId)
    .first();

  await db.sessionSets.add({
    sessionExerciseId,
    setNumber: existing + 1,
    targetRepsMin: first?.targetRepsMin ?? 8,
    targetRepsMax: first?.targetRepsMax ?? 12,
    isFailure: false,
    isWarmup: false,
  } as SessionSet);
}

export async function removeLastSet(sessionExerciseId: number) {
  const sets = await db.sessionSets
    .where("sessionExerciseId")
    .equals(sessionExerciseId)
    .sortBy("setNumber");

  if (sets.length > 1) {
    await db.sessionSets.delete(sets[sets.length - 1].id!);
  }
}
