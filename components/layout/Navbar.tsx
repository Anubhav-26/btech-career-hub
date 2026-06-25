"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SearchBar } from "@/components/search/SearchBar";

const desktopLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/resources", label: "Resources" },
  { href: "/placements", label: "Placements" },
  { href: "/exam/gate-cse", label: "GATE" },
  { href: "/exam/cat", label: "CAT" },
];

/** Top bar on all breakpoints; carries primary nav links from md+ where BottomNav is hidden. */
export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
      <div className="container flex h-14 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-display font-semibold">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline">B.Tech Career Hub</span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium text-ink-muted md:flex">
          {desktopLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden w-64 md:block">
            <SearchBar compact />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
