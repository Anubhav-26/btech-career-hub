import { prisma } from "@/lib/prisma";
import { Users, BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import { getServerUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  // 🔐 AUTH CHECK (MUST HAVE)
  const user = await getServerUser();

  if (!user) redirect("/login?next=/admin");
  if (user.role !== "ADMIN") redirect("/dashboard");

  // 📊 SAFE STATS (NO CRASH IF MODEL MISSING)
  const [usersCount, resourcesCount, examsCount] = await Promise.all([
    prisma.user.count(),

    // fallback safety
    "resource" in prisma ? prisma.resource.count() : 0,
    "exam" in prisma ? prisma.exam.count() : 0,
  ]);

  const stats = [
    {
      label: "Users",
      value: usersCount,
      icon: Users,
    },
    {
      label: "Resources",
      value: resourcesCount,
      icon: BookOpen,
    },
    {
      label: "Exams",
      value: examsCount,
      icon: GraduationCap,
    },
    {
      label: "Growth",
      value: "+12%",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage users, exams, and platform analytics
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-lg border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {item.label}
                </p>
                <Icon className="h-4 w-4 text-primary" />
              </div>

              <p className="mt-2 text-2xl font-semibold">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* QUICK ACTIONS */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <h2 className="mb-2 text-sm font-semibold">Quick Actions</h2>

        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span>➕ Add Exams</span>
          <span>📚 Upload Resources</span>
          <span>👥 Manage Users</span>
          <span>📊 View Analytics</span>
        </div>
      </div>

    </div>
  );
}