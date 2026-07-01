"use client";

import Link from "next/link";
import { Building } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  FolderOpen,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/exams", label: "Exams", icon: GraduationCap },
  { href: "/admin/resources", label: "Resources", icon: FolderOpen },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/psu", label: "PSU Management", icon: Building },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const Icon = item.icon;

        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition",
              active
                ? "bg-primary/10 text-primary"
                : "text-ink-muted hover:bg-muted hover:text-ink"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}