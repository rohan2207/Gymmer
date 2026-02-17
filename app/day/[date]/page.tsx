"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { ChevronLeft, Check, Plus, Flame, Copy, CheckCircle2 } from "lucide-react";
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
import { fromDateISO, cn, toDateISO } from "@/lib/utils";
import { TEMPLATE_LABELS, TEMPLATE_COLORS } from "@/lib/types";
import type { SessionSet } from "@/lib/types";
import { CardioLogSection } from "@/components/day/cardio-log";
import { db } from "@/lib/db/schema";

export default function DayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateParam = searchParams.get("template");

  const dayDate = fromDateISO(date);
  const dayLabel = format(dayDate, "EEE, MMM d");
  const isToday = toDateISO(new Date()) === date;

  const session = useSessionForDate(date);
  const existingTemplateId = session?.templateId ?? templateParam ?? undefined;
  const template = useTemplate(
    existingTemplateId !== "rest" && existingTemplateId !== "activeRest"
      ? existingTemplateId
      : existingTemplateId === "activeRest"
        ? "activeRest"
        : undefined
  );
  const exerciseMap = useExerciseMap();
  const settings = useSettings();

  const sessionExercises = useSessionExercises(session?.id);
  const allSets = useAllSessionSetsForSession(session?.id);

  const [autoStarted, setAutoStarted] = useState(false);

  const setsMap = new Map<number, SessionSet[]>();
  for (const s of allSets) {
    const arr = setsMap.get(s.sessionExerciseId) ?? [];
    arr.push(s);
    setsMap.set(s.sessionExerciseId, arr);
  }

  useEffect(() => {
    if (
      templateParam &&
      !session &&
      template &&
      !autoStarted &&
      template.id !== "rest"
    ) {
      setAutoStarted(true);
      startSession(date, template, settings?.autoFillLastWeights ?? true);
    }
  }, [templateParam, session, template, autoStarted, date, settings]);

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

  const handleCopyLast = useCallback(
    async (exerciseId: string, sessionExerciseId: number) => {
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

          for (
            let i = 0;
            i < currentSets.length && i < prevSets.length;
            i++
          ) {
            if (prevSets[i].weight) {
              await updateSet(currentSets[i].id!, {
                weight: prevSets[i].weight,
              });
            }
          }
          break;
        }
      }
    },
    [date]
  );

  const isFinished = !!session?.finishedAt;
  const isActiveRest = existingTemplateId === "activeRest";
  const typeLabel =
    existingTemplateId && TEMPLATE_LABELS[existingTemplateId]
      ? TEMPLATE_LABELS[existingTemplateId]
      : "";
  const typeColor =
    existingTemplateId && TEMPLATE_COLORS[existingTemplateId]
      ? TEMPLATE_COLORS[existingTemplateId]
      : "text-[var(--muted-fg)]";

  const noWorkout = !session && !templateParam;

  return (
    <div className="max-w-lg mx-auto px-4 pb-52">
      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-30 bg-[var(--bg)]/95 backdrop-blur-sm pb-2 pt-3 -mx-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="p-2 -ml-2 rounded-xl hover:bg-[var(--muted)] transition-colors touch-manipulation"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold leading-tight">{dayLabel}</h1>
              {typeLabel && (
                <span className={cn("text-xs font-semibold", typeColor)}>
                  {typeLabel}
                </span>
              )}
            </div>
          </div>

          {session && !isFinished && (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold touch-manipulation active:scale-95 transition-transform"
            >
              <Check className="w-3.5 h-3.5" />
              Finish
            </button>
          )}

          {isFinished && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-semibold">
                Done
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── No workout state ── */}
      {noWorkout && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-[var(--muted-fg)] text-sm">
            No workout selected for this day
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold touch-manipulation"
          >
            Choose a Workout
          </button>
        </div>
      )}

      {/* ── Active rest ── */}
      {isActiveRest && template && (
        <div className="mt-4 space-y-3">
          {template.items.map((item) => {
            const ex = exerciseMap.get(item.exerciseId);
            return (
              <div
                key={item.exerciseId}
                className="flex items-center gap-3 py-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold">
                    {ex?.name ?? item.exerciseId}
                  </p>
                  {item.notes && (
                    <p className="text-xs text-[var(--muted-fg)] mt-0.5">
                      {item.notes}
                    </p>
                  )}
                </div>
                {isFinished ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-[var(--border)]" />
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
              className="w-full flex items-center justify-center gap-2 py-3 mt-4 rounded-xl bg-[var(--accent)] text-white font-semibold text-sm touch-manipulation active:scale-[0.98] transition-transform"
            >
              <Check className="w-4 h-4" />
              Mark Complete
            </button>
          )}
        </div>
      )}

      {/* ── Training day exercises ── */}
      {session && !isActiveRest && (
        <div className="mt-2 space-y-6">
          {sessionExercises.map((se) => {
            const ex = exerciseMap.get(se.exerciseId);
            const sets = (setsMap.get(se.id!) ?? []).sort(
              (a, b) => a.setNumber - b.setNumber
            );

            return (
              <div key={se.id}>
                {/* Exercise header */}
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold leading-tight">
                      {ex?.name ?? se.exerciseId}
                    </p>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-fg)] ml-2 shrink-0">
                    {se.targetRepsMin === se.targetRepsMax
                      ? se.targetRepsMin
                      : `${se.targetRepsMin}-${se.targetRepsMax}`}
                  </span>
                </div>

                {/* Subtle divider */}
                <div className="h-px bg-[var(--border)] mb-2" />

                {/* Set rows */}
                <div className="space-y-0.5">
                  {sets.map((set) => (
                    <div
                      key={set.id}
                      className={cn(
                        "flex items-center gap-2 h-9 rounded-lg px-1",
                        set.isWarmup && "opacity-50"
                      )}
                    >
                      {/* Set number */}
                      <span className="w-5 text-center text-xs text-[var(--muted-fg)] font-mono tabular-nums">
                        {set.setNumber}
                      </span>

                      {/* Weight */}
                      <input
                        type="number"
                        inputMode="decimal"
                        placeholder={settings?.weightUnit === "kg" ? "kg" : "lb"}
                        value={set.weight ?? ""}
                        onChange={(e) =>
                          handleSetChange(
                            set.id!,
                            "weight",
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined
                          )
                        }
                        onFocus={(e) => e.target.select()}
                        disabled={isFinished}
                        className="w-16 h-7 bg-transparent text-right text-sm font-medium focus:outline-none focus:bg-[var(--accent)]/5 focus:ring-1 focus:ring-[var(--accent)]/40 rounded-md px-1.5 transition-colors disabled:opacity-40 tabular-nums border-0"
                      />

                      {/* Separator */}
                      <span className="text-xs text-[var(--muted-fg)]">x</span>

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
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined
                          )
                        }
                        onFocus={(e) => e.target.select()}
                        disabled={isFinished}
                        className="w-12 h-7 bg-transparent text-center text-sm font-medium focus:outline-none focus:bg-[var(--accent)]/5 focus:ring-1 focus:ring-[var(--accent)]/40 rounded-md transition-colors disabled:opacity-40 tabular-nums border-0"
                      />

                      <div className="flex-1" />

                      {/* Failure toggle */}
                      <button
                        onClick={() =>
                          handleSetChange(
                            set.id!,
                            "isFailure",
                            !set.isFailure
                          )
                        }
                        disabled={isFinished}
                        className="flex items-center justify-center w-9 h-9 rounded-lg touch-manipulation transition-colors active:scale-90"
                      >
                        <Flame
                          className={cn(
                            "w-[18px] h-[18px] transition-colors",
                            set.isFailure
                              ? "text-orange-500 fill-orange-500"
                              : "text-zinc-700"
                          )}
                        />
                      </button>

                      {/* Warmup toggle */}
                      <button
                        onClick={() =>
                          handleSetChange(
                            set.id!,
                            "isWarmup",
                            !set.isWarmup
                          )
                        }
                        disabled={isFinished}
                        className={cn(
                          "flex items-center justify-center h-6 px-2 rounded-full text-[10px] font-semibold touch-manipulation transition-all",
                          set.isWarmup
                            ? "bg-amber-500/15 text-amber-400"
                            : "text-zinc-600 hover:text-zinc-400"
                        )}
                      >
                        Warm
                      </button>
                    </div>
                  ))}
                </div>

                {/* Actions row */}
                {!isFinished && (
                  <div className="flex items-center mt-1 pl-6">
                    <button
                      onClick={() => addSetToExercise(se.id!)}
                      className="flex items-center gap-1 text-xs text-[var(--accent)] font-medium touch-manipulation py-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add Set
                    </button>
                    <button
                      onClick={() => handleCopyLast(se.exerciseId, se.id!)}
                      className="flex items-center gap-1 text-xs text-[var(--muted-fg)] font-medium touch-manipulation py-1 ml-auto"
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

      {/* ── Cardio log ── */}
      <div className="mt-8">
        <CardioLogSection dateISO={date} />
      </div>

      {/* Spacer so content doesn't hide behind sticky bars */}
      {session && !isFinished && !isActiveRest && <div className="h-20" />}

      {/* ── Sticky finish bar ── */}
      {session && !isFinished && !isActiveRest && (
        <div className="fixed bottom-14 md:bottom-0 inset-x-0 z-20 px-4 py-2 bg-[var(--bg)]/95 backdrop-blur-sm border-t border-[var(--border)]">
          <div className="max-w-lg mx-auto">
            <button
              onClick={handleFinish}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--accent)] text-white font-semibold text-sm transition-all hover:opacity-90 touch-manipulation active:scale-[0.98]"
            >
              <Check className="w-4 h-4" />
              Finish Workout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
