"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/schema";
import type { Template } from "@/lib/types";

export function useTemplates() {
  return useLiveQuery(() => db.templates.toArray()) ?? [];
}

export function useTemplate(id: string | undefined) {
  return useLiveQuery(() => (id ? db.templates.get(id) : undefined), [id]);
}

export async function updateTemplate(id: string, updates: Partial<Template>) {
  await db.templates.update(id, updates);
}

export async function duplicateTemplateAsOverride(
  sourceId: string,
  newId: string
): Promise<Template> {
  const source = await db.templates.get(sourceId);
  if (!source) throw new Error("Template not found");

  const copy: Template = {
    ...source,
    id: newId,
    name: `${source.name} (Override)`,
  };

  await db.templates.add(copy);
  return copy;
}
