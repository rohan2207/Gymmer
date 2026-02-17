"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Delete } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeightKeypadProps {
  open: boolean;
  initialValue: number | undefined;
  lastWeight: number | undefined;
  unit: "lb" | "kg";
  onConfirm: (value: number | undefined) => void;
  onClose: () => void;
}

export function WeightKeypad({
  open,
  initialValue,
  lastWeight,
  unit,
  onConfirm,
  onClose,
}: WeightKeypadProps) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (open) {
      setDisplay(initialValue != null ? String(initialValue) : "");
    }
  }, [open, initialValue]);

  const handleKey = useCallback((key: string) => {
    setDisplay((prev) => {
      if (key === "." && prev.includes(".")) return prev;
      if (prev === "0" && key !== ".") return key;
      return prev + key;
    });
  }, []);

  const handleBackspace = useCallback(() => {
    setDisplay((prev) => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setDisplay("");
  }, []);

  const handleChip = useCallback((amount: number) => {
    setDisplay((prev) => {
      const current = parseFloat(prev) || 0;
      return String(Math.round((current + amount) * 10) / 10);
    });
  }, []);

  const handleLast = useCallback(() => {
    if (lastWeight != null) {
      setDisplay(String(lastWeight));
    }
  }, [lastWeight]);

  const handleDone = () => {
    const val = parseFloat(display);
    onConfirm(isNaN(val) ? undefined : val);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-[var(--bg)] border-t border-[var(--border)] rounded-t-2xl safe-bottom animate-in slide-in-from-bottom">
        {/* Handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-[var(--border)]" />
        </div>

        {/* Display */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <span className="text-3xl font-bold tabular-nums">
              {display || "0"}
            </span>
            <span className="text-lg text-[var(--muted-fg)] ml-1">{unit}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--muted)] touch-manipulation"
          >
            <X className="w-5 h-5 text-[var(--muted-fg)]" />
          </button>
        </div>

        {/* Quick chips */}
        <div className="px-4 pb-3 flex gap-2">
          {[2.5, 5, 10].map((amt) => (
            <button
              key={amt}
              onClick={() => handleChip(amt)}
              className="flex-1 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm font-medium touch-manipulation active:bg-[var(--accent)]/20"
            >
              +{amt}
            </button>
          ))}
          <button
            onClick={handleLast}
            disabled={lastWeight == null}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-medium touch-manipulation border",
              lastWeight != null
                ? "bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--accent)]"
                : "bg-[var(--card)] border-[var(--border)] text-[var(--muted-fg)] opacity-40"
            )}
          >
            Last
          </button>
        </div>

        {/* Keypad grid */}
        <div className="px-4 pb-3 grid grid-cols-3 gap-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"].map(
            (key) => (
              <button
                key={key}
                onClick={() => {
                  if (key === "back") handleBackspace();
                  else handleKey(key);
                }}
                onDoubleClick={() => {
                  if (key === "back") handleClear();
                }}
                className={cn(
                  "h-12 rounded-lg font-semibold text-lg transition-colors touch-manipulation active:bg-[var(--accent)]/20",
                  key === "back"
                    ? "bg-[var(--card)] border border-[var(--border)] flex items-center justify-center"
                    : "bg-[var(--card)] border border-[var(--border)]"
                )}
              >
                {key === "back" ? (
                  <Delete className="w-5 h-5 text-[var(--muted-fg)]" />
                ) : (
                  key
                )}
              </button>
            )
          )}
        </div>

        {/* Done button */}
        <div className="px-4 pb-4">
          <button
            onClick={handleDone}
            className="w-full py-3 rounded-lg bg-[var(--accent)] text-white font-semibold text-sm touch-manipulation hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}
