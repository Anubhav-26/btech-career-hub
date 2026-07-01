import { z } from "zod";

// ── Feature 1: Placement Application ─────────────────────────────────────────
export const createPlacementSchema = z.object({
  companyName: z.string().min(1).max(100),
  companySlug: z.string().optional(),
  role: z.string().min(1).max(200),
  status: z.enum(["APPLIED", "OA_CLEARED", "INTERVIEW_SCHEDULED", "SELECTED", "REJECTED"]).default("APPLIED"),
  appliedAt: z.string().datetime().optional(),
  oaClearedAt: z.string().datetime().optional(),
  interviewAt: z.string().datetime().optional(),
  resultAt: z.string().datetime().optional(),
  notes: z.string().max(2000).optional(),
  ctcOffered: z.number().positive().optional(),
  jobLink: z.string().url().optional(),
});

export const updatePlacementSchema = createPlacementSchema.partial();

// ── Feature 2: Internship ────────────────────────────────────────────────────
export const createInternshipSchema = z.object({
  title: z.string().min(2).max(200),
  company: z.string().min(1).max(100),
  location: z.string().max(100).optional(),
  workMode: z.enum(["REMOTE", "HYBRID", "ONSITE"]).default("ONSITE"),
  stipendMin: z.number().nonnegative().optional(),
  stipendMax: z.number().nonnegative().optional(),
  duration: z.string().max(50).optional(),
  applyLink: z.string().url(),
  source: z.string().max(50).default("Other"),
  deadline: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
  branches: z.array(z.string()).default([]),
});

// ── Feature 3: PSU ───────────────────────────────────────────────────────────
export const createPSUSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  logoUrl: z.string().url().optional(),
  sector: z.string().min(1).max(100),
  branches: z.array(z.string()).default([]),
  minGateScore: z.number().nonnegative().optional(),
  avgSalaryLpa: z.number().positive().optional(),
  maxSalaryLpa: z.number().positive().optional(),
  selectionProcess: z.string().optional(),
  description: z.string().optional(),
  officialUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
});

export const createPSUCutoffSchema = z.object({
  psuId: z.string().cuid(),
  year: z.number().int().min(2010).max(2030),
  branch: z.string(),
  category: z.enum(["General", "OBC-NCL", "SC", "ST", "EWS"]),
  gateScore: z.number().nonnegative(),
  rank: z.number().int().positive().optional(),
});

// ── Feature 5: Scholarship ───────────────────────────────────────────────────
export const createScholarshipSchema = z.object({
  title: z.string().min(2).max(200),
  provider: z.string().min(1).max(100),
  type: z.enum(["GOVERNMENT", "PRIVATE", "INTERNATIONAL"]),
  amount: z.string().min(1).max(100),
  deadline: z.string().datetime().optional(),
  eligibility: z.string().min(10),
  applyLink: z.string().url(),
  isActive: z.boolean().default(true),
  branches: z.array(z.string()).default([]),
  description: z.string().optional(),
});

// ── Feature 6: College Predictor ─────────────────────────────────────────────
export const collegePredictorSchema = z.object({
  examType: z.enum(["GATE", "CAT"]),
  score: z.number().nonnegative(),
  category: z.enum(["General", "OBC-NCL", "SC", "ST", "EWS"]).default("General"),
  branch: z.string().optional(),
});

// ── Feature 7: Resume Builder ────────────────────────────────────────────────
export const resumeDataSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  summary: z.string().optional(),
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string(),
    branch: z.string(),
    cgpa: z.string().optional(),
    year: z.string(),
  })).default([]),
  experience: z.array(z.object({
    company: z.string(),
    role: z.string(),
    duration: z.string(),
    points: z.array(z.string()),
  })).default([]),
  projects: z.array(z.object({
    name: z.string(),
    tech: z.string(),
    points: z.array(z.string()),
    link: z.string().optional(),
  })).default([]),
  skills: z.object({
    languages: z.array(z.string()).default([]),
    frameworks: z.array(z.string()).default([]),
    tools: z.array(z.string()).default([]),
    databases: z.array(z.string()).default([]),
  }).default({}),
  achievements: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
});

export const createResumeSchema = z.object({
  title: z.string().max(100).default("My Resume"),
  template: z.enum(["FRESHER", "INTERNSHIP", "RESEARCH"]).default("FRESHER"),
  data: resumeDataSchema,
});

// ── Feature 8: AI Career Assistant ───────────────────────────────────────────
export const aiAssistantSchema = z.object({
  question: z.string().min(5).max(500),
  context: z.object({
    branch: z.string().optional(),
    year: z.number().int().min(1).max(4).optional(),
    goals: z.array(z.string()).optional(),
  }).optional(),
});

// ── Feature 9: Notifications ─────────────────────────────────────────────────
export const markNotificationReadSchema = z.object({
  ids: z.array(z.string().cuid()).min(1),
});
