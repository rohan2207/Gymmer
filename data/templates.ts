import type { Template } from "@/lib/types";

export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: "push",
    name: "Push (Upper Chest & Triceps)",
    items: [
      { exerciseId: "incline-bb-bench", order: 1, sets: 4, repsMin: 5, repsMax: 8, restSec: 180, notes: "Lower incline = more upper chest" },
      { exerciseId: "flat-db-press", order: 2, sets: 3, repsMin: 8, repsMax: 10, restSec: 120, notes: "Controlled eccentric" },
      { exerciseId: "seated-db-shoulder-press", order: 3, sets: 3, repsMin: 8, repsMax: 10, restSec: 120 },
      { exerciseId: "cable-lateral-raise", order: 4, sets: 4, repsMin: 12, repsMax: 15, restSec: 60, notes: "Better tension than DB" },
      { exerciseId: "close-grip-bench", order: 5, sets: 3, repsMin: 6, repsMax: 8, restSec: 120, notes: "Heavy tricep overload" },
      { exerciseId: "overhead-cable-ext", order: 6, sets: 3, repsMin: 12, repsMax: 15, restSec: 60, notes: "Long head focus" },
      { exerciseId: "rope-pushdowns", order: 7, sets: 2, repsMin: 15, repsMax: 20, restSec: 60, notes: "Pump finisher" },
    ],
  },
  {
    id: "pull",
    name: "Pull (Back Thickness)",
    items: [
      { exerciseId: "barbell-row", order: 1, sets: 4, repsMin: 6, repsMax: 8, restSec: 180, notes: "Thickness first" },
      { exerciseId: "deadlift", order: 2, sets: 3, repsMin: 3, repsMax: 5, restSec: 240, notes: "Strength stimulus only" },
      { exerciseId: "lat-pulldown-neutral", order: 3, sets: 3, repsMin: 10, repsMax: 12, restSec: 90, notes: "Width" },
      { exerciseId: "seated-cable-row", order: 4, sets: 3, repsMin: 10, repsMax: 12, restSec: 90, notes: "Mid-back" },
      { exerciseId: "face-pulls", order: 5, sets: 3, repsMin: 15, repsMax: 20, restSec: 60, notes: "Rear delt health" },
      { exerciseId: "hammer-curls", order: 6, sets: 3, repsMin: 10, repsMax: 12, restSec: 60 },
      { exerciseId: "incline-db-curls", order: 7, sets: 2, repsMin: 12, repsMax: 15, restSec: 60, notes: "Stretch stimulus" },
    ],
  },
  {
    id: "legs",
    name: "Legs (Strength)",
    items: [
      { exerciseId: "back-squat", order: 1, sets: 4, repsMin: 5, repsMax: 8, restSec: 180, notes: "Primary strength lift" },
      { exerciseId: "romanian-deadlift", order: 2, sets: 3, repsMin: 8, repsMax: 10, restSec: 120, notes: "Posterior chain" },
      { exerciseId: "leg-press", order: 3, sets: 3, repsMin: 10, repsMax: 12, restSec: 90 },
      { exerciseId: "walking-lunges", order: 4, sets: 2, repsMin: 12, repsMax: 12, restSec: 90, notes: "12 each leg" },
      { exerciseId: "hanging-leg-raises", order: 5, sets: 3, repsMin: 8, repsMax: 20, restSec: 60, notes: "AMRAP" },
    ],
  },
  {
    id: "upper",
    name: "Upper (Back + Tricep Specialization)",
    items: [
      { exerciseId: "incline-db-press", order: 1, sets: 3, repsMin: 8, repsMax: 10, restSec: 120, notes: "Upper chest 2nd hit" },
      { exerciseId: "weighted-pullups", order: 2, sets: 3, repsMin: 6, repsMax: 8, restSec: 120, notes: "Width strength" },
      { exerciseId: "chest-supported-row", order: 3, sets: 4, repsMin: 8, repsMax: 10, restSec: 90, notes: "Thickness focus" },
      { exerciseId: "single-arm-cable-row", order: 4, sets: 2, repsMin: 12, repsMax: 15, restSec: 60, notes: "Mind-muscle" },
      { exerciseId: "skullcrushers", order: 5, sets: 3, repsMin: 8, repsMax: 10, restSec: 90 },
      { exerciseId: "overhead-cable-ext", order: 6, sets: 3, repsMin: 12, repsMax: 15, restSec: 60, notes: "Long head" },
      { exerciseId: "cable-lateral-raise", order: 7, sets: 3, repsMin: 15, repsMax: 20, restSec: 60 },
    ],
  },
  {
    id: "lower",
    name: "Lower (Hypertrophy + Conditioning)",
    items: [
      { exerciseId: "hack-squat", order: 1, sets: 3, repsMin: 10, repsMax: 15, restSec: 120 },
      { exerciseId: "hamstring-curls", order: 2, sets: 3, repsMin: 12, repsMax: 15, restSec: 90 },
      { exerciseId: "bulgarian-split-squat", order: 3, sets: 2, repsMin: 10, repsMax: 12, restSec: 90 },
      { exerciseId: "standing-calf-raises", order: 4, sets: 4, repsMin: 12, repsMax: 15, restSec: 60 },
      { exerciseId: "seated-calf-raises", order: 5, sets: 3, repsMin: 15, repsMax: 20, restSec: 60 },
      { exerciseId: "cable-crunch", order: 6, sets: 3, repsMin: 12, repsMax: 15, restSec: 60 },
      { exerciseId: "planks", order: 7, sets: 3, repsMin: 45, repsMax: 60, restSec: 60, notes: "45-60 sec hold" },
    ],
  },
  {
    id: "activeRest",
    name: "Active Rest",
    items: [
      { exerciseId: "liss-cardio", order: 1, sets: 1, repsMin: 25, repsMax: 25, notes: "25 min LISS" },
      { exerciseId: "mobility", order: 2, sets: 1, repsMin: 10, repsMax: 10, notes: "10 min mobility" },
    ],
  },
];
