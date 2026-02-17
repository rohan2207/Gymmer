// Core Types for Workout Tracker

export interface Template {
  id?: number;
  name: string;
  description?: string;
  days: TemplateDay[];
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface TemplateDay {
  dayName: string; // e.g., "Tuesday - Push"
  exercises: TemplateExercise[];
}

export interface TemplateExercise {
  id: string;
  name: string;
  sets: number;
  repsMin: number;
  repsMax: number;
  restSeconds: number;
  notes?: string;
  category?: 'compound' | 'isolation' | 'accessory';
}

export interface Workout {
  id?: number;
  templateId: number;
  templateName: string;
  dayName: string;
  date: number; // timestamp
  startedAt?: number;
  completedAt?: number;
  exercises: WorkoutExercise[];
  notes?: string;
  duration?: number; // in seconds
}

export interface WorkoutExercise {
  id: string;
  templateExerciseId: string;
  name: string;
  sets: WorkoutSet[];
  notes?: string;
  isCompleted: boolean;
}

export interface WorkoutSet {
  id: string;
  setNumber: number;
  reps: number | null;
  weight: number | null;
  completed: boolean;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  isPersonalRecord?: boolean;
}

export interface PersonalRecord {
  id?: number;
  exerciseName: string;
  weight: number;
  reps: number;
  date: number;
  workoutId: number;
  oneRepMax: number; // Calculated
}

export interface BodyWeight {
  id?: number;
  weight: number;
  date: number;
  notes?: string;
}

// UI State Types
export interface ActiveWorkoutState {
  workoutId?: number;
  currentExerciseIndex: number;
  isRestTimerActive: boolean;
  restTimeRemaining: number;
}

// Analytics Types
export interface ExerciseProgress {
  exerciseName: string;
  data: {
    date: number;
    weight: number;
    volume: number;
    oneRepMax: number;
  }[];
}

export interface WeeklyComparison {
  currentWeek: WorkoutSummary;
  previousWeek: WorkoutSummary;
  changes: {
    exerciseName: string;
    volumeChange: number;
    volumeChangePercent: number;
    weightChange: number;
    isPR: boolean;
  }[];
}

export interface WorkoutSummary {
  weekStart: number;
  totalVolume: number;
  workoutsCompleted: number;
  exercises: {
    name: string;
    totalVolume: number;
    maxWeight: number;
    totalSets: number;
  }[];
}
