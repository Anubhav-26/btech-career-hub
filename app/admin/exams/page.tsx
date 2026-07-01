import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ExamForm } from "@/components/admin/ExamForm";
import { ExamRowActions } from "@/components/admin/ExamRowActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminExamsPage() {
  const exams = await prisma.exam.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      isActive: true,
      _count: {
        select: {
          resources: true,
          pyqs: true,
          videos: true,
          faqs: true,
          cutoffs: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Exam Management
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage all exams and their content
          </p>
        </div>

        <ExamForm />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left">
                Exam
              </th>

              <th className="px-4 py-3 text-left">
                Category
              </th>

              <th className="px-4 py-3 text-left">
                Resources
              </th>

              <th className="px-4 py-3 text-left">
                Status
              </th>

              <th className="px-4 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {exams.map((exam) => (
              <tr
                key={exam.id}
                className="border-t transition hover:bg-muted/30"
              >
                {/* Exam */}
                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium">
                      {exam.title}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {exam.slug}
                    </p>
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 py-4">
                  <Badge variant="outline">
                    {exam.category}
                  </Badge>
                </td>

                {/* Content Count */}
                <td className="px-4 py-4">
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>📄 Resources : {exam._count.resources}</div>
                    <div>📘 PYQs : {exam._count.pyqs}</div>
                    <div>🎥 Videos : {exam._count.videos}</div>
                    <div>❓ FAQs : {exam._count.faqs}</div>
                    <div>📊 Cutoffs : {exam._count.cutoffs}</div>
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-4">
                  <Badge
                    variant={
                      exam.isActive
                        ? "default"
                        : "muted"
                    }
                  >
                    {exam.isActive
                      ? "Active"
                      : "Inactive"}
                  </Badge>
                </td>

                {/* Actions */}
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                    >
                      <Link href={`/admin/exams/${exam.id}`}>
                        Manage
                      </Link>
                    </Button>

                    <ExamRowActions
                      slug={exam.slug}
                      isActive={exam.isActive}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {exams.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-muted-foreground"
                >
                  No exams found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}