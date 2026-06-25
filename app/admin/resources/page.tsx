import { prisma } from "@/lib/prisma";
import { ResourceUploadForm } from "@/components/admin/ResourceUploadForm";
import { DeleteResourceButton } from "@/components/admin/DeleteResourceButton";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminResourcesPage() {
  const [exams, resources] = await Promise.all([
    prisma.exam.findMany({ where: { isActive: true }, select: { slug: true, shortTitle: true }, orderBy: { shortTitle: "asc" } }),
    prisma.resource.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      include: { exam: { select: { shortTitle: true } } },
    }),
  ]);

  return (
    <div>
      <h1 className="font-display text-xl font-semibold">Resources</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Upload notes, formula sheets, PYQs, and lecture videos against an existing exam slug.
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[380px_1fr]">
        <ResourceUploadForm exams={exams} />

        <div>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-muted">Recently added</h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-card text-left text-ink-muted">
                  <th className="px-4 py-2 font-medium">Title</th>
                  <th className="px-4 py-2 font-medium">Exam</th>
                  <th className="px-4 py-2 font-medium">Type</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {resources.map((r) => (
                  <tr key={r.id} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-2.5">
                      <p className="font-medium">{r.title}</p>
                      <p className="text-xs text-ink-muted">{r.subject}</p>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-ink-muted">{r.exam.shortTitle}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant="outline">{r.type.replace("_", " ")}</Badge>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <DeleteResourceButton id={r.id} />
                    </td>
                  </tr>
                ))}
                {resources.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-ink-muted">
                      No resources uploaded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
