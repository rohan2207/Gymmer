"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, TrendingUp, Settings, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/calendar", icon: CalendarDays, label: "History" },
  { href: "/progress", icon: TrendingUp, label: "Progress" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 h-screen sticky top-0 border-r border-[var(--border)] bg-[var(--card)]">
      <div className="flex items-center gap-2 px-5 h-14 border-b border-[var(--border)]">
        <Dumbbell className="w-5 h-5 text-[var(--accent)]" />
        <span className="font-bold text-base">Gymmer</span>
      </div>
      <nav className="flex-1 py-3">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);

          return (
            <Link
              key={label}
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
