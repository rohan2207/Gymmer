"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { startOfWeek, endOfWeek, format, parseISO } from "date-fns";
import { db } from "@/lib/db/schema";
import { toDateISO } from "@/lib/utils";
import { TRAINING_CYCLE } from "@/lib/types";

export interface WeekDone {
  templateId: string;
  dateISO: string;
  dayLabel: string;
}

export interface WeekProgress {
  done: WeekDone[];
  pending: string[];
  weekLabel: string;
  total: number;
  completed: number;
}

export function useWeekProgress(): WeekProgress | undefined {
  return useLiveQuery(async () => {
    const now = new Date();
    const monday = startOfWeek(now, { weekStartsOn: 1 });
    const sunday = endOfWeek(now, { weekStartsOn: 1 });
    const monISO = toDateISO(monday);
    const sunISO = toDateISO(sunday);

    const sessions = await db.sessions
      .where("dateISO")
      .between(monISO, sunISO, true, true)
      .filter((s) => !!s.finishedAt && !!s.templateId)
      .toArray();

    const doneTemplateIds = new Set<string>();
    const done: WeekDone[] = [];

    for (const s of sessions) {
      if (s.templateId && TRAINING_CYCLE.includes(s.templateId as typeof TRAINING_CYCLE[number])) {
        if (!doneTemplateIds.has(s.templateId)) {
          doneTemplateIds.add(s.templateId);
          done.push({
            templateId: s.templateId,
            dateISO: s.dateISO,
            dayLabel: format(parseISO(s.dateISO), "EEE"),
          });
        }
      }
    }

    const pending = TRAINING_CYCLE.filter((t) => !doneTemplateIds.has(t));

    const weekLabel = `${format(monday, "MMM d")} - ${format(sunday, "MMM d")}`;

    return {
      done,
      pending: [...pending],
      weekLabel,
      total: TRAINING_CYCLE.length,
      completed: done.length,
    };
  });
}
