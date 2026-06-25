# 1. Product Architecture

## 1.1 What this product is

B.Tech Career Hub is a mobile-first web app that turns "what do I do after my B.Tech?" into a guided plan. An Indian engineering student lands, tells the app their branch/year/goal once, and from then on the dashboard, search, and exam pages are filtered through that lens. Four tracks ship in the MVP — **GATE, PSU recruitment, CAT, and Placements** — modeled generically enough that CUET PG, ESE, GRE, TOEFL, IELTS, ISRO, DRDO, and BARC are config rows, not new code paths.

## 1.2 Design decision: one `Exam` model, not four

The biggest architectural fork was whether GATE, PSU, CAT, and Placements should be four separate domain models (since they're so different — PSU has recruiting companies, Placements has DSA roadmaps, CAT has sectional cutoffs) or one polymorphic `Exam` model with a `category` enum and a `metadata Json` field for track-specific shape.

**Decision: one model.** Reasons:
- Every track needs the same shell — overview, eligibility, pattern, syllabus, resources, PYQs, cutoffs, videos, FAQs — so the `/exam/[slug]` route, SEO metadata, and admin form are identical regardless of track. Forking the model would mean forking the route, the page template, and the admin UI four times today and nine times once the future tracks land.
- Track-specific fields (PSU recruiting companies, CAT sectional weightage, Placement DSA roadmap) are small and bounded, so they live in a typed `metadata Json` column validated by a Zod schema keyed on `category`, instead of dozens of mostly-null columns on one giant table.
- Adding CUET PG later is an admin form submission, not a migration.

## 1.3 Design decision: Resources, PYQs, and Videos as separate models sharing one filter shape

Resources, PYQs, and Videos all get filtered by branch/exam/subject/type and all show up in the same Resource Hub grid, so it's tempting to merge them. They're kept **separate models** because their write paths differ a lot: PYQs need `year` + `session` + an optional solution file; Videos need a `youtubeId` + `channel` + `durationSeconds`; Resources need a `fileUrl` + `fileType` + `sizeBytes`. Forcing all three into one table produces a column-sparse mess. Instead, the **Resource Hub UI treats them as one unified, polymorphic list** by querying all three in parallel and merging by a shared `ResourceCard` shape — separate storage, unified presentation.

## 1.4 Design decision: Firebase Auth for identity, Postgres for everything else

Firebase Authentication (Google + email/password) is the identity provider — it's free at this scale, handles password reset/email verification out of the box, and removes the need to ever touch raw password hashes. The app **never stores a Firebase session as the source of truth for app data**: on first sign-in, a `User` row is created in Postgres keyed by `firebaseUid`, and every subsequent request is authorized against that Postgres row (role, onboarding state, progress) via a verified ID token. This keeps Prisma relations (User → UserProgress → Exam, User → SavedResource) clean and means swapping auth providers later only touches one mapping table.

## 1.5 Design decision: progress tracking is its own model, not a flag

`UserProgress` is a join row (`userId`, `resourceId | pyqId | examId`, `status`, `lastViewedAt`) rather than a boolean on the user or the resource. This is what powers "Recently Viewed," "Recommended Exams" (via a simple recency + category-match heuristic in the MVP, swappable for a real recommender later), and per-exam completion percentage on the roadmap — none of which work if progress is a flag instead of a queryable fact table.

## 1.6 Design decision: admin panel is route-protected, not a separate app

Rather than standing up a second app/deployment for admin, `/admin/*` is a route group inside the same Next.js app, gated by a `role` check in middleware. This is the right tradeoff for an MVP: one deployment, one design system, shared Prisma client — at the cost of bundling a bit of admin-only JS into the main app (mitigated with route-level code splitting, which Next.js does by default per route).

## 1.7 High-level system diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                        │
│   Next.js App Router (RSC + Client Components) · Tailwind ·     │
│   Shadcn UI · Firebase Auth SDK                                 │
└───────────────┬───────────────────────────────┬─────────────────┘
                 │ Server Actions / fetch         │ Firebase SDK
                 ▼                                 ▼
┌─────────────────────────────┐         ┌───────────────────────┐
│   Next.js API Routes          │        │   Firebase Auth        │
│   /api/exams, /api/resources, │        │   (Google + Email)     │
│   /api/search, /api/admin/*   │        │   issues ID token       │
│   - Zod validation             │◄───────┤   verified server-side │
│   - Rate limiting (Upstash)    │        └───────────────────────┘
│   - Session check via Firebase │
│     Admin SDK                  │
└───────────────┬────────────────┘
                 │ Prisma Client
                 ▼
┌─────────────────────────────┐         ┌───────────────────────┐
│   PostgreSQL (Neon/Supabase) │         │  Cloudinary / S3        │
│   Users, Exams, Resources,   │◄───────►│  Notes PDFs, formula     │
│   PYQs, Videos, Companies,   │  URLs   │  sheets, resume          │
│   Roadmaps, UserProgress     │  stored │  templates, avatars      │
└─────────────────────────────┘  in DB  └───────────────────────┘
                 │
                 ▼
        Vercel Edge/CDN (hosting, ISR cache, image optimization)
                 │
                 ▼
        Google Analytics (pageviews, search terms, conversion)
```

## 1.8 Rendering strategy

- **Marketing/landing page** — static (SSG).
- **`/exam/[slug]`** — ISR (`revalidate: 3600`). Exam content changes rarely (admin edits), so a 1-hour cache with on-demand revalidation on admin save gives near-static speed without stale data after edits.
- **`/dashboard`** — dynamic, server component, per-user (auth-gated, no caching).
- **`/resources`** — dynamic with client-side filter state; initial list is server-rendered for SEO and fast first paint, filters refine via client fetch.
- **`/admin/*`** — fully dynamic, no caching, auth-gated to `ADMIN` role.

## 1.9 Design language (token system)

Chosen deliberately against the generic "indigo-600 SaaS" default, because the audience already lives inside a visual vocabulary: OMR sheets, admit cards, roll-number grids, hall tickets. The UI borrows that vernacular instead of generic dashboard chrome.

- **Color** — `--primary: #1D4ED8` (exam-form blue, slightly desaturated so it doesn't read as a generic "link blue"), `--primary-dark: #1E3A8A`, `--accent: #F59E0B` (amber, used sparingly — deadline badges, streaks, "today" markers), `--surface: #FFFFFF` / `--surface-dark: #0B1220`, `--ink: #0F172A`, `--ink-muted: #64748B`. Dark mode is a true second palette (not just inverted opacity) — see `app/globals.css`.
- **Type** — Display/headings in **Lexend** (built for reading clarity, used by ed-tech products, distinct from the Inter/Geist default), body and UI in **Inter**, numerals/codes (roll numbers, scores, countdown timers) in **JetBrains Mono** — small but deliberate, it makes cutoff numbers and exam dates feel tabular and precise rather than decorative.
- **Signature element** — the **scorecard card**: every exam/resource card carries a small monospace index chip in the corner (`GATE·CSE`, `CAT·25`) styled like a roll-number box from an admit card, with a thin 1px rule instead of a heavy shadow. It's the one recurring motif tying dashboard, exam hub, and resource hub together — see `components/shared/IndexChip.tsx`.

Full token values live in `tailwind.config.ts` and `app/globals.css` — see Section 4 for wireframes and Section 7 for the components that implement this.
