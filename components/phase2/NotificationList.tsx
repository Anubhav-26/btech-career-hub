"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, BookOpen, Trophy, AlertCircle, Flame, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  href?: string;
  createdAt: string;
}

const ICONS: Record<string, typeof Bell> = {
  REMINDER: Bell,
  ACHIEVEMENT: Trophy,
  RESOURCE: BookOpen,
  EXAM_UPDATE: AlertCircle,
  STREAK: Flame,
  GENERAL: Info,
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function NotificationList({ initialNotifications }: { initialNotifications: Notification[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const { getIdToken } = useAuth();

  const unread = notifications.filter((n) => !n.isRead);

  async function markAllRead() {
    const token = await getIdToken();
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ids: [] }), // empty = mark all
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  async function markOneRead(id: string) {
    if (notifications.find((n) => n.id === id)?.isRead) return;
    const token = await getIdToken();
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ids: [id] }),
    });
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  }

  if (notifications.length === 0) {
    return <EmptyState icon={Bell} title="No notifications yet" description="You'll see exam updates, deadlines, and reminders here." />;
  }

  return (
    <div>
      {unread.length > 0 && (
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-ink-muted">{unread.length} unread</p>
          <Button variant="ghost" size="sm" onClick={markAllRead} className="h-7 gap-1 text-xs">
            <CheckCheck className="h-3.5 w-3.5" /> Mark all read
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {notifications.map((n) => {
          const Icon = ICONS[n.type] ?? Info;
          const content = (
            <Card
              key={n.id}
              onClick={() => markOneRead(n.id)}
              className={cn(
                "cursor-pointer transition-colors hover:bg-muted/40",
                !n.isRead && "border-primary/30 bg-primary/5"
              )}
            >
              <CardContent className="flex items-start gap-3 p-3">
                <div className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  !n.isRead ? "bg-primary/10" : "bg-muted"
                )}>
                  <Icon className={cn("h-4 w-4", !n.isRead ? "text-primary" : "text-ink-muted")} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium", n.isRead && "text-ink-muted")}>{n.title}</p>
                  <p className="text-xs text-ink-muted mt-0.5 line-clamp-2">{n.message}</p>
                </div>
                <span className="stat-number text-[10px] text-ink-muted shrink-0">{timeAgo(n.createdAt)}</span>
              </CardContent>
            </Card>
          );

          return n.href
            ? <Link key={n.id} href={n.href}>{content}</Link>
            : <div key={n.id}>{content}</div>;
        })}
      </div>
    </div>
  );
}
