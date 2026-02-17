"use client";

import { useState } from "react";
import { useExercises } from "@/lib/hooks/use-exercises";
import {
  useExerciseProgress,
  useWeeklySummaries,
} from "@/lib/hooks/use-progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProgressPage() {
  const exercises = useExercises();
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");
  const progress = useExerciseProgress(selectedExerciseId || undefined);
  const weeklySummaries = useWeeklySummaries();

  const chartData = progress.map((p) => ({
    date: p.dateISO.slice(5), // "MM-DD"
    weight: p.maxWeight,
    reps: p.bestReps,
    e1RM: p.estimated1RM,
    volume: p.totalVolume,
  }));

  return (
    <div className="max-w-lg mx-auto px-4 py-5">
      <h1 className="text-xl font-bold mb-5">Progress</h1>

      {/* Exercise selector */}
      <select
        value={selectedExerciseId}
        onChange={(e) => setSelectedExerciseId(e.target.value)}
        className="w-full h-10 px-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm mb-5 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
      >
        <option value="">Select an exercise...</option>
        {exercises.map((ex) => (
          <option key={ex.id} value={ex.id}>
            {ex.name}
          </option>
        ))}
      </select>

      {/* Charts */}
      {selectedExerciseId && chartData.length > 0 ? (
        <div className="space-y-6 mb-8">
          {/* Weight chart */}
          <div className="rounded-xl border border-[var(--border)] p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
              Weight Over Time
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="var(--muted-fg)" style={{ fontSize: 11 }} />
                  <YAxis stroke="var(--muted-fg)" style={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--muted)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Max Weight" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Estimated 1RM chart */}
          <div className="rounded-xl border border-[var(--border)] p-4">
            <h3 className="text-sm font-semibold mb-3">Est. 1RM</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="var(--muted-fg)" style={{ fontSize: 11 }} />
                  <YAxis stroke="var(--muted-fg)" style={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--muted)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="e1RM" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="Est. 1RM" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : selectedExerciseId ? (
        <div className="text-center py-12 mb-8">
          <BarChart3 className="w-10 h-10 mx-auto mb-3 text-[var(--muted-fg)]" />
          <p className="text-sm text-[var(--muted-fg)]">No data yet. Complete a workout first.</p>
        </div>
      ) : null}

      {/* Weekly summaries */}
      <h2 className="text-base font-semibold mb-3">Weekly Summary</h2>
      {weeklySummaries.length === 0 ? (
        <p className="text-sm text-[var(--muted-fg)]">Complete workouts to see weekly data.</p>
      ) : (
        <div className="space-y-3">
          {weeklySummaries.slice(0, 8).map((week) => (
            <div
              key={week.weekLabel}
              className="rounded-xl border border-[var(--border)] p-4"
            >
              <p className="text-xs font-medium text-[var(--muted-fg)] mb-2">
                Week of {week.weekLabel}
              </p>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <p className="text-lg font-bold">{week.totalSets}</p>
                  <p className="text-[10px] text-[var(--muted-fg)]">Total Sets</p>
                </div>
                <div>
                  <p className="text-lg font-bold">
                    {week.totalVolume > 1000
                      ? `${(week.totalVolume / 1000).toFixed(1)}k`
                      : week.totalVolume}
                  </p>
                  <p className="text-[10px] text-[var(--muted-fg)]">Volume (lbs)</p>
                </div>
                <div>
                  <p className={cn("text-lg font-bold", week.failureSets > 0 && "text-red-400")}>
                    {week.failureSets}
                  </p>
                  <p className="text-[10px] text-[var(--muted-fg)]">Failure Sets</p>
                </div>
              </div>

              {Object.keys(week.muscleGroups).length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(week.muscleGroups)
                    .sort(([, a], [, b]) => b - a)
                    .map(([muscle, sets]) => (
                      <span
                        key={muscle}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-fg)]"
                      >
                        {muscle}: {sets}
                      </span>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
