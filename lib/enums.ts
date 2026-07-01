/**
 * Explicit TypeScript enums matching prisma/schema.prisma exactly.
 * We declare these independently of the generated @prisma/client so that:
 *   1. The project type-checks before/without `prisma generate` running
 *   2. Server Components can use them without importing the Prisma runtime
 *
 * Keep in sync with prisma/schema.prisma whenever enums change.
 */

export type Branch =
  | "CSE" | "ECE" | "ME" | "CE" | "EE" | "IT" | "CHEMICAL" | "OTHER";

export type Role = "STUDENT" | "ADMIN";

export type ExamCategory =
  | "GATE" | "PSU" | "CAT" | "PLACEMENT"
  | "CUET_PG" | "ESE" | "GRE" | "TOEFL" | "IELTS"
  | "ISRO" | "DRDO" | "BARC";

export type ResourceType =
  | "NOTES" | "FORMULA_SHEET" | "BOOK" | "PDF" | "LINK";

export type CompanyType = "PSU" | "PLACEMENT";

export type ProgressStatus = "VIEWED" | "IN_PROGRESS" | "COMPLETED";

export type ProgressContentType =
  | "RESOURCE" | "PYQ" | "VIDEO" | "ROADMAP_STEP" | "EXAM";

// ── Phase 2 enums ─────────────────────────────────────────────────────────────

export type ApplicationStatus =
  | "APPLIED" | "OA_CLEARED" | "INTERVIEW_SCHEDULED" | "SELECTED" | "REJECTED";

export type InternshipMode = "REMOTE" | "HYBRID" | "ONSITE";

export type HigherStudyType = "MTECH" | "MS" | "MBA" | "PHD";

export type ScholarshipCategory = "GOVERNMENT" | "PRIVATE" | "INTERNATIONAL";

export type NotificationType =
  | "EXAM_UPDATE" | "DEADLINE_ALERT" | "NEW_RESOURCE"
  | "MOCK_TEST_REMINDER" | "GOAL_REMINDER" | "STREAK_ALERT";

export type BadgeSlug =
  | "FIRST_LOGIN" | "STREAK_7" | "STREAK_30" | "STREAK_100"
  | "FIRST_GOAL" | "GOAL_COMPLETE" | "FIRST_TEST" | "TEST_MASTER"
  | "STUDY_100H" | "RESOURCE_50" | "LEADERBOARD_TOP10";
