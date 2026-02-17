"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Plus, Trash2, Heart } from "lucide-react";
import { db } from "@/lib/db/schema";
import type { CardioLog } from "@/lib/types";
import { cn } from "@/lib/utils";

const CARDIO_TYPES: { value: CardioLog["type"]; label: string }[] = [
  { value: "liss", label: "LISS" },
  { value: "hiit", label: "HIIT" },
  { value: "steps", label: "Steps" },
  { value: "other", label: "Other" },
];

interface CardioLogSectionProps {
  dateISO: string;
}

export function CardioLogSection({ dateISO }: CardioLogSectionProps) {
  const entries =
    useLiveQuery(
      () => db.cardioLogs.where("dateISO").equals(dateISO).toArray(),
      [dateISO]
    ) ?? [];

  const [adding, setAdding] = useState(false);
  const [type, setType] = useState<CardioLog["type"]>("liss");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");

  const handleAdd = async () => {
    const dur = parseInt(duration);
    if (isNaN(dur) || dur <= 0) return;

    await db.cardioLogs.add({
      dateISO,
      type,
      durationMin: dur,
      notes: notes.trim() || undefined,
    } as CardioLog);

    setAdding(false);
    setType("liss");
    setDuration("");
    setNotes("");
  };

  const handleDelete = async (id: number) => {
    await db.cardioLogs.delete(id);
  };

  return (
    <div className="mt-6">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3">
        <Heart className="w-4 h-4 text-[var(--accent)]" />
        <h3 className="text-sm font-semibold">Cardio Log</h3>
      </div>

      {/* Existing entries */}
      {entries.length > 0 && (
        <div className="space-y-2 mb-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-3 rounded-lg bg-[var(--card)] border border-[var(--border)]"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-[var(--accent)]/10 text-[var(--accent)] uppercase">
                  {entry.type}
                </span>
                <span className="text-sm font-medium">{entry.durationMin} min</span>
                {entry.notes && (
                  <span className="text-xs text-[var(--muted-fg)]">{entry.notes}</span>
                )}
              </div>
              <button
                onClick={() => handleDelete(entry.id!)}
                className="p-1.5 rounded-md hover:bg-red-500/10 touch-manipulation"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add form */}
      {adding ? (
        <div className="p-3 rounded-lg bg-[var(--card)] border border-[var(--border)] space-y-3">
          {/* Type selector */}
          <div className="flex gap-1.5">
            {CARDIO_TYPES.map((ct) => (
              <button
                key={ct.value}
                onClick={() => setType(ct.value)}
                className={cn(
                  "flex-1 py-1.5 rounded-md text-xs font-medium transition-all touch-manipulation",
                  type === ct.value
                    ? "bg-[var(--accent)]/15 text-[var(--accent)] ring-1 ring-[var(--accent)]/30"
                    : "text-[var(--muted-fg)] hover:bg-[var(--muted)]"
                )}
              >
                {ct.label}
              </button>
            ))}
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              placeholder="Duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="flex-1 h-9 px-3 rounded-md bg-[var(--muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] border-0"
            />
            <span className="text-xs text-[var(--muted-fg)]">min</span>
          </div>

          {/* Notes */}
          <input
            type="text"
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-9 px-3 rounded-md bg-[var(--muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] border-0"
          />

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 py-2 rounded-md bg-[var(--accent)] text-white text-sm font-medium touch-manipulation"
            >
              Add
            </button>
            <button
              onClick={() => setAdding(false)}
              className="px-4 py-2 rounded-md bg-[var(--muted)] text-sm font-medium text-[var(--muted-fg)] touch-manipulation"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 w-full py-2.5 rounded-lg border border-dashed border-[var(--border)] text-sm text-[var(--muted-fg)] font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors touch-manipulation justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Cardio
        </button>
      )}
    </div>
  );
}
