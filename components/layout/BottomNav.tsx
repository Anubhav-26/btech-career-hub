"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Search, Target, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/search", label: "Search", icon: Search },
  { href: "/placements", label: "Placements", icon: Target },
  { href: "/profile", label: "Profile", icon: User },
];

/** Mobile-only bottom tab bar (hidden md+, where Navbar takes over). */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface/95 backdrop-blur md:hidden">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px]",
              active ? "text-primary" : "text-ink-muted"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
