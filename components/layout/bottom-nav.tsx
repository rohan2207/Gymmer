"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, TrendingUp, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/calendar", icon: CalendarDays, label: "History" },
  { href: "/progress", icon: TrendingUp, label: "Progress" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--bg)]/95 backdrop-blur-sm border-t border-[var(--border)] safe-bottom">
      <div className="flex items-center justify-around h-14">
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
