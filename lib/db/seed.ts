import { db } from "./schema";
import { generateSchedule } from "./schedule";
import { DEFAULT_EXERCISES } from "@/data/exercises";
import { DEFAULT_TEMPLATES } from "@/data/templates";
import { toDateISO } from "../utils";
import type { AppSettings, ProgramConfig } from "../types";

let _initialized = false;

/**
 * Seed the database on first load. Idempotent.
 */
export async function initializeApp(): Promise<void> {
  if (_initialized) return;

  // Seed exercises
  const exCount = await db.exercises.count();
  if (exCount === 0) {
    await db.exercises.bulkAdd(DEFAULT_EXERCISES);
  }

  // Seed templates
  const tplCount = await db.templates.count();
  if (tplCount === 0) {
    await db.templates.bulkAdd(DEFAULT_TEMPLATES);
  }

  // Seed default ProgramConfig
  const config = await db.programConfig.get("program");
  if (!config) {
    const defaultConfig: ProgramConfig = {
      id: "program",
      startDate: toDateISO(new Date()),
      weekSlots: ["push", "pull", "legs", "rest", "upper", "lower", "rest"],
      scheduleMode: "fixed",
    };
    await db.programConfig.add(defaultConfig);
  }

  // Seed settings
  const settings = await db.settings.get("settings");
  if (!settings) {
    const defaultSettings: AppSettings = {
      id: "settings",
      planStartDate: toDateISO(new Date()),
      autoFillLastWeights: true,
      theme: "dark",
      weightUnit: "lb",
    };
    await db.settings.add(defaultSettings);
  }

  // Generate 12-week schedule
  const swCount = await db.scheduledWorkouts.count();
  if (swCount === 0) {
    const s = await db.settings.get("settings");
    const startDate = s ? new Date(s.planStartDate) : new Date();
    await generateSchedule(startDate, 12);
  }

  _initialized = true;
}
