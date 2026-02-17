import { db } from "./schema";

interface ExportData {
  version: 2;
  exportedAt: string;
  exercises: unknown[];
  templates: unknown[];
  scheduledWorkouts: unknown[];
  sessions: unknown[];
  sessionExercises: unknown[];
  sessionSets: unknown[];
  settings: unknown[];
  programConfig: unknown[];
  cardioLogs: unknown[];
}

export async function exportAllData(): Promise<string> {
  const data: ExportData = {
    version: 2,
    exportedAt: new Date().toISOString(),
    exercises: await db.exercises.toArray(),
    templates: await db.templates.toArray(),
    scheduledWorkouts: await db.scheduledWorkouts.toArray(),
    sessions: await db.sessions.toArray(),
    sessionExercises: await db.sessionExercises.toArray(),
    sessionSets: await db.sessionSets.toArray(),
    settings: await db.settings.toArray(),
    programConfig: await db.programConfig.toArray(),
    cardioLogs: await db.cardioLogs.toArray(),
  };

  return JSON.stringify(data, null, 2);
}

export async function importAllData(json: string): Promise<void> {
  const data = JSON.parse(json);

  if (data.version !== 1 && data.version !== 2) {
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
      db.programConfig,
      db.cardioLogs,
    ],
    async () => {
      await db.exercises.clear();
      await db.templates.clear();
      await db.scheduledWorkouts.clear();
      await db.sessions.clear();
      await db.sessionExercises.clear();
      await db.sessionSets.clear();
      await db.settings.clear();
      await db.programConfig.clear();
      await db.cardioLogs.clear();

      if (data.exercises?.length) await db.exercises.bulkAdd(data.exercises as never[]);
      if (data.templates?.length) await db.templates.bulkAdd(data.templates as never[]);
      if (data.scheduledWorkouts?.length) await db.scheduledWorkouts.bulkAdd(data.scheduledWorkouts as never[]);
      if (data.sessions?.length) await db.sessions.bulkAdd(data.sessions as never[]);
      if (data.sessionExercises?.length) await db.sessionExercises.bulkAdd(data.sessionExercises as never[]);
      if (data.sessionSets?.length) await db.sessionSets.bulkAdd(data.sessionSets as never[]);
      if (data.settings?.length) await db.settings.bulkAdd(data.settings as never[]);
      if (data.programConfig?.length) await db.programConfig.bulkAdd(data.programConfig as never[]);
      if (data.cardioLogs?.length) await db.cardioLogs.bulkAdd(data.cardioLogs as never[]);
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
