# 2. Database Schema (Design Rationale)

The full Prisma schema is in Section 6 / `prisma/schema.prisma`. This section explains the *why* behind each model and relationship before the code.

## 2.1 Entity overview

| Model | Purpose |
|---|---|
| `User` | App-side identity, linked 1:1 to a Firebase UID. Holds onboarding answers (branch, year, goal) and role. |
| `Exam` | One row per track (GATE-CSE, CAT, Placements, PSU, and future CUET PG, ESE, GRE...). Holds the static content shell + a typed JSON `metadata` for track-specific fields. |
| `Resource` | Notes, formula sheets, books, PDFs — anything that's a file or link, scoped to an exam/branch/subject. |
| `PYQ` | Previous Year Questions, modeled separately from `Resource` because of its own fields (`year`, `session`, `hasSolution`). |
| `Video` | YouTube lecture references (`youtubeId`, `channel`, `durationSeconds`), scoped to exam/subject. |
| `Company` | Recruiters — used by both the PSU track (PSUs recruiting via GATE) and the Placement Hub (on-campus companies), distinguished by `companyType`. |
| `Roadmap` | An ordered list of `RoadmapStep`s for a given exam + goal (e.g. "GATE CSE 12-month plan", "Placement DSA roadmap") — what powers the dashboard's personalized roadmap widget. |
| `UserProgress` | Fact table: which user viewed/completed which resource, PYQ, video, or roadmap step, and when. Powers "recently viewed," completion %, and recommendations. |
| `SavedItem` | Lightweight bookmarking (separate from progress, since "saved for later" and "viewed" are different signals). |

## 2.2 Relationships

```
User 1───* UserProgress *───1 Exam
User 1───* UserProgress *───1 Resource
User 1───* UserProgress *───1 PYQ
User 1───* SavedItem
User *───1 Branch (enum, not a table — see 2.4)

Exam 1───* Resource
Exam 1───* PYQ
Exam 1───* Video
Exam 1───* Cutoff
Exam 1───* FAQ
Exam 1───* Roadmap
Exam *───* Company   (via ExamCompany join — a PSU can recruit through multiple exams' worth of context, and a company can map to many exams)

Roadmap 1───* RoadmapStep
RoadmapStep 1───* UserProgress (optional FK — a progress row can point at a step, a resource, a PYQ, or a video; see 2.5)
```

## 2.3 Why `metadata Json` instead of one wide table

GATE needs `negativeMarking: boolean`, `papers: string[]`. CAT needs `sectionalCutoffs: boolean`, `varcLrdiQuantWeightage`. Placements needs `dsaRoadmapId`, `averagePackage`. PSU needs `recruitingThroughGate: boolean`, `directRecruitment: boolean`. Putting all of these as nullable columns on `Exam` means a table where most cells are `NULL` for any given row, and every new track (ESE, ISRO, BARC) needs a migration. A `metadata Json` column, validated at the application boundary by a category-keyed Zod discriminated union (`lib/validations/exam.ts`), gets type safety in the API layer without schema churn. The tradeoff — you lose SQL-level filtering/indexing on those fields — is acceptable because nothing in the product needs to filter exams *by* sectional cutoff or *by* DSA roadmap ID; the JSON is for the exam's *own* detail page, not for cross-exam querying.

## 2.4 Why `branch` and `category` are enums, not tables

Branch (CSE, ECE, ME, CE, EE, IT, Chemical, Other) and exam category (GATE, PSU, CAT, PLACEMENT, plus the disabled-by-default future ones) are closed, slow-changing vocabularies — adding a tenth branch is a deploy, not a daily admin action. Postgres enums give cheap indexed filtering (`WHERE branch = 'CSE'`) without a join, and Prisma enums give compile-time autocomplete in the frontend filter components. If branch ever needs to become admin-editable (e.g. a college adds a niche branch), it's a straightforward migration to a lookup table — deferred until there's real demand, per YAGNI.

## 2.5 Why `UserProgress` has four nullable FKs instead of four separate tables

`UserProgress` tracks engagement with four different content types (Resource, PYQ, Video, RoadmapStep). Four separate progress tables (`ResourceProgress`, `PYQProgress`...) would mean four near-identical queries every time the dashboard needs "what did this user touch recently, across everything." One table with four nullable FKs (`resourceId?`, `pyqId?`, `videoId?`, `roadmapStepId?`) plus a `contentType` discriminator lets "recently viewed, mixed" be a single `ORDER BY lastViewedAt DESC LIMIT 10` query. A `CHECK` constraint (enforced at the application layer via a Zod refinement, noted in the schema comments) ensures exactly one FK is set per row.

## 2.6 Indexing strategy

- `Exam.slug` — unique index, it's the primary lookup for `/exam/[slug]`.
- `Exam.category` — index, used by dashboard's "recommended exams for your goal."
- `Resource(examId, branch, subject, type)` — composite index, matches the Resource Hub's exact filter combination.
- `PYQ(examId, year)` — composite index for the PYQ archive view sorted by year.
- `User.firebaseUid` — unique index, the auth lookup happens on every authenticated request.
- `UserProgress(userId, lastViewedAt)` — composite index for the "recently viewed" dashboard query.
- `Company.companyType` — index, separates PSU-list rendering from Placement-list rendering.

## 2.7 Soft launch fields for future tracks

`Exam.category` enum already includes `CUET_PG`, `ESE`, `GRE`, `TOEFL`, `IELTS`, `ISRO`, `DRDO`, `BARC` alongside the four live ones. Nothing in the schema needs to change to light one up — an admin creates the `Exam` row for, say, `CUET_PG` with `isActive: true` (the column's default) and content shows up immediately; no deploy required. The four MVP tracks are simply the only rows that exist at launch, not a separately-flagged subset.
