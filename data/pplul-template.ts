import type { Template } from '@/lib/types';

export const PPLUL_TEMPLATE: Omit<Template, 'id'> = {
  name: '5-Day PPLUL (Back Thickness + Triceps + Upper Chest Focus)',
  description: 'Optimized Push/Pull/Legs/Upper/Lower split focusing on back thickness, tricep volume, and upper chest priority',
  isActive: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  days: [
    {
      dayName: 'Tuesday - Push (Upper Chest & Triceps Priority)',
      exercises: [
        {
          id: 'incline-barbell-bench',
          name: 'Incline Barbell Bench Press (30°)',
          sets: 4,
          repsMin: 5,
          repsMax: 8,
          restSeconds: 180,
          notes: 'Lower incline = more upper chest, less shoulder. Focus on controlled eccentric.',
          category: 'compound'
        },
        {
          id: 'flat-db-press',
          name: 'Flat Dumbbell Press',
          sets: 3,
          repsMin: 8,
          repsMax: 10,
          restSeconds: 150,
          notes: 'Controlled eccentric, full range of motion',
          category: 'compound'
        },
        {
          id: 'seated-db-shoulder-press',
          name: 'Seated Dumbbell Shoulder Press',
          sets: 3,
          repsMin: 8,
          repsMax: 10,
          restSeconds: 120,
          notes: 'Stable positioning, avoid excessive arching',
          category: 'compound'
        },
        {
          id: 'cable-lateral-raise',
          name: 'Cable Lateral Raise',
          sets: 4,
          repsMin: 12,
          repsMax: 15,
          restSeconds: 90,
          notes: 'Better tension curve than dumbbells',
          category: 'isolation'
        },
        {
          id: 'close-grip-bench',
          name: 'Close Grip Bench Press',
          sets: 3,
          repsMin: 6,
          repsMax: 8,
          restSeconds: 150,
          notes: 'Heavy tricep overload, hands shoulder-width apart',
          category: 'compound'
        },
        {
          id: 'overhead-cable-extension',
          name: 'Overhead Cable Extension',
          sets: 3,
          repsMin: 12,
          repsMax: 15,
          restSeconds: 90,
          notes: 'Long head focus, full stretch at bottom',
          category: 'isolation'
        },
        {
          id: 'rope-pushdowns',
          name: 'Rope Pushdowns',
          sets: 2,
          repsMin: 15,
          repsMax: 20,
          restSeconds: 60,
          notes: 'Pump finisher, focus on contraction',
          category: 'isolation'
        }
      ]
    },
    {
      dayName: 'Wednesday - Pull (Back Thickness Priority)',
      exercises: [
        {
          id: 'barbell-row',
          name: 'Barbell Row',
          sets: 4,
          repsMin: 6,
          repsMax: 8,
          restSeconds: 180,
          notes: 'Thickness first. Can substitute with chest-supported row if fatigued.',
          category: 'compound'
        },
        {
          id: 'deadlift',
          name: 'Deadlift',
          sets: 3,
          repsMin: 3,
          repsMax: 5,
          restSeconds: 240,
          notes: 'Heavy but lower volume. Strength stimulus only to avoid systemic fatigue.',
          category: 'compound'
        },
        {
          id: 'lat-pulldown-neutral',
          name: 'Lat Pulldown (Neutral Grip)',
          sets: 3,
          repsMin: 10,
          repsMax: 12,
          restSeconds: 120,
          notes: 'Width focus, full stretch at top',
          category: 'compound'
        },
        {
          id: 'seated-cable-row',
          name: 'Seated Cable Row (Close Grip)',
          sets: 3,
          repsMin: 10,
          repsMax: 12,
          restSeconds: 120,
          notes: 'Mid-back thickness, squeeze at contraction',
          category: 'compound'
        },
        {
          id: 'face-pull',
          name: 'Face Pull',
          sets: 3,
          repsMin: 15,
          repsMax: 20,
          restSeconds: 90,
          notes: 'Rear delt health, pull to upper chest',
          category: 'isolation'
        },
        {
          id: 'hammer-curls',
          name: 'Hammer Curls',
          sets: 3,
          repsMin: 10,
          repsMax: 12,
          restSeconds: 90,
          notes: 'Brachialis development',
          category: 'isolation'
        },
        {
          id: 'incline-db-curls',
          name: 'Incline Dumbbell Curls',
          sets: 2,
          repsMin: 12,
          repsMax: 15,
          restSeconds: 90,
          notes: 'Stretch stimulus for biceps',
          category: 'isolation'
        }
      ]
    },
    {
      dayName: 'Thursday - Legs (Strength Emphasis)',
      exercises: [
        {
          id: 'back-squat',
          name: 'Back Squat',
          sets: 4,
          repsMin: 5,
          repsMax: 8,
          restSeconds: 240,
          notes: 'Primary strength lift, controlled descent',
          category: 'compound'
        },
        {
          id: 'romanian-deadlift',
          name: 'Romanian Deadlift',
          sets: 3,
          repsMin: 8,
          repsMax: 10,
          restSeconds: 180,
          notes: 'Posterior chain, feel the stretch in hamstrings',
          category: 'compound'
        },
        {
          id: 'leg-press',
          name: 'Leg Press',
          sets: 3,
          repsMin: 10,
          repsMax: 12,
          restSeconds: 150,
          notes: 'Controlled tempo, full range of motion',
          category: 'compound'
        },
        {
          id: 'walking-lunges',
          name: 'Walking Lunges',
          sets: 2,
          repsMin: 12,
          repsMax: 12,
          restSeconds: 120,
          notes: 'Stability and glute activation, 12 reps per leg',
          category: 'compound'
        },
        {
          id: 'hanging-leg-raises',
          name: 'Hanging Leg Raises',
          sets: 3,
          repsMin: 8,
          repsMax: 15,
          restSeconds: 90,
          notes: 'Core strength, controlled movement',
          category: 'isolation'
        }
      ]
    },
    {
      dayName: 'Friday - Upper (Back + Tricep Specialization)',
      exercises: [
        {
          id: 'incline-db-press-upper',
          name: 'Incline Dumbbell Press',
          sets: 3,
          repsMin: 8,
          repsMax: 10,
          restSeconds: 150,
          notes: 'Upper chest second hit of the week',
          category: 'compound'
        },
        {
          id: 'weighted-pullups',
          name: 'Weighted Pull-ups',
          sets: 3,
          repsMin: 6,
          repsMax: 8,
          restSeconds: 180,
          notes: 'Width strength, add weight when needed',
          category: 'compound'
        },
        {
          id: 'chest-supported-row',
          name: 'Chest Supported Row',
          sets: 4,
          repsMin: 8,
          repsMax: 10,
          restSeconds: 120,
          notes: 'Thickness focus, minimize lower back fatigue',
          category: 'compound'
        },
        {
          id: 'single-arm-cable-row',
          name: 'Single Arm Cable Row',
          sets: 2,
          repsMin: 12,
          repsMax: 15,
          restSeconds: 90,
          notes: 'Mind-muscle connection, 2 sets per arm',
          category: 'isolation'
        },
        {
          id: 'skullcrushers',
          name: 'Skullcrushers',
          sets: 3,
          repsMin: 8,
          repsMax: 10,
          restSeconds: 120,
          notes: 'Heavy tricep work, controlled eccentric',
          category: 'isolation'
        },
        {
          id: 'overhead-cable-extension-upper',
          name: 'Overhead Cable Extension',
          sets: 3,
          repsMin: 12,
          repsMax: 15,
          restSeconds: 90,
          notes: 'Long head focus again, deep stretch',
          category: 'isolation'
        },
        {
          id: 'cable-lateral-raises-upper',
          name: 'Cable Lateral Raises',
          sets: 3,
          repsMin: 15,
          repsMax: 20,
          restSeconds: 60,
          notes: 'Side delt volume',
          category: 'isolation'
        }
      ]
    },
    {
      dayName: 'Saturday - Lower (Hypertrophy + Conditioning)',
      exercises: [
        {
          id: 'hack-squat',
          name: 'Hack Squat',
          sets: 3,
          repsMin: 10,
          repsMax: 15,
          restSeconds: 120,
          notes: 'Hypertrophy focus, quad emphasis',
          category: 'compound'
        },
        {
          id: 'hamstring-curl',
          name: 'Hamstring Curl',
          sets: 3,
          repsMin: 12,
          repsMax: 15,
          restSeconds: 90,
          notes: 'Controlled tempo, squeeze at top',
          category: 'isolation'
        },
        {
          id: 'bulgarian-split-squat',
          name: 'Bulgarian Split Squat',
          sets: 2,
          repsMin: 10,
          repsMax: 12,
          restSeconds: 120,
          notes: 'Unilateral work, 2 sets per leg',
          category: 'compound'
        },
        {
          id: 'standing-calf-raise',
          name: 'Standing Calf Raise',
          sets: 4,
          repsMin: 12,
          repsMax: 15,
          restSeconds: 90,
          notes: 'Full range of motion, pause at top',
          category: 'isolation'
        },
        {
          id: 'seated-calf-raise',
          name: 'Seated Calf Raise',
          sets: 3,
          repsMin: 15,
          repsMax: 20,
          restSeconds: 60,
          notes: 'Soleus focus',
          category: 'isolation'
        },
        {
          id: 'cable-crunch',
          name: 'Cable Crunch',
          sets: 3,
          repsMin: 12,
          repsMax: 15,
          restSeconds: 60,
          notes: 'Weighted ab work',
          category: 'isolation'
        },
        {
          id: 'planks',
          name: 'Planks',
          sets: 3,
          repsMin: 45,
          repsMax: 60,
          restSeconds: 60,
          notes: 'Reps = seconds held. Core stability.',
          category: 'isolation'
        }
      ]
    }
  ]
};
