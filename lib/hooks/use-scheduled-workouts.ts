"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/schema";
import type { ScheduledWorkout } from "@/lib/types";

export function useScheduledWorkouts(startISO: string, endISO: string) {
  return (
    useLiveQuery(
      () =>
        db.scheduledWorkouts
          .where("dateISO")
          .between(startISO, endISO, true, true)
          .toArray(),
      [startISO, endISO]
    ) ?? []
  );
}

export function useScheduledWorkoutForDate(dateISO: string) {
  return useLiveQuery(
    () => db.scheduledWorkouts.where("dateISO").equals(dateISO).first(),
    [dateISO]
  );
}

export async function markWorkoutDone(id: number) {
  await db.scheduledWorkouts.update(id, { status: "done" });
}

export async function markWorkoutSkipped(id: number) {
  await db.scheduledWorkouts.update(id, { status: "skipped" });
}

export async function setDayOverride(id: number, overrideTemplateId: string) {
  await db.scheduledWorkouts.update(id, { overrideTemplateId });
}
