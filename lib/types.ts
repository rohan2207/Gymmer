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

export interface ProgramConfig {
  id: string; // always "program"
  startDate: string; // ISO date
  weekSlots: string[]; // 7 slots, index 0=Mon..6=Sun, each is templateId or "rest"|"activeRest"
  scheduleMode: "fixed" | "carryForward";
}

export interface ScheduledWorkout {
  id?: number;
  dateISO: string; // "YYYY-MM-DD"
  templateId: string; // can be "rest" or "activeRest"
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

export interface CardioLog {
  id?: number;
  dateISO: string;
  type: "liss" | "hiit" | "steps" | "other";
  durationMin: number;
  notes?: string;
}

export interface AppSettings {
  id: string; // always "settings"
  planStartDate: string;
  autoFillLastWeights: boolean;
  theme: "light" | "dark" | "system";
  weightUnit: "lb" | "kg";
}

// ── Helpers ──

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const TEMPLATE_COLORS: Record<string, string> = {
  push: "text-red-400",
  pull: "text-blue-400",
  legs: "text-amber-400",
  upper: "text-purple-400",
  lower: "text-emerald-400",
  rest: "text-zinc-500",
  activeRest: "text-teal-400",
};

export const TEMPLATE_BG: Record<string, string> = {
  push: "bg-red-500/15",
  pull: "bg-blue-500/15",
  legs: "bg-amber-500/15",
  upper: "bg-purple-500/15",
  lower: "bg-emerald-500/15",
  rest: "bg-zinc-500/10",
  activeRest: "bg-teal-500/15",
};

export const TEMPLATE_LABELS: Record<string, string> = {
  push: "Push",
  pull: "Pull",
  legs: "Legs",
  upper: "Upper",
  lower: "Lower",
  rest: "Rest",
  activeRest: "Active",
};

export const SLOT_OPTIONS = [
  { value: "push", label: "Push" },
  { value: "pull", label: "Pull" },
  { value: "legs", label: "Legs" },
  { value: "upper", label: "Upper" },
  { value: "lower", label: "Lower" },
  { value: "rest", label: "Rest" },
  { value: "activeRest", label: "Active Rest" },
];

export const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const TRAINING_CYCLE = ["push", "pull", "legs", "upper", "lower"] as const;
export type TrainingType = (typeof TRAINING_CYCLE)[number];
