import { db } from "./schema";

interface ExportData {
  version: 1;
  exportedAt: string;
  exercises: unknown[];
  templates: unknown[];
  scheduledWorkouts: unknown[];
  sessions: unknown[];
  sessionExercises: unknown[];
  sessionSets: unknown[];
  settings: unknown[];
}

export async function exportAllData(): Promise<string> {
  const data: ExportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    exercises: await db.exercises.toArray(),
    templates: await db.templates.toArray(),
    scheduledWorkouts: await db.scheduledWorkouts.toArray(),
    sessions: await db.sessions.toArray(),
    sessionExercises: await db.sessionExercises.toArray(),
    sessionSets: await db.sessionSets.toArray(),
    settings: await db.settings.toArray(),
  };

  return JSON.stringify(data, null, 2);
}

export async function importAllData(json: string): Promise<void> {
  const data: ExportData = JSON.parse(json);

  if (data.version !== 1) {
    throw new Error("Unsupported data version");
  }

  await db.transaction(
    "rw",
    [
      db.exercises,
      db.templates,
      db.scheduledWorkouts,
      db.sessions,
      db.sessionExercises,
      db.sessionSets,
      db.settings,
    ],
    async () => {
      await db.exercises.clear();
      await db.templates.clear();
      await db.scheduledWorkouts.clear();
      await db.sessions.clear();
      await db.sessionExercises.clear();
      await db.sessionSets.clear();
      await db.settings.clear();

      if (data.exercises.length) await db.exercises.bulkAdd(data.exercises as never[]);
      if (data.templates.length) await db.templates.bulkAdd(data.templates as never[]);
      if (data.scheduledWorkouts.length) await db.scheduledWorkouts.bulkAdd(data.scheduledWorkouts as never[]);
      if (data.sessions.length) await db.sessions.bulkAdd(data.sessions as never[]);
      if (data.sessionExercises.length) await db.sessionExercises.bulkAdd(data.sessionExercises as never[]);
      if (data.sessionSets.length) await db.sessionSets.bulkAdd(data.sessionSets as never[]);
      if (data.settings.length) await db.settings.bulkAdd(data.settings as never[]);
    }
  );
}

export function downloadJSON(json: string, filename: string) {
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
