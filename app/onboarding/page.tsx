import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth";
import { OnboardingFlow } from "@/components/shared/OnboardingFlow";

export const metadata: Metadata = { title: "Set up your profile" };

export default async function OnboardingPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?next=/onboarding");

  return <OnboardingFlow />;
}
