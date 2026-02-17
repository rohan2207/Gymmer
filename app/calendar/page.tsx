"use client";

import { useState, useEffect } from "react";
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
  addWeeks,
  subWeeks,
} from "date-fns";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useScheduledWorkouts } from "@/lib/hooks/use-scheduled-workouts";
import { ensureScheduleCovers } from "@/lib/db/schedule";
import { TEMPLATE_COLORS, TEMPLATE_BG, TEMPLATE_LABELS } from "@/lib/types";
import { cn, toDateISO } from "@/lib/utils";

type View = "month" | "week";

export default function CalendarPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(new Date());
  const [view, setView] = useState<View>("month");

  const rangeStart =
    view === "month"
      ? startOfWeek(startOfMonth(current), { weekStartsOn: 1 })
      : startOfWeek(current, { weekStartsOn: 1 });

  const rangeEnd =
    view === "month"
      ? endOfWeek(endOfMonth(current), { weekStartsOn: 1 })
      : endOfWeek(current, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: rangeStart, end: rangeEnd });

  const startISO = toDateISO(rangeStart);
  const endISO = toDateISO(rangeEnd);
  const scheduled = useScheduledWorkouts(startISO, endISO);

  const workoutMap = new Map(scheduled.map((w) => [w.dateISO, w]));

  useEffect(() => {
    ensureScheduleCovers(rangeEnd);
  }, [rangeEnd]);

  const prev = () =>
    setCurrent((c) =>
      view === "month" ? subMonths(c, 1) : subWeeks(c, 1)
    );
  const next = () =>
    setCurrent((c) =>
      view === "month" ? addMonths(c, 1) : addWeeks(c, 1)
    );

  return (
    <div className="max-w-lg mx-auto px-4 py-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold">Muscle Calendar</h1>
        <div className="flex bg-[var(--card)] rounded-lg p-0.5 border border-[var(--border)]">
          {(["month", "week"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-colors capitalize",
                view === v
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--muted-fg)]"
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prev}
          className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors touch-manipulation"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold">
          {view === "month"
            ? format(current, "MMMM yyyy")
            : `Week of ${format(rangeStart, "MMM d")} - ${format(rangeEnd, "MMM d")}`}
        </span>
        <button
          onClick={next}
          className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors touch-manipulation"
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
          const sw = workoutMap.get(iso);
          const inMonth = isSameMonth(day, current);
          const today = isToday(day);
          const isDone = sw?.status === "done";
          const templateId = sw?.templateId ?? "";
          const label = TEMPLATE_LABELS[templateId] ?? "";

          return (
            <button
              key={iso}
              onClick={() => router.push(`/day/${iso}`)}
              className={cn(
                "relative flex flex-col items-center py-1.5 rounded-lg transition-colors touch-manipulation",
                "min-h-[60px]",
                !inMonth && view === "month" && "opacity-25",
                today &&
                  "ring-1.5 ring-[var(--accent)] ring-offset-1 ring-offset-[var(--bg)]",
                !sw && "hover:bg-[var(--muted)]"
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

              {sw && (
                <div className="mt-1 flex flex-col items-center gap-0.5">
                  <span
                    className={cn(
                      "text-[8px] font-semibold px-1.5 py-0.5 rounded-sm leading-none",
                      TEMPLATE_BG[templateId] ?? "bg-zinc-500/10",
                      TEMPLATE_COLORS[templateId] ?? "text-zinc-500"
                    )}
                  >
                    {label}
                  </span>
                  {isDone && (
                    <Check className="w-3 h-3 text-emerald-400" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-5 justify-center">
        {Object.entries(TEMPLATE_LABELS).map(([id, label]) => (
          <div key={id} className="flex items-center gap-1.5">
            <span
              className={cn(
                "text-[9px] font-semibold px-1.5 py-0.5 rounded-sm",
                TEMPLATE_BG[id],
                TEMPLATE_COLORS[id]
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
