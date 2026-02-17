import Dexie, { Table } from 'dexie';
import type { Template, Workout, PersonalRecord, BodyWeight } from '../types';

export class WorkoutDatabase extends Dexie {
  templates!: Table<Template, number>;
  workouts!: Table<Workout, number>;
  personalRecords!: Table<PersonalRecord, number>;
  bodyWeights!: Table<BodyWeight, number>;

  constructor() {
    super('WorkoutTrackerDB');
    
    this.version(1).stores({
      templates: '++id, name, isActive, createdAt',
      workouts: '++id, templateId, date, completedAt',
      personalRecords: '++id, exerciseName, date, oneRepMax',
      bodyWeights: '++id, date'
    });
  }
}

export const db = new WorkoutDatabase();

// Initialize with default data if needed
export async function initializeDatabase() {
  const templateCount = await db.templates.count();
  
  if (templateCount === 0) {
    console.log('Database empty, will initialize with default template');
    return true;
  }
  
  return false;
}

// Helper functions for common queries
export const dbHelpers = {
  // Get active template
  async getActiveTemplate(): Promise<Template | undefined> {
    return await db.templates.where('isActive').equals(1).first();
  },

  // Get workouts for a specific week
  async getWorkoutsForWeek(weekStart: number): Promise<Workout[]> {
    const weekEnd = weekStart + 7 * 24 * 60 * 60 * 1000;
    return await db.workouts
      .where('date')
      .between(weekStart, weekEnd)
      .toArray();
  },

  // Get workouts for a specific month
  async getWorkoutsForMonth(year: number, month: number): Promise<Workout[]> {
    const monthStart = new Date(year, month, 1).getTime();
    const monthEnd = new Date(year, month + 1, 0, 23, 59, 59).getTime();
    return await db.workouts
      .where('date')
      .between(monthStart, monthEnd)
      .toArray();
  },

  // Get exercise history
  async getExerciseHistory(exerciseName: string, limit = 20): Promise<Workout[]> {
    const allWorkouts = await db.workouts
      .where('completedAt')
      .above(0)
      .reverse()
      .limit(limit * 3) // Get more to filter
      .toArray();
    
    return allWorkouts
      .filter(w => w.exercises.some(e => e.name === exerciseName))
      .slice(0, limit);
  },

  // Get personal records for an exercise
  async getPersonalRecords(exerciseName?: string): Promise<PersonalRecord[]> {
    if (exerciseName) {
      return await db.personalRecords
        .where('exerciseName')
        .equals(exerciseName)
        .reverse()
        .toArray();
    }
    return await db.personalRecords
      .orderBy('date')
      .reverse()
      .limit(50)
      .toArray();
  },

  // Check if a set is a PR
  async isPR(exerciseName: string, weight: number, reps: number): Promise<boolean> {
    const records = await this.getPersonalRecords(exerciseName);
    const oneRepMax = calculateOneRepMax(weight, reps);
    
    if (records.length === 0) return true;
    
    const bestRecord = records.reduce((best, record) => 
      record.oneRepMax > best.oneRepMax ? record : best
    );
    
    return oneRepMax > bestRecord.oneRepMax;
  }
};

// Calculate estimated 1RM using Epley formula
export function calculateOneRepMax(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

// Calculate total volume for a workout
export function calculateWorkoutVolume(workout: Workout): number {
  return workout.exercises.reduce((total, exercise) => {
    const exerciseVolume = exercise.sets
      .filter(set => set.completed && set.weight && set.reps)
      .reduce((sum, set) => sum + (set.weight! * set.reps!), 0);
    return total + exerciseVolume;
  }, 0);
}

// Get week start (Monday)
export function getWeekStart(date: Date = new Date()): number {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff)).setHours(0, 0, 0, 0);
}
