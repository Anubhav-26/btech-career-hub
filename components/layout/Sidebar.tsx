"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Target,
  GraduationCap,
  Trophy,
  LineChart,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/study", label: "Study Tracker", icon: LineChart },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/placements", label: "Placements", icon: GraduationCap },
  { href: "/internships", label: "Internships", icon: BookOpen },
  { href: "/psu", label: "PSU Hub", icon: Trophy },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

const bottomItems = [
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname() || "";

  return (
    <aside className="hidden h-[calc(100vh-3.5rem)] w-64 flex-col border-r border-border bg-surface/60 backdrop-blur md:fixed md:left-0 md:top-14 md:flex">

      {/* TOP NAV */}
      <div className="flex-1 overflow-y-auto px-3 py-4">

        <p className="mb-3 px-2 text-xs font-semibold uppercase text-ink-muted">
          Navigation
        </p>

        <nav className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || pathname.startsWith(href + "/");

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-ink-muted hover:bg-muted hover:text-ink"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM SECTION */}
      <div className="border-t border-border p-3">
        <nav className="space-y-1">
          {bottomItems.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || pathname.startsWith(href + "/");

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-ink-muted hover:bg-muted hover:text-ink"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}