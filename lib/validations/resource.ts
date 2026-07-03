import { z } from "zod";
import { branchEnum } from "./exam";

/* =========================
   RESOURCE
========================= */

export const resourceTypeEnum = z.enum([
  "NOTES",
  "FORMULA_SHEET",
  "BOOK",
  "PDF",
  "LINK",
]);

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

/* =========================
   PYQ
========================= */

export const createPyqSchema = z.object({
  examId: z.string().cuid(),
  year: z.number().int().min(1990).max(2100),
  session: z.string().optional(),
  subject: z.string().optional(),
  questionUrl: z.string().url(),
  solutionUrl: z.string().url().optional(),
});

/* =========================
   VIDEO / PLAYLIST
========================= */

export const videoTypeEnum = z.enum([
  "VIDEO",
  "PLAYLIST",
]);

export const createVideoSchema = z
  .object({
    examId: z.string().cuid(),

    title: z.string().min(3),

    videoType: videoTypeEnum.default("VIDEO"),

    youtubeId: z
      .string()
      .regex(/^[A-Za-z0-9_-]{11}$/)
      .optional(),

    playlistId: z
      .string()
      .regex(/^[A-Za-z0-9_-]{10,}$/)
      .optional(),

    channel: z.string().min(2),

    subject: z.string().optional(),

    durationSeconds: z.number().int().positive().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.videoType === "VIDEO" && !data.youtubeId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["youtubeId"],
        message: "YouTube Video ID is required",
      });
    }

    if (data.videoType === "PLAYLIST" && !data.playlistId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["playlistId"],
        message: "Playlist ID is required",
      });
    }
  });

  export const updateVideoSchema = z.object({
  title: z.string().min(3).optional(),

  videoType: videoTypeEnum.optional(),

  youtubeId: z
    .string()
    .regex(/^[A-Za-z0-9_-]{11}$/)
    .optional(),

  playlistId: z
    .string()
    .regex(/^[A-Za-z0-9_-]{10,}$/)
    .optional(),

  channel: z.string().min(2).optional(),

  subject: z.string().optional(),

  durationSeconds: z.number().int().positive().optional(),
});