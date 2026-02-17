"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Play, Check, Plus, Minus } from "lucide-react";
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
import type { SessionSet } from "@/lib/types";

export default function DayPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = use(params);
  const router = useRouter();
  const dayDate = fromDateISO(date);
  const dayLabel = format(dayDate, "EEEE, MMMM d");

  const sw = useScheduledWorkoutForDate(date);
  const effectiveTemplateId = sw?.overrideTemplateId ?? sw?.templateId;
  const template = useTemplate(effectiveTemplateId);
  const exerciseMap = useExerciseMap();
  const settings = useSettings();

  const session = useSessionForDate(date);
  const sessionExercises = useSessionExercises(session?.id);
  const allSets = useAllSessionSetsForSession(session?.id);

  const setsMap = new Map<number, SessionSet[]>();
  for (const s of allSets) {
    const arr = setsMap.get(s.sessionExerciseId) ?? [];
    arr.push(s);
    setsMap.set(s.sessionExerciseId, arr);
  }

  const handleStart = async () => {
    if (!template) return;
    await startSession(date, template, settings?.autoFillLastWeights ?? true);
  };

  const handleFinish = async () => {
    if (!session) return;
    await finishSession(session.id!, date);
  };

  const handleSetChange = (setId: number, field: keyof SessionSet, value: unknown) => {
    updateSet(setId, { [field]: value });
  };

  const isFinished = !!session?.finishedAt;

  return (
    <div className="max-w-lg mx-auto px-4 py-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => router.push("/calendar")}
          className="p-2 -ml-2 rounded-lg hover:bg-[var(--muted)] transition-colors touch-manipulation"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold">{dayLabel}</h1>
          {template && (
            <p className="text-sm text-[var(--muted-fg)]">{template.name}</p>
          )}
        </div>
      </div>

      {/* No workout scheduled */}
      {!sw && (
        <div className="text-center py-20">
          <p className="text-[var(--muted-fg)] text-sm">Rest day — no workout scheduled</p>
        </div>
      )}

      {/* Workout scheduled but not started */}
      {sw && !session && template && (
        <div>
          <div className="space-y-3 mb-6">
            {template.items.map((item, i) => {
              const ex = exerciseMap.get(item.exerciseId);
              return (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--muted)]"
                >
                  <div>
                    <p className="text-sm font-medium">{ex?.name ?? item.exerciseId}</p>
                    <p className="text-xs text-[var(--muted-fg)]">
                      {item.sets} × {item.repsMin === item.repsMax ? item.repsMin : `${item.repsMin}-${item.repsMax}`}
                      {item.notes ? ` • ${item.notes}` : ""}
                    </p>
                  </div>
                  <span className="text-xs text-[var(--muted-fg)]">{ex?.equipment}</span>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleStart}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[var(--accent)] text-white font-semibold text-sm transition-colors hover:opacity-90 touch-manipulation"
          >
            <Play className="w-4 h-4" />
            Start Logging
          </button>
        </div>
      )}

      {/* Active session */}
      {session && (
        <div className="space-y-5">
          {isFinished && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500 font-medium">Workout Complete</span>
            </div>
          )}

          {sessionExercises.map((se) => {
            const ex = exerciseMap.get(se.exerciseId);
            const sets = (setsMap.get(se.id!) ?? []).sort(
              (a, b) => a.setNumber - b.setNumber
            );

            return (
              <div key={se.id} className="rounded-xl border border-[var(--border)] overflow-hidden">
                {/* Exercise header */}
                <div className="px-4 py-3 bg-[var(--muted)]">
                  <p className="text-sm font-semibold">{ex?.name ?? se.exerciseId}</p>
                  <p className="text-xs text-[var(--muted-fg)]">
                    Target: {se.targetRepsMin === se.targetRepsMax ? se.targetRepsMin : `${se.targetRepsMin}-${se.targetRepsMax}`} reps
                  </p>
                </div>

                {/* Set rows header */}
                <div className="grid grid-cols-[36px_1fr_1fr_44px_44px] gap-1 px-3 py-1.5 text-[10px] font-medium text-[var(--muted-fg)] uppercase">
                  <span>Set</span>
                  <span>Weight</span>
                  <span>Reps</span>
                  <span className="text-center">Fail</span>
                  <span className="text-center">WU</span>
                </div>

                {/* Set rows */}
                {sets.map((set) => (
                  <div
                    key={set.id}
                    className={cn(
                      "grid grid-cols-[36px_1fr_1fr_44px_44px] gap-1 px-3 py-1.5 items-center",
                      set.isWarmup && "opacity-60"
                    )}
                  >
                    <span className="text-xs font-medium text-[var(--muted-fg)] text-center">
                      {set.setNumber}
                    </span>

                    <input
                      type="number"
                      inputMode="decimal"
                      placeholder="lbs"
                      value={set.weight ?? ""}
                      onChange={(e) =>
                        handleSetChange(
                          set.id!,
                          "weight",
                          e.target.value ? parseFloat(e.target.value) : undefined
                        )
                      }
                      disabled={isFinished}
                      className="w-full h-9 rounded-md bg-[var(--muted)] border border-[var(--border)] text-center text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-50"
                    />

                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder={`${set.targetRepsMin}-${set.targetRepsMax}`}
                      value={set.reps ?? ""}
                      onChange={(e) =>
                        handleSetChange(
                          set.id!,
                          "reps",
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                      disabled={isFinished}
                      className="w-full h-9 rounded-md bg-[var(--muted)] border border-[var(--border)] text-center text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-50"
                    />

                    <button
                      onClick={() => handleSetChange(set.id!, "isFailure", !set.isFailure)}
                      disabled={isFinished}
                      className={cn(
                        "h-9 w-full rounded-md flex items-center justify-center text-xs font-bold transition-colors touch-manipulation",
                        set.isFailure
                          ? "bg-red-500 text-white"
                          : "bg-[var(--muted)] text-[var(--muted-fg)] border border-[var(--border)]"
                      )}
                    >
                      F
                    </button>

                    <button
                      onClick={() => handleSetChange(set.id!, "isWarmup", !set.isWarmup)}
                      disabled={isFinished}
                      className={cn(
                        "h-9 w-full rounded-md flex items-center justify-center text-xs font-bold transition-colors touch-manipulation",
                        set.isWarmup
                          ? "bg-amber-500 text-white"
                          : "bg-[var(--muted)] text-[var(--muted-fg)] border border-[var(--border)]"
                      )}
                    >
                      W
                    </button>
                  </div>
                ))}

                {/* Add/remove set */}
                {!isFinished && (
                  <div className="flex items-center gap-2 px-3 py-2 border-t border-[var(--border)]">
                    <button
                      onClick={() => addSetToExercise(se.id!)}
                      className="flex items-center gap-1 text-xs text-[var(--accent)] font-medium touch-manipulation"
                    >
                      <Plus className="w-3 h-3" /> Add set
                    </button>
                    {sets.length > 1 && (
                      <button
                        onClick={() => removeLastSet(se.id!)}
                        className="flex items-center gap-1 text-xs text-red-400 font-medium touch-manipulation"
                      >
                        <Minus className="w-3 h-3" /> Remove
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Finish button */}
          {!isFinished && (
            <button
              onClick={handleFinish}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-green-600 text-white font-semibold text-sm transition-colors hover:bg-green-700 touch-manipulation"
            >
              <Check className="w-4 h-4" />
              Finish Workout
            </button>
          )}
        </div>
      )}
    </div>
  );
}
