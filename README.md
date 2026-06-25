# B.Tech Career Hub

A mobile-first platform that helps Indian B.Tech students plan what comes after graduation —
GATE, PSU recruitment, CAT, and campus placements today; CUET PG, ESE, GRE, TOEFL, IELTS, ISRO,
DRDO, and BARC are config rows away (see `docs/01-architecture.md` §1.2).

**Full design rationale lives in `docs/`** — read these before changing architecture:

| Doc | Covers |
|---|---|
| `docs/01-architecture.md` | Product shape, the "one `Exam` model" decision, rendering strategy, design tokens |
| `docs/02-database-schema.md` | Why each model/relationship/index exists |
| `docs/03-folder-structure.md` | Where things live and why |
| `docs/04-ui-wireframes.md` | Mobile-first layouts for every major screen |
| `docs/05-api-endpoints.md` | Every route, auth requirement, and the rate-limit policy |

## 1. Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · Shadcn-style primitives · PostgreSQL · Prisma
· Firebase Authentication (Google + email) · Cloudinary (file storage) · Upstash Redis (rate
limiting) · Vercel (hosting) · Google Analytics.

## 2. Local setup

```bash
git clone <this-repo>
cd btech-career-hub
npm install
cp .env.example .env       # fill in the values described below
npx prisma migrate dev      # creates tables from prisma/schema.prisma
npx prisma db seed          # loads GATE CSE, PSU, CAT, Placements with sample content
npm run dev                 # http://localhost:3000
```

### 2.1 Provisioning the services `.env` needs

**PostgreSQL** — any Postgres works locally (`brew install postgresql` / Docker). For hosted
Postgres, [Neon](https://neon.tech) or [Supabase](https://supabase.com) both have a generous free
tier and give you a ready-made `DATABASE_URL`.

**Firebase Authentication**
1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Authentication → Sign-in method → enable **Google** and **Email/Password**.
3. Project settings → General → "Your apps" → add a Web app → copy the six `NEXT_PUBLIC_FIREBASE_*` values.
4. Project settings → Service accounts → Generate new private key → this JSON gives you
   `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, and `FIREBASE_ADMIN_PRIVATE_KEY`
   (keep the `\n` characters in the private key literal — `lib/firebase/admin.ts` un-escapes them).

**Cloudinary** — sign up free at [cloudinary.com](https://cloudinary.com), copy the Cloud Name,
API Key, and API Secret from the dashboard home page into `CLOUDINARY_*`.

**Upstash Redis** (rate limiting) — create a free Redis database at
[console.upstash.com](https://console.upstash.com), copy the REST URL and token. **Optional in
local dev**: `lib/rate-limit.ts` no-ops if these are unset, so you can skip this for local work.

**Google Analytics** — create a GA4 property, copy the Measurement ID (`G-XXXXXXX`) into
`NEXT_PUBLIC_GA_MEASUREMENT_ID`. Optional — `components/providers/Analytics.tsx` renders nothing
if unset.

**`SUPER_ADMIN_EMAILS`** — comma-separated emails that get `role: ADMIN` automatically on their
first sign-in (see `app/api/auth/session/route.ts`). This is the *only* way an account becomes an
admin without already being promoted by an existing admin — set this before you sign up so you can
reach `/admin` at least once.

## 3. Deployment guide (Vercel)

1. **Push to GitHub** and import the repo at [vercel.com/new](https://vercel.com/new).
2. **Environment variables** — paste in everything from `.env` (Vercel project settings →
   Environment Variables). Set `NEXT_PUBLIC_APP_URL` to your production domain once you have one
   (needed for correct Open Graph URLs and the sitemap).
3. **Database** — point `DATABASE_URL` at your hosted Postgres (Neon/Supabase). Run migrations
   against production once, from your machine or a one-off CI step:
   ```bash
   DATABASE_URL="<production-url>" npx prisma migrate deploy
   DATABASE_URL="<production-url>" npx prisma db seed   # optional, sample content
   ```
4. **Build command** — Vercel auto-detects Next.js; `npm run build` already runs
   `prisma generate && next build` (see `package.json`), so the Prisma client is generated fresh
   on every deploy without an extra build step.
5. **Firebase auth domain** — add your Vercel domain (and any custom domain) to Firebase Console →
   Authentication → Settings → Authorized domains, or Google Sign-In's popup will fail in
   production.
6. **Cron / ISR** — `/exam/[slug]` pages revalidate every hour automatically (`revalidate: 3600` in
   `app/exam/[slug]/page.tsx`); admin edits call `revalidatePath()` so changes show immediately
   without waiting for that window.
7. **Custom domain + SSL** — handled by Vercel once you add the domain in project settings; no
   extra config needed.

### 3.1 Post-deploy checklist
- [ ] Sign up with an email in `SUPER_ADMIN_EMAILS`, confirm you land on `/admin` without a redirect loop.
- [ ] Create or seed at least the four MVP exams so `/exam/gate-cse`, `/exam/cat`, etc. aren't 404s.
- [ ] Visit `/sitemap.xml` and `/robots.txt` to confirm they render (both are dynamic routes, not static files).
- [ ] Upload one resource end-to-end through `/admin/resources` to confirm the Cloudinary signature flow works in production (it's a different domain than `localhost`, so CORS/signature timestamps are worth a real check).

## 4. Known MVP limitations (by design, not oversight)

- **Admin metadata editing** uses a raw JSON textarea (`components/admin/ExamForm.tsx`) rather than
  a generated per-category form — the server still validates it against the right Zod schema either
  way; a richer UI is a pure frontend addition later.
- **Cutoffs and FAQs** are seeded/managed via `prisma/seed.ts` or Prisma Studio for now — no admin
  UI yet. Same data shape as resources, so the CRUD pattern in `app/admin/resources/page.tsx` is a
  direct template for it.
- **Search** uses Postgres `ILIKE` (see `services/searchService.ts`), which is fine at MVP scale.
  Swap the query bodies for a `tsvector` column or Algolia/Meilisearch if/when it becomes a
  bottleneck — the API contract (`GET /api/search`) doesn't change either way.
- **Session cookie** holds the raw Firebase ID token (~1 hour expiry, refreshed automatically by
  `hooks/useAuth.tsx` on every token refresh). A production hardening pass could swap this for a
  Firebase **session cookie** (`admin.auth().createSessionCookie()`, multi-day expiry) — noted in
  `lib/auth.ts`.

## 5. Future roadmap

**New tracks (no schema changes needed — see docs/01 §1.2):** CUET PG, ESE, GRE, TOEFL, IELTS,
ISRO, DRDO, BARC. Each is: an admin creates an `Exam` row with that `category`, fills the content
shell, and it appears in search, the resource hub, and recommendations immediately.

**Product depth, roughly in priority order:**
1. **Mock test engine** — timed, auto-graded practice tests per exam, building on the existing
   `PYQ` model (a `MockTest` + `MockTestAttempt` model pair would slot in next to it).
2. **Smarter recommendations** — today's "recommended exams" is a recency + goal-match heuristic
   (`services/examService.ts::recommendExamsForUser`); a real model trained on `UserProgress`
   engagement data is a natural v2.
3. **Push/email notifications** — exam date reminders, new resource alerts for a saved exam,
   roadmap nudges. Needs a notifications model + a scheduled job (Vercel Cron or a small worker).
4. **Peer features** — leaderboards on roadmap completion, study groups per college, doubt-solving
   threads per subject.
5. **Native mobile app** — the API layer (`app/api/*`) is already a clean JSON contract decoupled
   from the Next.js frontend, so a React Native or Flutter client can reuse it directly without
   backend changes.
6. **Premium tier** — paid mock tests, 1:1 mentorship booking, or detailed analytics, gated by a
   `subscriptionTier` field on `User` plus a payments integration (Razorpay, given the target
   market).
7. **Multi-language support** — Hindi and regional-language UI for tier-2/3 college reach, via
   `next-intl` or similar, since the content model (plain-text fields) doesn't need to change.
8. **Richer admin metadata forms** and **dedicated cutoff/FAQ CRUD UI** — see §4 above.
