# 5. API Endpoints

All routes live under `app/api/`. Conventions: JSON in/out, Zod-validated bodies, Firebase ID token in `Authorization: Bearer <token>` for any authenticated route (Server Components instead read the `bch_session` cookie via `getServerUser()` — see §5.0), standard error shape `{ error: { code, message } }`, standard success shape `{ data: ... }` (list endpoints add `{ data, meta: { total, page, pageSize } }`).

**Implementation note:** admin mutations are NOT mirrored under a separate `/api/admin/*` namespace for resources that already have a public GET — `POST /api/exams`, `PATCH/DELETE /api/exams/[slug]` etc. live on the same route as the public read, gated by `requireAdmin()`. This is a deliberate deviation from an earlier draft of this doc: one REST resource, one route, verb-gated by role — fewer files, no risk of the two namespaces drifting apart. `/api/admin/*` is reserved for endpoints with no public equivalent at all (stats, user management, upload signing).

## 5.0 Session sync (not really a "data" endpoint)

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/session` | Body: `{ idToken }`. Verifies the token, upserts the Postgres `User` row (the one place a User row is created — see docs/01 §1.4), sets the `bch_session` + `bch_role` httpOnly cookies `middleware.ts` and `getServerUser()` read. Called automatically by `hooks/useAuth.tsx` on every Firebase auth-state/token-refresh event. |
| DELETE | `/api/auth/session` | Clears both cookies (logout). |

## 5.1 Public (no auth)

| Method | Path | Description |
|---|---|---|
| GET | `/api/exams` | List exams. Query: `category`, `branch`, `isActive` (defaults true). |
| GET | `/api/exams/[slug]` | Full exam detail — overview, eligibility, pattern, syllabus, cutoffs, FAQs, roadmaps, companies, and counts of related resources/PYQs/videos. |
| GET | `/api/resources` | List resources. Query: `examSlug`, `branch`, `subject`, `type`, `page`, `pageSize`. |
| GET | `/api/resources/[id]` | Single resource detail; increments `viewCount`. |
| GET | `/api/pyqs` | List PYQs. Query: `examSlug`, `year`, `subject`. |
| GET | `/api/videos` | List videos. Query: `examSlug`, `subject`. |
| GET | `/api/companies` | List companies. Query: `companyType` (`PSU` \| `PLACEMENT`), `examSlug`. |
| GET | `/api/search` | Global search + autocomplete. Query: `q` (min 2 chars), `limit` (default 8, max 20). Merged, ranked results across exams/resources/PYQs with a `type` discriminator per result. |

## 5.2 Authenticated (student)

All require a valid Firebase ID token, verified server-side via `requireUser()` in `lib/auth.ts`, which resolves to a Postgres `User` row.

| Method | Path | Description |
|---|---|---|
| POST | `/api/user/onboarding` | Body: `{ branch, year, goals: string[] }`. Sets `onboardedAt`. Idempotent. |
| GET / PATCH | `/api/user/me` | Current user profile / update `name`, `avatarUrl`. |
| GET | `/api/user/dashboard` | Aggregate payload: recommended exams, active roadmap + % complete, last 10 recently-viewed items, upcoming exam dates. One endpoint, not four, to avoid a waterfall on first paint — `app/dashboard/page.tsx` itself calls the same `services/dashboardService.ts` function directly for the SSR first render; this endpoint exists for client-side refetches. |
| POST | `/api/user/progress` | Body: `{ contentType: 'RESOURCE'\|'PYQ'\|'VIDEO'\|'ROADMAP_STEP'\|'EXAM', contentId, status: 'VIEWED'\|'IN_PROGRESS'\|'COMPLETED' }`. Upserts a `UserProgress` row. |
| GET / POST | `/api/user/saved` | List saved items / toggle a bookmark. Body: exactly one of `{ examId }`, `{ resourceId }`, `{ pyqId }`. |

## 5.3 Admin only (verb-gated on the resource route)

Every write below requires `role === 'ADMIN'`, checked twice: `middleware.ts` (cookie-based fast path, redirects unauthenticated/non-admin browsers away from `/admin/*` pages) and again inside the route handler via `requireAdmin()` — defense in depth, since route handlers can be hit directly regardless of what middleware does to page navigation.

| Method | Path | Description |
|---|---|---|
| POST | `/api/exams` | Create exam. Body validated by the category-keyed Zod metadata check in `lib/validations/exam.ts`. |
| PATCH | `/api/exams/[slug]` | Update exam; calls `revalidatePath('/exam/[slug]')` so the ISR cache reflects the edit immediately. |
| DELETE | `/api/exams/[slug]` | Soft-delete (`isActive: false`), preserving FK integrity with existing `UserProgress` rows. |
| POST | `/api/resources` | Create resource (file already uploaded via §5.4). |
| PATCH / DELETE | `/api/resources/[id]` | Edit / hard-delete a resource. |
| POST | `/api/pyqs` | Create PYQ. |
| PATCH / DELETE | `/api/pyqs/[id]` | Edit / delete a PYQ. |
| POST | `/api/videos` | Create video; auto-derives `thumbnailUrl` from `youtubeId`. |
| PATCH / DELETE | `/api/videos/[id]` | Edit / delete a video. |
| POST | `/api/companies` | Create a PSU/placement recruiter, optionally linked to exam slugs. |
| PATCH / DELETE | `/api/companies/[id]` | Edit / delete a company. |
| GET | `/api/admin/stats` | Dashboard counts for the admin overview page. |
| GET | `/api/admin/users` | List users with pagination + `q` search. |
| PATCH | `/api/admin/users/[id]/role` | Promote/demote a user's role. An admin can't demote their own account; the *first* admin can only ever be created via the `SUPER_ADMIN_EMAILS` allowlist at sign-in (§5.0), never through this route. |
| POST | `/api/admin/uploads/sign` | Returns a short-lived signed Cloudinary upload signature (§5.4). |

## 5.4 File upload flow

Direct uploads never proxy file bytes through the Next.js server (avoids Vercel's request body limits and serverless execution time on large PDFs). Flow:

1. Admin's browser calls `POST /api/admin/uploads/sign` (auth + admin checked) → gets `{ timestamp, signature, folder, apiKey, cloudName }`.
2. Browser uploads the file directly to `https://api.cloudinary.com/v1_1/<cloudName>/auto/upload` using that signature (see `components/admin/FileUploader.tsx`).
3. Browser then calls `POST /api/resources` (or `/api/pyqs`, `/api/videos`) with the resulting `secure_url`, which is what actually gets persisted.

## 5.5 Rate limiting

Applied via `lib/rate-limit.ts` (Upstash Redis sliding window; no-ops if Upstash env vars are unset, so local dev doesn't require Redis) on: `/api/search` (30 req/min/IP), `/api/user/progress` and `/api/user/onboarding` (auth-adjacent, 10-60 req/min), all admin writes (20 req/min/IP), and public read endpoints (100 req/min/IP — generous since they're ISR/CDN-friendly, but an unauthenticated ceiling still exists).
