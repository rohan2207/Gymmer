import { addDays, startOfDay } from "date-fns";
import { db } from "./schema";
import { SCHEDULE_MAP } from "../types";
import { toDateISO, fromDateISO } from "../utils";
import type { ScheduledWorkout } from "../types";

/**
 * Generate scheduled workouts from `startDate` for `weeks` weeks.
 * Idempotent: skips dates that already have a scheduled workout.
 */
export async function generateSchedule(
  startDate: Date,
  weeks: number
): Promise<number> {
  const totalDays = weeks * 7;
  const start = startOfDay(startDate);
  let created = 0;

  const existing = await db.scheduledWorkouts.toArray();
  const existingDates = new Set(existing.map((w) => w.dateISO));

  const toInsert: Omit<ScheduledWorkout, "id">[] = [];

  for (let i = 0; i < totalDays; i++) {
    const day = addDays(start, i);
    const dow = day.getDay(); // 0=Sun
    const templateId = SCHEDULE_MAP[dow];

    if (!templateId) continue; // rest day

    const iso = toDateISO(day);
    if (existingDates.has(iso)) continue; // already exists

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
 * Finds the last scheduled date and generates forward.
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

    await generateSchedule(startFrom, 4); // extend by 4 weeks
  }
}
