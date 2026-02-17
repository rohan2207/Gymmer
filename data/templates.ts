import type { Template } from "@/lib/types";

export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: "push",
    name: "Tuesday — Push",
    items: [
      { exerciseId: "incline-bb-bench", order: 1, sets: 4, repsMin: 6, repsMax: 8, restSec: 180 },
      { exerciseId: "flat-db-press", order: 2, sets: 3, repsMin: 8, repsMax: 10, restSec: 120 },
      { exerciseId: "shoulder-press", order: 3, sets: 3, repsMin: 8, repsMax: 12, restSec: 120 },
      { exerciseId: "lateral-raises", order: 4, sets: 4, repsMin: 15, repsMax: 15, restSec: 60 },
      { exerciseId: "close-grip-bench", order: 5, sets: 3, repsMin: 8, repsMax: 10, restSec: 120 },
      { exerciseId: "tricep-rope-pushdown", order: 6, sets: 3, repsMin: 12, repsMax: 15, restSec: 60, notes: "Flare hands at bottom" },
    ],
  },
  {
    id: "pull",
    name: "Wednesday — Pull",
    items: [
      { exerciseId: "deadlift", order: 1, sets: 3, repsMin: 3, repsMax: 5, restSec: 240 },
      { exerciseId: "lat-pulldown-wide", order: 2, sets: 4, repsMin: 10, repsMax: 12, restSec: 90 },
      { exerciseId: "seated-cable-row", order: 3, sets: 4, repsMin: 10, repsMax: 12, restSec: 90 },
      { exerciseId: "face-pulls", order: 4, sets: 3, repsMin: 15, repsMax: 15, restSec: 60 },
      { exerciseId: "hammer-curls", order: 5, sets: 3, repsMin: 10, repsMax: 12, restSec: 60 },
      { exerciseId: "db-bicep-curls", order: 6, sets: 3, repsMin: 12, repsMax: 12, restSec: 60 },
    ],
  },
  {
    id: "legs",
    name: "Thursday — Legs",
    items: [
      { exerciseId: "back-squat", order: 1, sets: 4, repsMin: 6, repsMax: 8, restSec: 180 },
      { exerciseId: "romanian-deadlift", order: 2, sets: 3, repsMin: 10, repsMax: 12, restSec: 120 },
      { exerciseId: "leg-press", order: 3, sets: 3, repsMin: 12, repsMax: 12, restSec: 90 },
      { exerciseId: "leg-extensions", order: 4, sets: 3, repsMin: 15, repsMax: 15, restSec: 60 },
      { exerciseId: "hanging-leg-raises", order: 5, sets: 3, repsMin: 8, repsMax: 20, restSec: 60, notes: "AMRAP" },
    ],
  },
  {
    id: "upper",
    name: "Friday — Upper",
    items: [
      { exerciseId: "incline-db-press", order: 1, sets: 3, repsMin: 10, repsMax: 12, restSec: 120 },
      { exerciseId: "weighted-pullups", order: 2, sets: 3, repsMin: 8, repsMax: 10, restSec: 120 },
      { exerciseId: "chest-supported-row", order: 3, sets: 3, repsMin: 10, repsMax: 12, restSec: 90 },
      { exerciseId: "skullcrushers", order: 4, sets: 3, repsMin: 10, repsMax: 12, restSec: 90 },
      { exerciseId: "overhead-cable-ext", order: 5, sets: 3, repsMin: 12, repsMax: 15, restSec: 60 },
      { exerciseId: "hammer-curls", order: 6, sets: 3, repsMin: 12, repsMax: 15, restSec: 60 },
      { exerciseId: "lateral-raises", order: 7, sets: 3, repsMin: 15, repsMax: 20, restSec: 60 },
    ],
  },
  {
    id: "lower",
    name: "Saturday — Lower",
    items: [
      { exerciseId: "hack-squat", order: 1, sets: 3, repsMin: 12, repsMax: 15, restSec: 120 },
      { exerciseId: "hamstring-curls", order: 2, sets: 3, repsMin: 12, repsMax: 15, restSec: 90 },
      { exerciseId: "standing-calf-raises", order: 3, sets: 4, repsMin: 15, repsMax: 20, restSec: 60 },
      { exerciseId: "seated-calf-raises", order: 4, sets: 3, repsMin: 15, repsMax: 20, restSec: 60 },
      { exerciseId: "cable-crunch", order: 5, sets: 4, repsMin: 12, repsMax: 15, restSec: 60 },
      { exerciseId: "planks", order: 6, sets: 3, repsMin: 60, repsMax: 60, restSec: 60, notes: "Seconds hold" },
    ],
  },
];
