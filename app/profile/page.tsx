import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatBranch } from "@/lib/utils";
import { ProfileActions } from "@/components/shared/ProfileActions";
import { IndexChip } from "@/components/shared/IndexChip";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { Bookmark } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Profile" };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getServerUser();
  if (!user) redirect("/login?next=/profile");

  const savedItems = await prisma.savedItem.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      exam: { select: { slug: true, title: true } },
      resource: { select: { id: true, title: true } },
      pyq: { select: { id: true, year: true, exam: { select: { slug: true, shortTitle: true } } } },
    },
  });

  return (
    <div className="container max-w-xl py-6 md:py-8">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-xl font-semibold text-primary">
          {(user.name ?? user.email)[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-xl font-semibold">{user.name ?? "Student"}</h1>
          <p className="text-sm text-ink-muted">{user.email}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {user.branch && <IndexChip>{formatBranch(user.branch)}</IndexChip>}
        {user.year && <IndexChip>Year {user.year}</IndexChip>}
        {user.goals.map((g) => (
          <IndexChip key={g}>{g}</IndexChip>
        ))}
      </div>

      <ProfileActions />

      <div className="mt-10">
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-muted">Saved items</h2>
        {savedItems.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="Nothing saved yet"
            description="Bookmark exams, notes, or PYQs and they'll show up here."
          />
        ) : (
          <Card>
            <CardContent className="divide-y divide-border p-0">
              {savedItems.map((item) => {
                const label = item.exam?.title ?? item.resource?.title ?? (item.pyq ? `${item.pyq.exam.shortTitle} ${item.pyq.year} PYQ` : "Saved item");
                const href = item.exam
                  ? `/exam/${item.exam.slug}`
                  : item.resource
                    ? `/resources?resourceId=${item.resource.id}`
                    : item.pyq
                      ? `/exam/${item.pyq.exam.slug}?tab=pyqs`
                      : "/resources";
                return (
                  <Link key={item.id} href={href} className="block px-4 py-3 text-sm hover:bg-muted">
                    {label}
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
