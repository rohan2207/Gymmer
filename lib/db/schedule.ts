import { addDays, startOfDay } from "date-fns";
import { db } from "./schema";
import { toDateISO, fromDateISO } from "../utils";
import type { ScheduledWorkout, ProgramConfig } from "../types";

/**
 * Generate scheduled workouts from `startDate` for `weeks` weeks using ProgramConfig.
 * Generates ALL 7 days including rest/activeRest so calendar can display them.
 * Idempotent: skips dates that already have a scheduled workout.
 */
export async function generateSchedule(
  startDate: Date,
  weeks: number
): Promise<number> {
  const config = await db.programConfig.get("program");
  if (!config) return 0;

  const totalDays = weeks * 7;
  const start = startOfDay(startDate);
  let created = 0;

  const existing = await db.scheduledWorkouts.toArray();
  const existingDates = new Set(existing.map((w) => w.dateISO));

  const toInsert: Omit<ScheduledWorkout, "id">[] = [];

  for (let i = 0; i < totalDays; i++) {
    const day = addDays(start, i);
    const iso = toDateISO(day);
    if (existingDates.has(iso)) continue;

    // weekSlots index: 0=Mon..6=Sun, getDay(): 0=Sun..6=Sat
    const jsDay = day.getDay(); // 0=Sun
    const slotIndex = jsDay === 0 ? 6 : jsDay - 1; // convert to 0=Mon
    const templateId = config.weekSlots[slotIndex] ?? "rest";

    toInsert.push({
      dateISO: iso,
      templateId,
      status: "planned",
    });
  }

  if (toInsert.length > 0) {
    await db.scheduledWorkouts.bulkAdd(toInsert as ScheduledWorkout[]);
    created = toInsert.length;
  }

  return created;
}

/**
 * Extend the schedule to cover `targetDate`.
 */
export async function ensureScheduleCovers(targetDate: Date): Promise<void> {
  const targetISO = toDateISO(targetDate);

  const last = await db.scheduledWorkouts
    .orderBy("dateISO")
    .reverse()
    .first();

  if (!last || last.dateISO < targetISO) {
    const startFrom = last
      ? addDays(fromDateISO(last.dateISO), 1)
      : new Date();

    await generateSchedule(startFrom, 4);
  }
}

/**
 * Clear all scheduled workouts and regenerate from ProgramConfig.
 */
export async function regenerateFullSchedule(): Promise<number> {
  const config = await db.programConfig.get("program");
  if (!config) return 0;

  await db.scheduledWorkouts.clear();
  return generateSchedule(new Date(config.startDate), 12);
}
