"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Dumbbell, BarChart3, FileText, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/templates", icon: FileText, label: "Templates" },
  { href: "/progress", icon: BarChart3, label: "Progress" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 h-screen sticky top-0 border-r border-[var(--border)] bg-[var(--muted)]">
      <div className="flex items-center gap-2 px-5 h-14 border-b border-[var(--border)]">
        <Dumbbell className="w-5 h-5 text-[var(--accent)]" />
        <span className="font-bold text-base">Muscle Calendar</span>
      </div>
      <nav className="flex-1 py-3">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "text-[var(--accent)] bg-[var(--accent)]/10"
                  : "text-[var(--muted-fg)] hover:text-[var(--fg)]"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
