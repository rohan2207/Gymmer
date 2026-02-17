"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ChevronLeft,
  Check,
  Plus,
  Minus,
  Flame,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { useScheduledWorkoutForDate } from "@/lib/hooks/use-scheduled-workouts";
import { useTemplate } from "@/lib/hooks/use-templates";
import { useExerciseMap } from "@/lib/hooks/use-exercises";
import { useSettings } from "@/lib/hooks/use-settings";
import {
  useSessionForDate,
  useSessionExercises,
  useAllSessionSetsForSession,
  startSession,
  finishSession,
  updateSet,
  addSetToExercise,
  removeLastSet,
} from "@/lib/hooks/use-sessions";
import { fromDateISO, cn } from "@/lib/utils";
import { TEMPLATE_LABELS, TEMPLATE_COLORS, TEMPLATE_BG } from "@/lib/types";
import type { SessionSet } from "@/lib/types";
import { WeightKeypad } from "@/components/day/weight-keypad";
import { CardioLogSection } from "@/components/day/cardio-log";
import { db } from "@/lib/db/schema";

export default function DayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = use(params);
  const router = useRouter();
  const dayDate = fromDateISO(date);
  const dayLabel = format(dayDate, "EEE, MMM d");

  const sw = useScheduledWorkoutForDate(date);
  const effectiveTemplateId = sw?.overrideTemplateId ?? sw?.templateId;
  const template = useTemplate(
    effectiveTemplateId !== "rest" && effectiveTemplateId !== "activeRest"
      ? effectiveTemplateId
      : effectiveTemplateId === "activeRest"
        ? "activeRest"
        : undefined
  );
  const exerciseMap = useExerciseMap();
  const settings = useSettings();

  const session = useSessionForDate(date);
  const sessionExercises = useSessionExercises(session?.id);
  const allSets = useAllSessionSetsForSession(session?.id);

  const [keypadOpen, setKeypadOpen] = useState(false);
  const [keypadSetId, setKeypadSetId] = useState<number | null>(null);
  const [keypadLastWeight, setKeypadLastWeight] = useState<number | undefined>();
  const [keypadInitialValue, setKeypadInitialValue] = useState<
    number | undefined
  >();
  const [autoStarted, setAutoStarted] = useState(false);

  const setsMap = new Map<number, SessionSet[]>();
  for (const s of allSets) {
    const arr = setsMap.get(s.sessionExerciseId) ?? [];
    arr.push(s);
    setsMap.set(s.sessionExerciseId, arr);
  }

  // Auto-start session when arriving on a planned day
  useEffect(() => {
    if (
      sw &&
      !session &&
      template &&
      !autoStarted &&
      sw.status === "planned" &&
      sw.templateId !== "rest"
    ) {
      setAutoStarted(true);
      startSession(
        date,
        template,
        settings?.autoFillLastWeights ?? true
      );
    }
  }, [sw, session, template, autoStarted, date, settings]);

  const handleFinish = async () => {
    if (!session) return;
    await finishSession(session.id!, date);
  };

  const handleSetChange = (
    setId: number,
    field: keyof SessionSet,
    value: unknown
  ) => {
    updateSet(setId, { [field]: value });
  };

  const openWeightKeypad = (set: SessionSet) => {
    setKeypadSetId(set.id!);
    setKeypadInitialValue(set.weight);
    setKeypadLastWeight(undefined);
    setKeypadOpen(true);
  };

  const handleKeypadConfirm = (value: number | undefined) => {
    if (keypadSetId != null) {
      updateSet(keypadSetId, { weight: value });
    }
    setKeypadOpen(false);
    setKeypadSetId(null);
  };

  const handleCopyLast = async (exerciseId: string, sessionExerciseId: number) => {
    const prevSessions = await db.sessions
      .where("dateISO")
      .below(date)
      .reverse()
      .filter((s) => !!s.finishedAt)
      .toArray();

    for (const prevSession of prevSessions) {
      const prevExercises = await db.sessionExercises
        .where("sessionId")
        .equals(prevSession.id!)
        .filter((e) => e.exerciseId === exerciseId)
        .toArray();

      if (prevExercises.length > 0) {
        const prevSets = await db.sessionSets
          .where("sessionExerciseId")
          .equals(prevExercises[0].id!)
          .sortBy("setNumber");

        const currentSets = await db.sessionSets
          .where("sessionExerciseId")
          .equals(sessionExerciseId)
          .sortBy("setNumber");

        for (let i = 0; i < currentSets.length && i < prevSets.length; i++) {
          if (prevSets[i].weight) {
            await updateSet(currentSets[i].id!, {
              weight: prevSets[i].weight,
            });
          }
        }
        break;
      }
    }
  };

  const isFinished = !!session?.finishedAt;
  const isRest = sw?.templateId === "rest";
  const isActiveRest = sw?.templateId === "activeRest";
  const typeLabel = sw?.templateId
    ? TEMPLATE_LABELS[sw.templateId] ?? sw.templateId
    : "";

  return (
    <div className="max-w-lg mx-auto px-4 pt-3 pb-24">
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-[var(--bg)] pb-3 -mx-4 px-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/calendar")}
              className="p-1.5 -ml-1 rounded-lg hover:bg-[var(--muted)] transition-colors touch-manipulation"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold">{dayLabel}</h1>
              {sw && (
                <span
                  className={cn(
                    "text-xs font-medium",
                    TEMPLATE_COLORS[sw.templateId] ?? "text-[var(--muted-fg)]"
                  )}
                >
                  {typeLabel}
                </span>
              )}
            </div>
          </div>

          {session && !isFinished && (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold touch-manipulation"
            >
              <Check className="w-3.5 h-3.5" />
              Finish
            </button>
          )}
        </div>

        {isFinished && (
          <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">
              Workout Complete
            </span>
          </div>
        )}
      </div>

      {/* Rest day */}
      {isRest && !isActiveRest && (
        <div className="text-center py-20">
          <p className="text-[var(--muted-fg)] text-sm">
            Rest day -- recover and grow
          </p>
        </div>
      )}

      {/* Active rest */}
      {isActiveRest && template && (
        <div className="space-y-3">
          {template.items.map((item) => {
            const ex = exerciseMap.get(item.exerciseId);
            return (
              <div
                key={item.exerciseId}
                className="flex items-center gap-3 p-3 rounded-lg bg-[var(--card)] border border-[var(--border)]"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{ex?.name ?? item.exerciseId}</p>
                  {item.notes && (
                    <p className="text-xs text-[var(--muted-fg)]">{item.notes}</p>
                  )}
                </div>
                {isFinished ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <div className="w-5 h-5 rounded border border-[var(--border)]" />
                )}
              </div>
            );
          })}
          {!isFinished && (
            <button
              onClick={async () => {
                if (!template) return;
                if (!session) {
                  const sid = await startSession(date, template, false);
                  await finishSession(sid, date);
                } else {
                  await handleFinish();
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[var(--accent)] text-white font-semibold text-sm touch-manipulation"
            >
              <Check className="w-4 h-4" />
              Mark Complete
            </button>
          )}
        </div>
      )}

      {/* Training day exercises */}
      {session && !isActiveRest && !isRest && (
        <div className="space-y-4">
          {sessionExercises.map((se) => {
            const ex = exerciseMap.get(se.exerciseId);
            const sets = (setsMap.get(se.id!) ?? []).sort(
              (a, b) => a.setNumber - b.setNumber
            );

            return (
              <div
                key={se.id}
                className="rounded-lg bg-[var(--card)] border border-[var(--border)] overflow-hidden"
              >
                {/* Exercise header */}
                <div className="flex items-center justify-between px-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {ex?.name ?? se.exerciseId}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)]">
                      {se.targetRepsMin === se.targetRepsMax
                        ? se.targetRepsMin
                        : `${se.targetRepsMin}-${se.targetRepsMax}`}
                    </span>
                  </div>
                </div>

                {/* Column headers */}
                <div className="grid grid-cols-[28px_1fr_60px_32px_32px] gap-1 px-3 py-1 text-[9px] font-medium text-[var(--muted-fg)] uppercase tracking-wide">
                  <span className="text-center">#</span>
                  <span>Weight</span>
                  <span className="text-center">Reps</span>
                  <span className="text-center">
                    <Flame className="w-3 h-3 mx-auto" />
                  </span>
                  <span className="text-center text-[8px]">WU</span>
                </div>

                {/* Set rows */}
                {sets.map((set, idx) => (
                  <div
                    key={set.id}
                    className={cn(
                      "grid grid-cols-[28px_1fr_60px_32px_32px] gap-1 px-3 py-1 items-center",
                      idx % 2 === 0 ? "bg-transparent" : "bg-[var(--muted)]/50",
                      set.isWarmup && "opacity-50"
                    )}
                  >
                    <span className="text-xs text-[var(--muted-fg)] text-center font-mono">
                      {set.setNumber}
                    </span>

                    {/* Weight - tap to open keypad */}
                    <button
                      onClick={() => !isFinished && openWeightKeypad(set)}
                      disabled={isFinished}
                      className={cn(
                        "h-8 rounded-md px-2 text-sm text-left transition-colors",
                        set.weight
                          ? "bg-[var(--muted)] text-[var(--fg)]"
                          : "bg-[var(--muted)] text-[var(--muted-fg)]",
                        !isFinished && "active:ring-1 active:ring-[var(--accent)]"
                      )}
                    >
                      {set.weight ?? (settings?.weightUnit === "kg" ? "kg" : "lb")}
                    </button>

                    {/* Reps */}
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder={
                        set.targetRepsMin === set.targetRepsMax
                          ? `${set.targetRepsMin}`
                          : `${set.targetRepsMin}-${set.targetRepsMax}`
                      }
                      value={set.reps ?? ""}
                      onChange={(e) =>
                        handleSetChange(
                          set.id!,
                          "reps",
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                      disabled={isFinished}
                      className="h-8 rounded-md bg-[var(--muted)] text-center text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-50 border-0"
                    />

                    {/* Failure toggle */}
                    <button
                      onClick={() =>
                        handleSetChange(set.id!, "isFailure", !set.isFailure)
                      }
                      disabled={isFinished}
                      className="h-8 w-8 rounded-md flex items-center justify-center touch-manipulation transition-colors"
                    >
                      <Flame
                        className={cn(
                          "w-4 h-4",
                          set.isFailure
                            ? "text-orange-500 fill-orange-500"
                            : "text-zinc-700"
                        )}
                      />
                    </button>

                    {/* Warmup toggle */}
                    <button
                      onClick={() =>
                        handleSetChange(set.id!, "isWarmup", !set.isWarmup)
                      }
                      disabled={isFinished}
                      className={cn(
                        "h-8 w-8 rounded-md flex items-center justify-center text-[10px] font-bold touch-manipulation transition-colors",
                        set.isWarmup
                          ? "bg-amber-500/20 text-amber-400"
                          : "text-zinc-700"
                      )}
                    >
                      WU
                    </button>
                  </div>
                ))}

                {/* Add/Remove/Copy */}
                {!isFinished && (
                  <div className="flex items-center gap-3 px-3 py-2 border-t border-[var(--border)]">
                    <button
                      onClick={() => addSetToExercise(se.id!)}
                      className="flex items-center gap-1 text-xs text-[var(--accent)] font-medium touch-manipulation"
                    >
                      <Plus className="w-3 h-3" />
                      Add
                    </button>
                    {sets.length > 1 && (
                      <button
                        onClick={() => removeLastSet(se.id!)}
                        className="flex items-center gap-1 text-xs text-red-400 font-medium touch-manipulation"
                      >
                        <Minus className="w-3 h-3" />
                        Remove
                      </button>
                    )}
                    <button
                      onClick={() => handleCopyLast(se.exerciseId, se.id!)}
                      className="flex items-center gap-1 text-xs text-[var(--muted-fg)] font-medium touch-manipulation ml-auto"
                    >
                      <Copy className="w-3 h-3" />
                      Copy Last
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* No workout scheduled and no rest type */}
      {!sw && (
        <div className="text-center py-20">
          <p className="text-[var(--muted-fg)] text-sm">
            No workout scheduled for this day
          </p>
        </div>
      )}

      {/* Cardio Log - always visible */}
      <CardioLogSection dateISO={date} />

      {/* Sticky finish bar */}
      {session && !isFinished && !isActiveRest && (
        <div className="fixed bottom-16 md:bottom-0 inset-x-0 z-20 p-3 bg-[var(--bg)] border-t border-[var(--border)]">
          <div className="max-w-lg mx-auto">
            <button
              onClick={handleFinish}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[var(--accent)] text-white font-semibold text-sm transition-colors hover:opacity-90 touch-manipulation"
            >
              <Check className="w-4 h-4" />
              Finish Workout
            </button>
          </div>
        </div>
      )}

      {/* Weight Keypad */}
      <WeightKeypad
        open={keypadOpen}
        initialValue={keypadInitialValue}
        lastWeight={keypadLastWeight}
        unit={settings?.weightUnit ?? "lb"}
        onConfirm={handleKeypadConfirm}
        onClose={() => setKeypadOpen(false)}
      />
    </div>
  );
}
