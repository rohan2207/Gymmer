"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { ChevronLeft, Save, RotateCcw } from "lucide-react";
import { db } from "@/lib/db/schema";
import { regenerateFullSchedule } from "@/lib/db/schedule";
import { SLOT_OPTIONS, DAY_NAMES, TEMPLATE_COLORS, TEMPLATE_BG } from "@/lib/types";
import type { ProgramConfig } from "@/lib/types";
import { cn, toDateISO } from "@/lib/utils";

export default function ProgramPage() {
  const router = useRouter();
  const config = useLiveQuery(() => db.programConfig.get("program"));

  const [startDate, setStartDate] = useState(toDateISO(new Date()));
  const [weekSlots, setWeekSlots] = useState<string[]>([
    "push", "pull", "legs", "rest", "upper", "lower", "rest",
  ]);
  const [scheduleMode, setScheduleMode] = useState<"fixed" | "carryForward">("fixed");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (config) {
      setStartDate(config.startDate);
      setWeekSlots([...config.weekSlots]);
      setScheduleMode(config.scheduleMode);
    }
  }, [config]);

  const handleSlotChange = (index: number, value: string) => {
    setWeekSlots((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated: ProgramConfig = {
        id: "program",
        startDate,
        weekSlots,
        scheduleMode,
      };
      await db.programConfig.put(updated);
      await regenerateFullSchedule();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const trainingDays = weekSlots.filter(
    (s) => s !== "rest" && s !== "activeRest"
  ).length;
  const restDays = weekSlots.filter((s) => s === "rest").length;
  const activeDays = weekSlots.filter((s) => s === "activeRest").length;

  return (
    <div className="max-w-lg mx-auto px-4 py-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-lg hover:bg-[var(--muted)] transition-colors touch-manipulation"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold">Program Builder</h1>
          <p className="text-xs text-[var(--muted-fg)]">Configure your weekly split</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Start Date */}
        <section>
          <label className="text-xs font-medium text-[var(--muted-fg)] block mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full h-10 px-3 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </section>

        {/* Day Assignment */}
        <section>
          <label className="text-xs font-medium text-[var(--muted-fg)] block mb-2">
            Weekly Schedule
          </label>
          <div className="space-y-2">
            {DAY_NAMES.map((day, i) => (
              <div
                key={day}
                className="flex items-center gap-3 p-3 rounded-lg bg-[var(--card)] border border-[var(--border)]"
              >
                <span className="text-sm font-semibold w-10 shrink-0">{day}</span>
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {SLOT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSlotChange(i, opt.value)}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-xs font-medium transition-all touch-manipulation",
                        weekSlots[i] === opt.value
                          ? `${TEMPLATE_BG[opt.value]} ${TEMPLATE_COLORS[opt.value]} ring-1 ring-current`
                          : "text-[var(--muted-fg)] hover:bg-[var(--muted)]"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="flex items-center gap-4 mt-3 px-1">
            <span className="text-xs text-[var(--muted-fg)]">
              {trainingDays} training
            </span>
            <span className="text-xs text-[var(--muted-fg)]">
              {restDays} rest
            </span>
            {activeDays > 0 && (
              <span className="text-xs text-[var(--muted-fg)]">
                {activeDays} active rest
              </span>
            )}
          </div>
        </section>

        {/* Schedule Mode */}
        <section>
          <label className="text-xs font-medium text-[var(--muted-fg)] block mb-2">
            Schedule Mode
          </label>
          <div className="flex gap-2">
            {(
              [
                { key: "fixed", label: "Fixed Weekly", desc: "Same days every week" },
                { key: "carryForward", label: "Carry Forward", desc: "Shift if you miss a day" },
              ] as const
            ).map(({ key, label, desc }) => (
              <button
                key={key}
                onClick={() => setScheduleMode(key)}
                className={cn(
                  "flex-1 p-3 rounded-lg text-left transition-all touch-manipulation border",
                  scheduleMode === key
                    ? "border-[var(--accent)] bg-[var(--accent)]/10"
                    : "border-[var(--border)] bg-[var(--card)]"
                )}
              >
                <span
                  className={cn(
                    "text-sm font-medium block",
                    scheduleMode === key
                      ? "text-[var(--accent)]"
                      : "text-[var(--fg)]"
                  )}
                >
                  {label}
                </span>
                <span className="text-[10px] text-[var(--muted-fg)]">{desc}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all touch-manipulation",
            saved
              ? "bg-emerald-600 text-white"
              : "bg-[var(--accent)] text-white hover:opacity-90",
            saving && "opacity-50"
          )}
        >
          {saving ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : saved ? (
            <>
              <Save className="w-4 h-4" />
              Saved & Regenerated
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save & Generate Schedule
            </>
          )}
        </button>
      </div>
    </div>
  );
}
