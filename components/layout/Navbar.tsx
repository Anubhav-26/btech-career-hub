"use client";

import Link from "next/link";
import {
  GraduationCap,
  Bell,
  Trophy,
  ChevronDown,
} from "lucide-react";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SearchBar } from "@/components/search/SearchBar";
import { useAuth } from "@/hooks/useAuth";
import { useState, useRef, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/* ───────────────────────────────
   NAV STRUCTURE
─────────────────────────────── */
const NAV_GROUPS = [
  {
    label: "Prepare",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/resources", label: "Resources" },
      { href: "/study", label: "Study Tracker" },
      { href: "/goals", label: "Goals" },
      { href: "/leaderboard", label: "Leaderboard" },
    ],
  },
  {
    label: "Careers",
    links: [
      { href: "/placements", label: "Placements" },
      { href: "/internships", label: "Internships" },
      { href: "/psu", label: "PSU Hub" },
      { href: "/higher-studies", label: "Higher Studies" },
    ],
  },
  {
    label: "Tools",
    links: [
      { href: "/college-predictor", label: "College Predictor" },
      { href: "/resume-builder", label: "Resume Builder" },
      { href: "/scholarships", label: "Scholarships" },
      { href: "/ai-assistant", label: "AI Assistant ✨" },
    ],
  },
];

/* ───────────────────────────────
   DROPDOWN
─────────────────────────────── */
function NavDropdown({
  label,
  links,
}: {
  label: string;
  links: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname() || "";

  const active = useMemo(
    () => links.some((l) => pathname.startsWith(l.href)),
    [pathname, links]
  );

  useEffect(() => {
    const handleClose = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClose);
    return () => document.removeEventListener("mousedown", handleClose);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1 text-sm font-medium transition-colors hover:text-ink",
          active ? "text-primary" : "text-ink-muted"
        )}
      >
        {label}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-44 rounded-lg border border-border bg-surface shadow-lg">
          {links.map((l) => {
            const isActive = pathname.startsWith(l.href);

            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-3 py-2 text-sm transition-colors hover:bg-muted",
                  isActive
                    ? "font-medium text-primary"
                    : "text-ink-muted"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────────────
   MAIN NAVBAR
─────────────────────────────── */
export function Navbar() {
  const { firebaseUser } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
      <div className="container flex h-14 items-center justify-between gap-4">

        {/* LOGO */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-display font-semibold"
        >
          <GraduationCap className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline">
            B.Tech Career Hub
          </span>
        </Link>

        {/* NAV */}
        <nav className="hidden items-center gap-1 text-sm font-medium text-ink-muted lg:flex">
          {NAV_GROUPS.map((g) => (
            <NavDropdown
              key={g.label}
              label={g.label}
              links={g.links}
            />
          ))}
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2">

          <div className="hidden w-56 lg:block">
            <SearchBar compact />
          </div>

          {firebaseUser && (
            <>
              <Link
                href="/notifications"
                className="hidden items-center text-ink-muted transition hover:text-primary sm:flex"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
              </Link>

              <Link
                href="/achievements"
                className="hidden items-center text-ink-muted transition hover:text-amber-500 sm:flex"
                title="Achievements"
              >
                <Trophy className="h-5 w-5" />
              </Link>
            </>
          )}

          <ThemeToggle />
        </div>

      </div>
    </header>
  );
}