import type { Branch, ExamCategory, ResourceType } from "@prisma/client";

export interface ApiSuccess<T> {
  data: T;
}

export interface ApiListSuccess<T> {
  data: T[];
  meta: { total: number; page: number; pageSize: number };
}

export interface ApiError {
  error: { code: string; message: string };
}

/** Shared shape consumed by ResourceCard regardless of underlying model
 * (Resource, PYQ, or Video) — see docs/01-architecture.md §1.3. */
export interface ResourceCardItem {
  id: string;
  kind: "RESOURCE" | "PYQ" | "VIDEO";
  title: string;
  subtitle: string; // exam shortTitle + subject, or "Previous Year Question"
  badgeLabel: string; // "Notes", "PYQ", "Video"
  href: string;
  examShortTitle: string;
  branch?: Branch | null;
}

export interface DashboardPayload {
  recommendedExams: Array<{
    id: string;
    slug: string;
    shortTitle: string;
    category: ExamCategory;
  }>;
  roadmap: {
    id: string;
    title: string;
    percentComplete: number;
    examSlug: string;
    nextStep: { id: string; title: string } | null;
  } | null;
  recentlyViewed: Array<{
    id: string;
    title: string;
    href: string;
    viewedAt: string;
  }>;
  upcomingExams: Array<{
    id: string;
    slug: string;
    shortTitle: string;
    examDate: string;
    daysUntil: number;
  }>;
}

export interface OnboardingFormState {
  branch: Branch | null;
  year: number | null;
  goals: ExamCategory[];
}

export type ResourceFilterState = {
  examSlug?: string;
  branch?: Branch;
  subject?: string;
  type?: ResourceType;
};
