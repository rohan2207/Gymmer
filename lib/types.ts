// ── Core Entities ──

export interface Exercise {
  id: string;
  name: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  equipment?: string;
}

export interface Template {
  id: string;
  name: string;
  items: TemplateItem[];
}

export interface TemplateItem {
  exerciseId: string;
  order: number;
  sets: number;
  repsMin: number;
  repsMax: number;
  restSec?: number;
  notes?: string;
}

export interface ScheduledWorkout {
  id?: number;
  dateISO: string; // "YYYY-MM-DD"
  templateId: string;
  status: "planned" | "done" | "skipped";
  overrideTemplateId?: string;
}

export interface Session {
  id?: number;
  dateISO: string;
  templateId?: string;
  startedAt: number;
  finishedAt?: number;
  notes?: string;
}

export interface SessionExercise {
  id?: number;
  sessionId: number;
  exerciseId: string;
  order: number;
  targetRepsMin: number;
  targetRepsMax: number;
}

export interface SessionSet {
  id?: number;
  sessionExerciseId: number;
  setNumber: number;
  targetRepsMin: number;
  targetRepsMax: number;
  reps?: number;
  weight?: number;
  rpe?: number;
  isFailure: boolean;
  isWarmup: boolean;
}

export interface AppSettings {
  id: string; // always "settings"
  planStartDate: string;
  autoFillLastWeights: boolean;
  theme: "light" | "dark" | "system";
}

// ── Helpers ──

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const SCHEDULE_MAP: Record<number, string | null> = {
  0: null,       // Sunday  = rest
  1: null,       // Monday  = rest
  2: "push",     // Tuesday
  3: "pull",     // Wednesday
  4: "legs",     // Thursday
  5: "upper",    // Friday
  6: "lower",    // Saturday
};

export const TEMPLATE_COLORS: Record<string, string> = {
  push: "bg-red-500",
  pull: "bg-blue-500",
  legs: "bg-amber-500",
  upper: "bg-purple-500",
  lower: "bg-green-500",
};

export const TEMPLATE_LABELS: Record<string, string> = {
  push: "Push",
  pull: "Pull",
  legs: "Legs",
  upper: "Upper",
  lower: "Lower",
};
