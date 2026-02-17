"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Dumbbell,
  Target,
  Footprints,
  ArrowUpCircle,
  ArrowDownCircle,
  Heart,
} from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { useWeekProgress } from "@/lib/hooks/use-week-progress";
import { useTemplates } from "@/lib/hooks/use-templates";
import { useLastSessionsForAllTemplates } from "@/lib/hooks/use-last-session";
import { useExerciseMap } from "@/lib/hooks/use-exercises";
import { toDateISO, cn } from "@/lib/utils";
import { TRAINING_CYCLE, TEMPLATE_LABELS } from "@/lib/types";
import { CardioLogSection } from "@/components/day/cardio-log";
import { db } from "@/lib/db/schema";

const BLOCK_ICONS: Record<string, typeof Dumbbell> = {
  push: Dumbbell,
  pull: Target,
  legs: Footprints,
  upper: ArrowUpCircle,
  lower: ArrowDownCircle,
  cardio: Heart,
};

const BLOCK_COLORS: Record<
  string,
  { text: string; bg: string; glow: string; gradient: string }
> = {
  push: {
    text: "text-red-400",
    bg: "bg-red-500/20",
    glow: "ring-red-500/30 shadow-red-500/10",
    gradient: "from-red-500/10",
  },
  pull: {
    text: "text-blue-400",
    bg: "bg-blue-500/20",
    glow: "ring-blue-500/30 shadow-blue-500/10",
    gradient: "from-blue-500/10",
  },
  legs: {
    text: "text-amber-400",
    bg: "bg-amber-500/20",
    glow: "ring-amber-500/30 shadow-amber-500/10",
    gradient: "from-amber-500/10",
  },
  upper: {
    text: "text-purple-400",
    bg: "bg-purple-500/20",
    glow: "ring-purple-500/30 shadow-purple-500/10",
    gradient: "from-purple-500/10",
  },
  lower: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/20",
    glow: "ring-emerald-500/30 shadow-emerald-500/10",
    gradient: "from-emerald-500/10",
  },
  cardio: {
    text: "text-teal-400",
    bg: "bg-teal-500/20",
    glow: "ring-teal-500/30 shadow-teal-500/10",
    gradient: "from-teal-500/10",
  },
};

export default function HomePage() {
  const router = useRouter();
  const weekProgress = useWeekProgress();
  const templates = useTemplates();
  const lastSessions = useLastSessionsForAllTemplates();
  const exerciseMap = useExerciseMap();
  const cardioRef = useRef<HTMLDivElement>(null);
  const today = toDateISO(new Date());

  const templateMap = new Map(templates.map((t) => [t.id, t]));
  const doneMap = new Map(
    (weekProgress?.done ?? []).map((d) => [d.templateId, d])
  );

  const todayCardio =
    useLiveQuery(
      () => db.cardioLogs.where("dateISO").equals(today).toArray(),
      [today]
    ) ?? [];

  const completed = weekProgress?.completed ?? 0;
  const total = weekProgress?.total ?? 5;
  const allDone = completed >= total;

  const blocks = [
    ...TRAINING_CYCLE.map((id) => ({ id, type: "workout" as const })),
    { id: "cardio", type: "cardio" as const },
  ];

  return (
    <div className="max-w-lg mx-auto px-3 flex flex-col">
      {/* ── Header ── */}
      <div className="flex items-center justify-between py-3 px-1">
        <div>
          <h1 className="text-xl font-bold leading-tight">This Week</h1>
          {weekProgress && (
            <p className="text-[11px] text-[var(--muted-fg)] mt-0.5">
              {weekProgress.weekLabel}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all",
            allDone
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-[var(--accent)]/15 text-[var(--accent)]"
          )}
        >
          {completed}/{total}
          {allDone && (
            <span className="text-[10px] font-semibold ml-0.5">All Done</span>
          )}
        </div>
      </div>

      {/* ── 3x2 Grid ── */}
      <div
        className="grid grid-cols-2 gap-3 flex-1"
        style={{
          height:
            "calc(100dvh - 60px - 56px - env(safe-area-inset-bottom, 0px))",
        }}
      >
        {blocks.map(({ id, type }) => {
          const colors = BLOCK_COLORS[id] ?? BLOCK_COLORS.cardio;
          const Icon = BLOCK_ICONS[id] ?? Heart;

          if (type === "cardio") {
            const hasCardio = todayCardio.length > 0;
            const totalMin = todayCardio.reduce(
              (sum, c) => sum + c.durationMin,
              0
            );
            const cardioType = todayCardio[0]?.type?.toUpperCase() ?? "";

            return (
              <button
                key={id}
                onClick={() =>
                  cardioRef.current?.scrollIntoView({ behavior: "smooth" })
                }
                className={cn(
                  "rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-300 touch-manipulation active:scale-[0.97]",
                  "bg-gradient-to-b to-transparent shadow-lg shadow-black/20",
                  hasCardio
                    ? cn(colors.bg, "ring-2", colors.glow)
                    : cn(colors.gradient, "bg-[var(--card)]")
                )}
              >
                {hasCardio ? (
                  <>
                    <Check className={cn("w-7 h-7", colors.text)} />
                    <span className={cn("text-sm font-bold", colors.text)}>
                      Cardio
                    </span>
                    <span className="text-[10px] text-[var(--muted-fg)]">
                      {totalMin} min {cardioType}
                    </span>
                  </>
                ) : (
                  <>
                    <Icon className={cn("w-7 h-7", colors.text)} />
                    <span className="text-sm font-bold">Cardio</span>
                    <span className="text-[10px] text-[var(--muted-fg)]">
                      Add Cardio
                    </span>
                  </>
                )}
              </button>
            );
          }

          const tpl = templateMap.get(id);
          const doneInfo = doneMap.get(id);
          const isDone = !!doneInfo;
          const label = TEMPLATE_LABELS[id] ?? id;
          const exerciseCount = tpl?.items.length ?? 0;
          const lastLifts = lastSessions?.[id];
          const topLift = lastLifts?.[0];
          const topLiftName = topLift
            ? exerciseMap.get(topLift.exerciseId)?.name
            : undefined;

          return (
            <button
              key={id}
              onClick={() =>
                isDone
                  ? router.push(`/day/${doneInfo!.dateISO}`)
                  : router.push(`/day/${today}?template=${id}`)
              }
              className={cn(
                "rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 touch-manipulation active:scale-[0.97]",
                "bg-gradient-to-b to-transparent shadow-lg shadow-black/20",
                isDone
                  ? cn(
                      colors.bg,
                      "ring-2",
                      colors.glow,
                      "animate-block-pop"
                    )
                  : cn(colors.gradient, "bg-[var(--card)]")
              )}
            >
              {isDone ? (
                <>
                  <Check className={cn("w-8 h-8", colors.text)} />
                  <span className={cn("text-sm font-bold", colors.text)}>
                    Done
                  </span>
                  <span className="text-[10px] text-[var(--muted-fg)]">
                    {doneInfo!.dayLabel}
                  </span>
                </>
              ) : (
                <>
                  <Icon className={cn("w-7 h-7", colors.text)} />
                  <span className="text-base font-bold">{label}</span>
                  <span className="text-[11px] text-[var(--muted-fg)]">
                    {exerciseCount} exercises
                  </span>
                  {topLift && (
                    <span className="text-[10px] text-[var(--muted-fg)] tabular-nums mt-0.5">
                      {topLift.bestWeight} x {topLift.bestReps}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Cardio log below the fold ── */}
      <div ref={cardioRef} className="mt-6 pb-24">
        <CardioLogSection dateISO={today} />
      </div>
    </div>
  );
}
