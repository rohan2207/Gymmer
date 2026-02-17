import type { Workout, WorkoutExercise, WorkoutSet } from '../types';

// Calculate volume for a single set
export function calculateSetVolume(set: WorkoutSet): number {
  if (!set.completed || !set.weight || !set.reps) return 0;
  return set.weight * set.reps;
}

// Calculate volume for an exercise
export function calculateExerciseVolume(exercise: WorkoutExercise): number {
  return exercise.sets.reduce((total, set) => total + calculateSetVolume(set), 0);
}

// Calculate volume for entire workout
export function calculateWorkoutVolume(workout: Workout): number {
  return workout.exercises.reduce((total, exercise) => 
    total + calculateExerciseVolume(exercise), 0
  );
}

// Calculate estimated 1RM using Epley formula
export function calculateOneRepMax(weight: number, reps: number): number {
  if (reps === 1) return weight;
  if (reps === 0) return 0;
  return Math.round(weight * (1 + reps / 30));
}

// Check if all sets in an exercise hit the top rep range (progression ready)
export function isProgressionReady(
  exercise: WorkoutExercise,
  targetReps: number
): boolean {
  const completedSets = exercise.sets.filter(s => s.completed && s.reps);
  if (completedSets.length === 0) return false;
  
  return completedSets.every(set => set.reps! >= targetReps);
}

// Calculate workout completion percentage
export function calculateWorkoutCompletion(workout: Workout): number {
  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  if (totalSets === 0) return 0;
  
  const completedSets = workout.exercises.reduce(
    (sum, ex) => sum + ex.sets.filter(s => s.completed).length,
    0
  );
  
  return Math.round((completedSets / totalSets) * 100);
}

// Get best set (highest weight or volume)
export function getBestSet(sets: WorkoutSet[]): WorkoutSet | null {
  const completedSets = sets.filter(s => s.completed && s.weight && s.reps);
  if (completedSets.length === 0) return null;
  
  return completedSets.reduce((best, current) => {
    const bestVolume = calculateSetVolume(best);
    const currentVolume = calculateSetVolume(current);
    return currentVolume > bestVolume ? current : best;
  });
}

// Format weight with appropriate decimal places
export function formatWeight(weight: number): string {
  return weight % 1 === 0 ? weight.toString() : weight.toFixed(1);
}

// Format duration in seconds to MM:SS
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Calculate weekly volume by exercise
export function calculateWeeklyVolume(workouts: Workout[]): Map<string, number> {
  const volumeMap = new Map<string, number>();
  
  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      const current = volumeMap.get(exercise.name) || 0;
      volumeMap.set(exercise.name, current + calculateExerciseVolume(exercise));
    });
  });
  
  return volumeMap;
}

// Compare two weeks and calculate changes
export function compareWeeks(
  currentWeek: Workout[],
  previousWeek: Workout[]
): {
  exerciseName: string;
  currentVolume: number;
  previousVolume: number;
  volumeChange: number;
  volumeChangePercent: number;
}[] {
  const currentVolumes = calculateWeeklyVolume(currentWeek);
  const previousVolumes = calculateWeeklyVolume(previousWeek);
  
  const comparisons: {
    exerciseName: string;
    currentVolume: number;
    previousVolume: number;
    volumeChange: number;
    volumeChangePercent: number;
  }[] = [];
  
  currentVolumes.forEach((currentVolume, exerciseName) => {
    const previousVolume = previousVolumes.get(exerciseName) || 0;
    const volumeChange = currentVolume - previousVolume;
    const volumeChangePercent = previousVolume > 0 
      ? ((volumeChange / previousVolume) * 100) 
      : 100;
    
    comparisons.push({
      exerciseName,
      currentVolume,
      previousVolume,
      volumeChange,
      volumeChangePercent
    });
  });
  
  return comparisons.sort((a, b) => b.currentVolume - a.currentVolume);
}
