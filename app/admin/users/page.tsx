import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { UserRoleToggle } from "@/components/admin/UserRoleToggle";
import { formatBranch } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, name: true, email: true, role: true, branch: true, year: true, goals: true },
  });

  return (
    <div>
      <h1 className="font-display text-xl font-semibold">Users</h1>
      <p className="mt-1 text-sm text-ink-muted">Most recent 50 — use the API&apos;s `q` param for search at scale.</p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card text-left text-ink-muted">
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Branch / Year</th>
              <th className="px-4 py-2 font-medium">Role</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-2.5">
                  <p className="font-medium">{u.name ?? "—"}</p>
                  <p className="text-xs text-ink-muted">{u.email}</p>
                </td>
                <td className="px-4 py-2.5 text-xs text-ink-muted">
                  {u.branch ? formatBranch(u.branch) : "—"} {u.year ? `· Year ${u.year}` : ""}
                </td>
                <td className="px-4 py-2.5">
                  <Badge variant={u.role === "ADMIN" ? "accent" : "muted"}>{u.role}</Badge>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <UserRoleToggle userId={u.id} role={u.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
