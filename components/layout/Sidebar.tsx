"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  GraduationCap,
  Trophy,
  Settings,
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { cn } from "@/lib/utils";

const bottomItems = [
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

interface SidebarProps {
  role?: string;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname() || "";

  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/resources",
      label: "Resources",
      icon: BookOpen,
    },
    {
      href: "/placements",
      label: "Placements",
      icon: GraduationCap,
    },
    {
      href: "/internships",
      label: "Internships",
      icon: BookOpen,
    },
    {
      href: "/psu",
      label: "PSU Hub",
      icon: Trophy,
    },

    ...(role === "ADMIN"
      ? [
          {
            href: "/admin",
            label: "Admin Panel",
            icon: Shield,
          },
        ]
      : []),
  ];

  return (
    <aside
      className={cn(
        "hidden md:flex fixed left-0 top-14 h-[calc(100vh-3.5rem)] flex-col border-r border-border bg-surface/60 backdrop-blur transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Collapse Button */}

      <div className="flex justify-end border-b border-border p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-2 hover:bg-muted"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* TOP */}

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {!collapsed && (
          <p className="mb-3 px-2 text-xs font-semibold uppercase text-ink-muted">
            Navigation
          </p>
        )}

        <nav className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              pathname.startsWith(href + "/");

            return (
              <Link
                key={href}
                href={href}
                title={label}
                className={cn(
                  "flex items-center rounded-md py-2 text-sm transition-colors",

                  collapsed
                    ? "justify-center px-2"
                    : "gap-3 px-3",

                  active
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-ink-muted hover:bg-muted hover:text-ink"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />

                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}

      <div className="border-t border-border p-3">
        <nav className="space-y-1">
          {bottomItems.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              pathname.startsWith(href + "/");

            return (
              <Link
                key={href}
                href={href}
                title={label}
                className={cn(
                  "flex items-center rounded-md py-2 text-sm transition-colors",

                  collapsed
                    ? "justify-center px-2"
                    : "gap-3 px-3",

                  active
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-ink-muted hover:bg-muted hover:text-ink"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />

                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}