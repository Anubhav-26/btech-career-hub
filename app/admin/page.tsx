import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [totalUsers, totalExams, totalResources, totalPyqs, totalVideos, weeklyActive] = await Promise.all([
    prisma.user.count(),
    prisma.exam.count({ where: { isActive: true } }),
    prisma.resource.count(),
    prisma.pYQ.count(),
    prisma.video.count(),
    prisma.userProgress.findMany({ where: { lastViewedAt: { gte: weekAgo } }, distinct: ["userId"] }),
  ]);

  const stats = [
    { label: "Students", value: totalUsers },
    { label: "Active exams", value: totalExams },
    { label: "Resources", value: totalResources },
    { label: "PYQs", value: totalPyqs },
    { label: "Videos", value: totalVideos },
    { label: "Active this week", value: weeklyActive.length },
  ];

  return (
    <div>
      <h1 className="font-display text-xl font-semibold">Overview</h1>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="stat-number text-2xl font-semibold text-primary">{s.value}</p>
              <p className="text-xs text-ink-muted">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
