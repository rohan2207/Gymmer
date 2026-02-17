"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/schema";
import type { AppSettings } from "@/lib/types";

export function useSettings() {
  return useLiveQuery(() => db.settings.get("settings"));
}

export async function updateSettings(updates: Partial<AppSettings>) {
  await db.settings.update("settings", updates);
}
