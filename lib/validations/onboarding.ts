import { z } from "zod";
import { branchEnum, examCategoryEnum } from "./exam";

export const onboardingSchema = z.object({
  branch: branchEnum,
  year: z.number().int().min(1).max(4),
  // Multi-select: a student can target more than one track at once
  // (e.g. GATE + Placements), see docs/02-database-schema.md §2.1.
  goals: z.array(examCategoryEnum).min(1, "Pick at least one goal"),
});

export const progressUpdateSchema = z
  .object({
    contentType: z.enum(["RESOURCE", "PYQ", "VIDEO", "ROADMAP_STEP", "EXAM"]),
    contentId: z.string().cuid(),
    status: z.enum(["VIEWED", "IN_PROGRESS", "COMPLETED"]).default("VIEWED"),
  })
  .strict();
