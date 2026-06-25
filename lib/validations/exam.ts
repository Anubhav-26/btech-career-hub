import { z } from "zod";

export const branchEnum = z.enum(["CSE", "ECE", "ME", "CE", "EE", "IT", "CHEMICAL", "OTHER"]);

export const examCategoryEnum = z.enum([
  "GATE",
  "PSU",
  "CAT",
  "PLACEMENT",
  "CUET_PG",
  "ESE",
  "GRE",
  "TOEFL",
  "IELTS",
  "ISRO",
  "DRDO",
  "BARC",
]);

/**
 * Track-specific metadata, keyed by category. This is what makes the single
 * Exam.metadata Json column type-safe at the API boundary instead of an
 * untyped blob — see docs/02-database-schema.md §2.3.
 * Tracks without a specific shape yet (the "future" ones) fall through to
 * `genericMetadataSchema`, an empty-but-extensible object, so admins can
 * already create those Exam rows ahead of a dedicated UI being built.
 */
const gateMetadataSchema = z.object({
  negativeMarking: z.boolean(),
  papers: z.array(z.string()), // e.g. ["CS", "DA"] for joint papers
  totalMarks: z.number(),
  numQuestions: z.number(),
});

const catMetadataSchema = z.object({
  sectionalCutoffs: z.boolean(),
  sections: z.array(
    z.object({ name: z.string(), weightagePercent: z.number() })
  ),
  totalMarks: z.number(),
});

const psuMetadataSchema = z.object({
  recruitsViaGate: z.boolean(),
  directRecruitment: z.boolean(),
  typicalPackageLpa: z.number().optional(),
});

const placementMetadataSchema = z.object({
  dsaRoadmapId: z.string().optional(),
  averagePackageLpa: z.number().optional(),
  topRecruiterCount: z.number().optional(),
});

const genericMetadataSchema = z.record(z.string(), z.unknown()).default({});

export const examMetadataSchema = z.union([
  gateMetadataSchema,
  catMetadataSchema,
  psuMetadataSchema,
  placementMetadataSchema,
  genericMetadataSchema,
]);

/** Picks the right metadata schema for a given category at parse time. */
export function metadataSchemaForCategory(category: z.infer<typeof examCategoryEnum>) {
  switch (category) {
    case "GATE":
      return gateMetadataSchema;
    case "CAT":
      return catMetadataSchema;
    case "PSU":
      return psuMetadataSchema;
    case "PLACEMENT":
      return placementMetadataSchema;
    default:
      return genericMetadataSchema;
  }
}

const examBaseObjectSchema = z.object({
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase, alphanumeric, and hyphen-separated"),
  title: z.string().min(3),
  shortTitle: z.string().min(2),
  category: examCategoryEnum,
  branch: branchEnum.nullable().optional(),
  isActive: z.boolean().default(true),
  overview: z.string().min(10),
  eligibility: z.string().min(10),
  examPattern: z.string().min(10),
  syllabus: z.string().min(10),
  metadata: z.record(z.string(), z.unknown()).default({}),
  examDate: z.string().datetime().nullable().optional(),
  applicationDeadline: z.string().datetime().nullable().optional(),
  coverImageUrl: z.string().url().nullable().optional(),
});

function refineMetadataAgainstCategory(
  data: { category: z.infer<typeof examCategoryEnum>; metadata: Record<string, unknown> },
  ctx: z.RefinementCtx
) {
  const schema = metadataSchemaForCategory(data.category);
  const result = schema.safeParse(data.metadata);
  if (!result.success) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["metadata"],
      message: `metadata does not match the shape required for category ${data.category}: ${result.error.message}`,
    });
  }
}

export const createExamSchema = examBaseObjectSchema.superRefine(refineMetadataAgainstCategory);

// .partial() must run on the plain ZodObject — ZodEffects (the
// .superRefine() wrapper) has no .partial() method. PATCH only validates
// metadata against the category when BOTH fields are present in the same
// request; if an admin patches metadata without category in the body,
// the existing row's category isn't known here, so full cross-field
// validation happens again in the route handler after the merge.
export const updateExamSchema = examBaseObjectSchema.partial().superRefine((data, ctx) => {
  if (data.category && data.metadata) {
    refineMetadataAgainstCategory({ category: data.category, metadata: data.metadata }, ctx);
  }
});

export const examQuerySchema = z.object({
  category: examCategoryEnum.optional(),
  branch: branchEnum.optional(),
  isActive: z.coerce.boolean().optional().default(true),
});
