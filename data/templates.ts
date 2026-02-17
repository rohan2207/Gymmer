import type { Template } from "@/lib/types";

export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: "push",
    name: "Push (Upper Chest + Triceps)",
    items: [
      { exerciseId: "incline-bb-bench", order: 1, sets: 4, repsMin: 6, repsMax: 8, restSec: 180 },
      { exerciseId: "flat-db-press", order: 2, sets: 3, repsMin: 8, repsMax: 10, restSec: 120 },
      { exerciseId: "seated-db-shoulder-press", order: 3, sets: 3, repsMin: 8, repsMax: 12, restSec: 120 },
      { exerciseId: "cable-lateral-raise", order: 4, sets: 4, repsMin: 15, repsMax: 15, restSec: 60 },
      { exerciseId: "close-grip-bench", order: 5, sets: 3, repsMin: 6, repsMax: 8, restSec: 120 },
      { exerciseId: "overhead-cable-ext", order: 6, sets: 3, repsMin: 12, repsMax: 15, restSec: 60 },
      { exerciseId: "rope-pushdowns", order: 7, sets: 3, repsMin: 12, repsMax: 15, restSec: 60 },
    ],
  },
  {
    id: "pull",
    name: "Pull (Back Thickness)",
    items: [
      { exerciseId: "deadlift", order: 1, sets: 3, repsMin: 3, repsMax: 5, restSec: 240 },
      { exerciseId: "barbell-row", order: 2, sets: 4, repsMin: 6, repsMax: 8, restSec: 180 },
      { exerciseId: "lat-pulldown", order: 3, sets: 4, repsMin: 10, repsMax: 12, restSec: 90 },
      { exerciseId: "seated-cable-row", order: 4, sets: 4, repsMin: 10, repsMax: 12, restSec: 90 },
      { exerciseId: "face-pulls", order: 5, sets: 3, repsMin: 15, repsMax: 20, restSec: 60 },
      { exerciseId: "hammer-curls", order: 6, sets: 3, repsMin: 10, repsMax: 12, restSec: 60 },
      { exerciseId: "incline-db-curls", order: 7, sets: 3, repsMin: 12, repsMax: 15, restSec: 60 },
    ],
  },
  {
    id: "legs",
    name: "Legs (Strength)",
    items: [
      { exerciseId: "back-squat", order: 1, sets: 4, repsMin: 5, repsMax: 8, restSec: 180 },
      { exerciseId: "romanian-deadlift", order: 2, sets: 3, repsMin: 8, repsMax: 10, restSec: 120 },
      { exerciseId: "leg-press", order: 3, sets: 3, repsMin: 10, repsMax: 12, restSec: 90 },
      { exerciseId: "walking-lunges", order: 4, sets: 3, repsMin: 12, repsMax: 12, restSec: 90, notes: "12 each leg" },
      { exerciseId: "leg-extensions", order: 5, sets: 3, repsMin: 15, repsMax: 15, restSec: 60 },
      { exerciseId: "hanging-leg-raises", order: 6, sets: 3, repsMin: 8, repsMax: 20, restSec: 60, notes: "AMRAP" },
    ],
  },
  {
    id: "upper",
    name: "Upper (Back + Tricep Bias)",
    items: [
      { exerciseId: "incline-db-press", order: 1, sets: 3, repsMin: 8, repsMax: 10, restSec: 120 },
      { exerciseId: "weighted-pullups", order: 2, sets: 3, repsMin: 6, repsMax: 8, restSec: 120 },
      { exerciseId: "chest-supported-row", order: 3, sets: 4, repsMin: 8, repsMax: 10, restSec: 90 },
      { exerciseId: "single-arm-cable-row", order: 4, sets: 3, repsMin: 12, repsMax: 15, restSec: 60 },
      { exerciseId: "skullcrushers", order: 5, sets: 3, repsMin: 8, repsMax: 10, restSec: 90 },
      { exerciseId: "overhead-cable-ext", order: 6, sets: 3, repsMin: 12, repsMax: 15, restSec: 60 },
      { exerciseId: "hammer-curls", order: 7, sets: 3, repsMin: 12, repsMax: 15, restSec: 60 },
      { exerciseId: "cable-lateral-raise", order: 8, sets: 3, repsMin: 15, repsMax: 20, restSec: 60 },
    ],
  },
  {
    id: "lower",
    name: "Lower (Hypertrophy + Conditioning)",
    items: [
      { exerciseId: "hack-squat", order: 1, sets: 3, repsMin: 10, repsMax: 15, restSec: 120 },
      { exerciseId: "hamstring-curls", order: 2, sets: 3, repsMin: 12, repsMax: 15, restSec: 90 },
      { exerciseId: "bulgarian-split-squat", order: 3, sets: 3, repsMin: 10, repsMax: 12, restSec: 90 },
      { exerciseId: "standing-calf-raises", order: 4, sets: 4, repsMin: 12, repsMax: 15, restSec: 60 },
      { exerciseId: "seated-calf-raises", order: 5, sets: 3, repsMin: 15, repsMax: 20, restSec: 60 },
      { exerciseId: "cable-crunch", order: 6, sets: 4, repsMin: 12, repsMax: 15, restSec: 60 },
      { exerciseId: "planks", order: 7, sets: 3, repsMin: 45, repsMax: 60, restSec: 60, notes: "45-60 sec hold" },
    ],
  },
  {
    id: "activeRest",
    name: "Active Rest",
    items: [
      { exerciseId: "liss-cardio", order: 1, sets: 1, repsMin: 25, repsMax: 30, notes: "25-30 min LISS (incline walk / bike)" },
      { exerciseId: "mobility", order: 2, sets: 1, repsMin: 10, repsMax: 10, notes: "10 min mobility" },
    ],
  },
];
