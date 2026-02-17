"use client";

import { useTemplates } from "@/lib/hooks/use-templates";
import { useExerciseMap } from "@/lib/hooks/use-exercises";
import { TEMPLATE_COLORS } from "@/lib/types";
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
            className="rounded-xl border border-[var(--border)] overflow-hidden"
          >
            {/* Template header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[var(--muted)]">
              <span
                className={cn(
                  "w-3 h-3 rounded-full",
                  TEMPLATE_COLORS[tpl.id] ?? "bg-gray-400"
                )}
              />
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
                      {item.sets} × {item.repsMin === item.repsMax ? item.repsMin : `${item.repsMin}-${item.repsMax}`}
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
