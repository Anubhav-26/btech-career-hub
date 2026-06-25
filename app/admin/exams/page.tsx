import { prisma } from "@/lib/prisma";
import { ExamForm } from "@/components/admin/ExamForm";
import { ExamRowActions } from "@/components/admin/ExamRowActions";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminExamsPage() {
  const exams = await prisma.exam.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, slug: true, title: true, category: true, isActive: true, _count: { select: { resources: true, pyqs: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold">Exams</h1>
        <ExamForm />
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card text-left text-ink-muted">
              <th className="px-4 py-2 font-medium">Slug</th>
              <th className="px-4 py-2 font-medium">Category</th>
              <th className="px-4 py-2 font-medium">Content</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-2.5">
                  <p className="font-medium">{exam.title}</p>
                  <p className="stat-number text-xs text-ink-muted">{exam.slug}</p>
                </td>
                <td className="px-4 py-2.5">
                  <Badge variant="outline">{exam.category}</Badge>
                </td>
                <td className="stat-number px-4 py-2.5 text-xs text-ink-muted">
                  {exam._count.resources} res · {exam._count.pyqs} pyq
                </td>
                <td className="px-4 py-2.5">
                  <span className={`inline-block h-2 w-2 rounded-full ${exam.isActive ? "bg-primary" : "bg-muted"}`} />
                  <span className="ml-1.5 text-xs text-ink-muted">{exam.isActive ? "Active" : "Inactive"}</span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <ExamRowActions slug={exam.slug} isActive={exam.isActive} />
                </td>
              </tr>
            ))}
            {exams.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                  No exams yet — create the first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
