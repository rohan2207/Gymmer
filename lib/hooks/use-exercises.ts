"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/schema";

export function useExercises() {
  return useLiveQuery(() => db.exercises.toArray()) ?? [];
}

export function useExercise(id: string | undefined) {
  return useLiveQuery(() => (id ? db.exercises.get(id) : undefined), [id]);
}

export function useExerciseMap() {
  const exercises = useExercises();
  const map = new Map(exercises.map((e) => [e.id, e]));
  return map;
}
