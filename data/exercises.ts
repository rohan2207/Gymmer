import type { Exercise } from "@/lib/types";

export const DEFAULT_EXERCISES: Exercise[] = [
  // ── Push ──
  { id: "incline-bb-bench", name: "Incline BB Bench Press", primaryMuscle: "Upper Chest", secondaryMuscles: ["Shoulders", "Triceps"], equipment: "Barbell" },
  { id: "flat-db-press", name: "Flat DB Press", primaryMuscle: "Chest", secondaryMuscles: ["Shoulders", "Triceps"], equipment: "Dumbbells" },
  { id: "shoulder-press", name: "Shoulder Press (DB/BB)", primaryMuscle: "Shoulders", secondaryMuscles: ["Triceps"], equipment: "Dumbbells" },
  { id: "lateral-raises", name: "Lateral Raises", primaryMuscle: "Side Delts", secondaryMuscles: [], equipment: "Dumbbells" },
  { id: "close-grip-bench", name: "Close-Grip Bench Press", primaryMuscle: "Triceps", secondaryMuscles: ["Chest"], equipment: "Barbell" },
  { id: "tricep-rope-pushdown", name: "Tricep Rope Pushdown", primaryMuscle: "Triceps", secondaryMuscles: [], equipment: "Cable" },

  // ── Pull ──
  { id: "deadlift", name: "Deadlift", primaryMuscle: "Back", secondaryMuscles: ["Hamstrings", "Glutes", "Traps"], equipment: "Barbell" },
  { id: "lat-pulldown-wide", name: "Lat Pulldown (Wide)", primaryMuscle: "Lats", secondaryMuscles: ["Biceps"], equipment: "Cable" },
  { id: "seated-cable-row", name: "Seated Cable Row", primaryMuscle: "Mid Back", secondaryMuscles: ["Biceps", "Lats"], equipment: "Cable" },
  { id: "face-pulls", name: "Face Pulls", primaryMuscle: "Rear Delts", secondaryMuscles: ["Traps"], equipment: "Cable" },
  { id: "hammer-curls", name: "Hammer Curls", primaryMuscle: "Biceps", secondaryMuscles: ["Brachialis"], equipment: "Dumbbells" },
  { id: "db-bicep-curls", name: "DB Bicep Curls", primaryMuscle: "Biceps", secondaryMuscles: [], equipment: "Dumbbells" },

  // ── Legs ──
  { id: "back-squat", name: "Back Squat", primaryMuscle: "Quads", secondaryMuscles: ["Glutes", "Hamstrings"], equipment: "Barbell" },
  { id: "romanian-deadlift", name: "Romanian Deadlift", primaryMuscle: "Hamstrings", secondaryMuscles: ["Glutes", "Back"], equipment: "Barbell" },
  { id: "leg-press", name: "Leg Press", primaryMuscle: "Quads", secondaryMuscles: ["Glutes"], equipment: "Machine" },
  { id: "leg-extensions", name: "Leg Extensions", primaryMuscle: "Quads", secondaryMuscles: [], equipment: "Machine" },
  { id: "hanging-leg-raises", name: "Hanging Leg Raises", primaryMuscle: "Abs", secondaryMuscles: ["Hip Flexors"], equipment: "Bodyweight" },

  // ── Upper ──
  { id: "incline-db-press", name: "Incline DB Press", primaryMuscle: "Upper Chest", secondaryMuscles: ["Shoulders", "Triceps"], equipment: "Dumbbells" },
  { id: "weighted-pullups", name: "Weighted Pull-ups", primaryMuscle: "Lats", secondaryMuscles: ["Biceps", "Mid Back"], equipment: "Bodyweight" },
  { id: "chest-supported-row", name: "Chest-Supported Row", primaryMuscle: "Mid Back", secondaryMuscles: ["Biceps", "Rear Delts"], equipment: "Dumbbells" },
  { id: "skullcrushers", name: "Skullcrushers", primaryMuscle: "Triceps", secondaryMuscles: [], equipment: "Barbell" },
  { id: "overhead-cable-ext", name: "Overhead Cable Extension", primaryMuscle: "Triceps", secondaryMuscles: [], equipment: "Cable" },

  // ── Lower ──
  { id: "hack-squat", name: "Hack Squat / Leg Press", primaryMuscle: "Quads", secondaryMuscles: ["Glutes"], equipment: "Machine" },
  { id: "hamstring-curls", name: "Hamstring Curls", primaryMuscle: "Hamstrings", secondaryMuscles: [], equipment: "Machine" },
  { id: "standing-calf-raises", name: "Standing Calf Raises", primaryMuscle: "Calves", secondaryMuscles: [], equipment: "Machine" },
  { id: "seated-calf-raises", name: "Seated Calf Raises", primaryMuscle: "Calves", secondaryMuscles: [], equipment: "Machine" },
  { id: "cable-crunch", name: "Weighted Cable Crunch", primaryMuscle: "Abs", secondaryMuscles: [], equipment: "Cable" },
  { id: "planks", name: "Planks", primaryMuscle: "Core", secondaryMuscles: [], equipment: "Bodyweight" },
];
