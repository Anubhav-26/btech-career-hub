import { z } from "zod";

// ── Feature 1 & 2: Study Log ─────────────────────────────────────────────────
export const createStudyLogSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
  topic: z.string().min(1).max(200),
  subject: z.string().min(1).max(100),
  minutes: z.number().int().min(1).max(1440),
  notes: z.string().max(2000).optional(),
  examCategory: z.string().optional(),
});

// ── Feature 3: Exam Countdown (admin-create) ─────────────────────────────────
export const createCountdownSchema = z.object({
  title: z.string().min(2).max(100),
  examDate: z.string().datetime(),
  category: z.string().optional(),
  description: z.string().max(500).optional(),
  isActive: z.boolean().default(true),
  isPinnable: z.boolean().default(true),
});

// ── Feature 4: Goal ──────────────────────────────────────────────────────────
export const createGoalSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(500).optional(),
  targetValue: z.number().int().min(1).max(10000).default(100),
  currentValue: z.number().int().min(0).default(0),
  unit: z.enum(["percent", "questions", "chapters", "hours", "topics"]).default("percent"),
  deadline: z.string().datetime().optional(),
  examCategory: z.string().optional(),
});

export const updateGoalSchema = createGoalSchema.partial().extend({
  currentValue: z.number().int().min(0).optional(),
  isCompleted: z.boolean().optional(),
});

// ── Feature 5: Mock Test ─────────────────────────────────────────────────────
export const createMockTestSchema = z.object({
  examCategory: z.string().min(1),
  testName: z.string().max(200).optional(),
  score: z.number().min(0),
  totalMarks: z.number().min(1),
  takenAt: z.string().datetime().optional(),
  durationMin: z.number().int().min(1).optional(),
});

// ── Feature 6: Resource Completion ──────────────────────────────────────────
export const resourceCompletionSchema = z.object({
  resourceId: z.string().cuid(),
});

// ── Feature 7: Video Progress ────────────────────────────────────────────────
export const videoProgressSchema = z.object({
  videoId: z.string().cuid(),
  watchedSecs: z.number().int().min(0),
  isCompleted: z.boolean().default(false),
});

// ── Feature 10: AI Roadmap ───────────────────────────────────────────────────
export const aiRoadmapSchema = z.object({
  branch: z.string().min(1),
  targetExam: z.string().min(1),
  currentYear: z.number().int().min(1).max(4),
});
