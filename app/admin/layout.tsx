import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, GraduationCap, FolderOpen, Users } from "lucide-react";
import { getServerUser } from "@/lib/auth";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/exams", label: "Exams", icon: GraduationCap },
  { href: "/admin/resources", label: "Resources", icon: FolderOpen },
  { href: "/admin/users", label: "Users", icon: Users },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="container grid gap-6 py-6 md:grid-cols-[180px_1fr] md:py-8">
      <aside>
        <p className="mb-3 px-2 text-xs font-medium uppercase tracking-wide text-ink-muted">Admin</p>
        <nav className="flex gap-1 overflow-x-auto scrollbar-none md:flex-col md:overflow-visible">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex shrink-0 items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-ink-muted hover:bg-muted hover:text-ink"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
