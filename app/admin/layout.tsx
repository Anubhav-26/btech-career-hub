import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth";
import { SidebarNav } from "@/components/admin/SidebarNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  // 🔒 AUTH CHECK
  if (!user) redirect("/login?next=/admin");

  // 🔒 ROLE CHECK
  if (user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background">

      <div className="container grid gap-6 py-6 md:grid-cols-[240px_1fr] md:py-8">

        {/* ───────── SIDEBAR ───────── */}
        <aside className="h-fit rounded-lg border border-border bg-surface p-4 md:sticky md:top-16">

          {/* HEADER */}
          <div className="mb-4 border-b border-border pb-3">
            <h2 className="text-sm font-semibold text-foreground">
              Admin Panel
            </h2>
            <p className="text-xs text-muted-foreground">
              Manage platform content
            </p>
          </div>

          <SidebarNav />
        </aside>

        {/* ───────── MAIN CONTENT ───────── */}
        <main className="min-w-0 rounded-lg border border-border bg-surface p-4 md:p-6 shadow-sm">

          {children}

        </main>

      </div>
    </div>
  );
}