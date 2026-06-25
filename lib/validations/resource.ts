import { z } from "zod";
import { branchEnum } from "./exam";

export const resourceTypeEnum = z.enum(["NOTES", "FORMULA_SHEET", "BOOK", "PDF", "LINK"]);

export const createResourceSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  type: resourceTypeEnum,
  fileUrl: z.string().url(),
  fileType: z.string().optional(),
  sizeBytes: z.number().int().positive().optional(),
  examId: z.string().cuid(),
  branch: branchEnum.nullable().optional(),
  subject: z.string().min(2),
});

export const updateResourceSchema = createResourceSchema.partial();

export const resourceQuerySchema = z.object({
  examSlug: z.string().optional(),
  branch: branchEnum.optional(),
  subject: z.string().optional(),
  type: resourceTypeEnum.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

export const createPyqSchema = z.object({
  examId: z.string().cuid(),
  year: z.number().int().min(1990).max(2100),
  session: z.string().optional(),
  subject: z.string().optional(),
  questionUrl: z.string().url(),
  solutionUrl: z.string().url().optional(),
});

export const createVideoSchema = z.object({
  examId: z.string().cuid(),
  title: z.string().min(3),
  youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/, "Invalid YouTube video ID"),
  channel: z.string().min(2),
  subject: z.string().optional(),
  durationSeconds: z.number().int().positive().optional(),
});
