"use client";

import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { BottomNav } from "./bottom-nav";
import { useInit } from "@/lib/hooks/use-init";
import { Dumbbell } from "lucide-react";

export function AppShell({ children }: { children: ReactNode }) {
  const ready = useInit();

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Dumbbell className="w-10 h-10 mx-auto mb-3 text-[var(--accent)] animate-pulse" />
          <p className="text-sm text-[var(--muted-fg)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-h-screen pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
