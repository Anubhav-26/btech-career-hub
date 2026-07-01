import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth";

export async function requireAdmin() {
  const user = await getServerUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return user;
}