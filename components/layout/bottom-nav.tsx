"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Dumbbell, TrendingUp, Settings } from "lucide-react";
import { cn, toDateISO } from "@/lib/utils";

const today = () => toDateISO(new Date());

const NAV = [
  { href: "/calendar", icon: CalendarDays, label: "Home" },
  { href: () => `/day/${today()}`, icon: Dumbbell, label: "Log" },
  { href: "/progress", icon: TrendingUp, label: "Progress" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--bg)] border-t border-[var(--border)] safe-bottom">
      <div className="flex items-center justify-around h-14">
        {NAV.map(({ href, icon: Icon, label }) => {
          const resolvedHref = typeof href === "function" ? href() : href;
          const active =
            label === "Log"
              ? pathname.startsWith("/day")
              : pathname.startsWith(resolvedHref);

          return (
            <Link
              key={label}
              href={resolvedHref}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-0.5",
                "transition-colors touch-manipulation",
                active ? "text-[var(--accent)]" : "text-[var(--muted-fg)]"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
