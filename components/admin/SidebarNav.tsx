"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Building2,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  {
    group: "Core",
    links: [
      { href: "/admin", label: "Overview", icon: LayoutDashboard },
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/resources", label: "Resources", icon: BookOpen },
    ],
  },
  {
    group: "Phase 2",
    links: [
      { href: "/admin/psu", label: "PSU Management", icon: Building2 },
      { href: "/admin/internships", label: "Internships", icon: Briefcase },
      { href: "/admin/scholarships", label: "Scholarships", icon: GraduationCap },
    ],
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-4">

      {items.map((section) => (
        <div key={section.group} className="flex flex-col gap-1">

          {/* Section Label */}
          <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {section.group}
          </p>

          {/* Links */}
          {section.links.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

        </div>
      ))}

    </nav>
  );
}