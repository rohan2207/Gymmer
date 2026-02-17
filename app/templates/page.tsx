"use client";

import { useTemplates } from "@/lib/hooks/use-templates";
import { useExerciseMap } from "@/lib/hooks/use-exercises";
import { TEMPLATE_COLORS, TEMPLATE_BG, TEMPLATE_LABELS } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function TemplatesPage() {
  const templates = useTemplates();
  const exerciseMap = useExerciseMap();

  return (
    <div className="max-w-lg mx-auto px-4 py-5">
      <h1 className="text-xl font-bold mb-5">Templates</h1>

      {templates.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[var(--muted-fg)] text-sm">No templates yet</p>
        </div>
      )}

      <div className="space-y-4">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="rounded-lg bg-[var(--card)] border border-[var(--border)] overflow-hidden"
          >
            {/* Template header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
              <span
                className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded",
                  TEMPLATE_BG[tpl.id] ?? "bg-zinc-500/10",
                  TEMPLATE_COLORS[tpl.id] ?? "text-zinc-500"
                )}
              >
                {TEMPLATE_LABELS[tpl.id] ?? tpl.id}
              </span>
              <h2 className="text-sm font-semibold">{tpl.name}</h2>
            </div>

            {/* Exercises */}
            <div className="divide-y divide-[var(--border)]">
              {tpl.items.map((item, i) => {
                const ex = exerciseMap.get(item.exerciseId);
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[var(--muted-fg)] w-5">
                        {item.order}
                      </span>
                      <div>
                        <p className="text-sm font-medium">
                          {ex?.name ?? item.exerciseId}
                        </p>
                        {item.notes && (
                          <p className="text-[11px] text-[var(--muted-fg)]">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-[var(--muted-fg)] whitespace-nowrap">
                      {item.sets} x{" "}
                      {item.repsMin === item.repsMax
                        ? item.repsMin
                        : `${item.repsMin}-${item.repsMax}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
