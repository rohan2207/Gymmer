import Dexie, { type Table } from "dexie";
import type {
  Exercise,
  Template,
  ScheduledWorkout,
  Session,
  SessionExercise,
  SessionSet,
  AppSettings,
} from "../types";

export class MuscleCalendarDB extends Dexie {
  exercises!: Table<Exercise, string>;
  templates!: Table<Template, string>;
  scheduledWorkouts!: Table<ScheduledWorkout, number>;
  sessions!: Table<Session, number>;
  sessionExercises!: Table<SessionExercise, number>;
  sessionSets!: Table<SessionSet, number>;
  settings!: Table<AppSettings, string>;

  constructor() {
    super("MuscleCalendarDB");

    this.version(1).stores({
      exercises: "id, primaryMuscle",
      templates: "id",
      scheduledWorkouts: "++id, dateISO, templateId, status",
      sessions: "++id, dateISO",
      sessionExercises: "++id, sessionId, exerciseId",
      sessionSets: "++id, sessionExerciseId",
      settings: "id",
    });
  }
}

export const db = new MuscleCalendarDB();
