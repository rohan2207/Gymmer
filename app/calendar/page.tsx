"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
  isFuture,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/schema";
import { TEMPLATE_COLORS, TEMPLATE_BG, TEMPLATE_LABELS } from "@/lib/types";
import { cn, toDateISO } from "@/lib/utils";

export default function HistoryPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(new Date());

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const rangeStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const rangeEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: rangeStart, end: rangeEnd });

  const startISO = toDateISO(rangeStart);
  const endISO = toDateISO(rangeEnd);

  const sessions =
    useLiveQuery(
      () =>
        db.sessions
          .where("dateISO")
          .between(startISO, endISO, true, true)
          .filter((s) => !!s.finishedAt)
          .toArray(),
      [startISO, endISO]
    ) ?? [];

  const sessionMap = new Map(sessions.map((s) => [s.dateISO, s]));

  const prev = () => setCurrent((c) => subMonths(c, 1));
  const next = () => setCurrent((c) => addMonths(c, 1));

  return (
    <div className="max-w-lg mx-auto px-4 py-5 pb-24">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-5">History</h1>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prev}
          className="p-2 rounded-xl hover:bg-[var(--muted)] transition-colors touch-manipulation"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold">
          {format(current, "MMMM yyyy")}
        </span>
        <button
          onClick={next}
          className="p-2 rounded-xl hover:bg-[var(--muted)] transition-colors touch-manipulation"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-medium text-[var(--muted-fg)] py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const iso = toDateISO(day);
          const session = sessionMap.get(iso);
          const inMonth = isSameMonth(day, current);
          const today = isToday(day);
          const future = isFuture(day);
          const templateId = session?.templateId ?? "";
          const label = TEMPLATE_LABELS[templateId] ?? "";
          const hasSession = !!session;

          return (
            <button
              key={iso}
              onClick={() => hasSession && router.push(`/day/${iso}`)}
              disabled={!hasSession}
              className={cn(
                "relative flex flex-col items-center py-2 rounded-xl transition-colors touch-manipulation",
                "min-h-[56px]",
                !inMonth && "opacity-20",
                future && !today && "opacity-40",
                today && "ring-1.5 ring-[var(--accent)] ring-offset-1 ring-offset-[var(--bg)]",
                hasSession && "hover:bg-[var(--muted)] cursor-pointer",
                !hasSession && "cursor-default"
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium",
                  today ? "text-[var(--accent)]" : "text-[var(--fg)]"
                )}
              >
                {format(day, "d")}
              </span>

              {hasSession && templateId && (
                <span
                  className={cn(
                    "mt-1 text-[7px] font-bold px-1.5 py-0.5 rounded-sm leading-none uppercase tracking-wider",
                    TEMPLATE_BG[templateId] ?? "bg-zinc-500/10",
                    TEMPLATE_COLORS[templateId] ?? "text-zinc-500"
                  )}
                >
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
