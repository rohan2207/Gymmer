"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";
import { useWeekProgress } from "@/lib/hooks/use-week-progress";
import { useTemplates } from "@/lib/hooks/use-templates";
import { toDateISO, cn } from "@/lib/utils";
import {
  TRAINING_CYCLE,
  TEMPLATE_LABELS,
  TEMPLATE_COLORS,
} from "@/lib/types";
import { CardioLogSection } from "@/components/day/cardio-log";

const ACCENT_BORDERS: Record<string, string> = {
  push: "border-l-red-400",
  pull: "border-l-blue-400",
  legs: "border-l-amber-400",
  upper: "border-l-purple-400",
  lower: "border-l-emerald-400",
};

function ProgressRing({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const radius = 38;
  const stroke = 6;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? completed / total : 0;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold">{completed}</span>
        <span className="text-[10px] text-[var(--muted-fg)] font-medium">
          of {total}
        </span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const weekProgress = useWeekProgress();
  const templates = useTemplates();
  const scrollRef = useRef<HTMLDivElement>(null);
  const today = toDateISO(new Date());

  const templateMap = new Map(templates.map((t) => [t.id, t]));

  const doneMap = new Map(
    (weekProgress?.done ?? []).map((d) => [d.templateId, d])
  );

  return (
    <div className="max-w-lg mx-auto px-4 pt-5 pb-24">
      {/* Header section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">This Week</h1>
          {weekProgress && (
            <p className="text-sm text-[var(--muted-fg)] mt-0.5">
              {weekProgress.weekLabel}
            </p>
          )}
        </div>
        <ProgressRing
          completed={weekProgress?.completed ?? 0}
          total={weekProgress?.total ?? 5}
        />
      </div>

      {/* Swipeable workout cards */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-none"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {TRAINING_CYCLE.map((templateId) => {
          const tpl = templateMap.get(templateId);
          const doneInfo = doneMap.get(templateId);
          const isDone = !!doneInfo;
          const label = TEMPLATE_LABELS[templateId] ?? templateId;
          const exerciseCount = tpl?.items.length ?? 0;

          return (
            <div
              key={templateId}
              className={cn(
                "flex-shrink-0 snap-center rounded-2xl border-l-4 p-5 flex flex-col justify-between",
                "w-[78vw] max-w-[320px] min-h-[180px]",
                "bg-[var(--card)] transition-all",
                ACCENT_BORDERS[templateId] ?? "border-l-zinc-500",
                isDone && "opacity-60"
              )}
            >
              <div>
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-bold">{label}</h2>
                  {isDone && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        Done
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-[var(--muted-fg)] mt-1">
                  {exerciseCount} exercises
                </p>
                {isDone && doneInfo && (
                  <p className="text-xs text-[var(--muted-fg)] mt-0.5">
                    {doneInfo.dayLabel}
                  </p>
                )}
              </div>

              {isDone ? (
                <button
                  onClick={() =>
                    router.push(`/day/${doneInfo!.dateISO}`)
                  }
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 mt-4 rounded-xl bg-[var(--muted)] text-sm font-medium text-[var(--muted-fg)] touch-manipulation active:scale-[0.98] transition-transform"
                >
                  View Session
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() =>
                    router.push(`/day/${today}?template=${templateId}`)
                  }
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 mt-4 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold touch-manipulation active:scale-[0.98] transition-transform"
                >
                  Start
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-2 mb-6">
        {TRAINING_CYCLE.map((id) => (
          <div
            key={id}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors",
              doneMap.has(id) ? "bg-emerald-400" : "bg-[var(--border)]"
            )}
          />
        ))}
      </div>

      {/* Cardio log for today */}
      <CardioLogSection dateISO={today} />
    </div>
  );
}
