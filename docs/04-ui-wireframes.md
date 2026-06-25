# 4. UI Wireframes (Mobile-First)

All wireframes are drawn at the 375px mobile baseline first, with a note on how the layout expands at `md:`/`lg:` breakpoints. Bottom navigation replaces the desktop sidebar below the `md` breakpoint; above it, navigation moves into the top `Navbar`.

## 4.1 Dashboard (`/dashboard`) — primary screen, mobile

```
┌─────────────────────────────────┐
│ ☰  B.Tech Career Hub      🔍 🌙 │  ← Navbar: logo, search icon, theme
├─────────────────────────────────┤
│  Hi Aman 👋                      │
│  CSE · 3rd Year · Goal: GATE     │  ← from onboarding
├─────────────────────────────────┤
│  YOUR ROADMAP            68%     │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░          │  ← RoadmapWidget
│  Next: Solve GATE CSE 2023 PYQ   │
│  [ Continue → ]                  │
├─────────────────────────────────┤
│  RECOMMENDED FOR YOU             │
│  ┌───────────┐ ┌───────────┐    │  ← horizontal scroll
│  │ GATE·CSE  │ │ PSU·GATE  │    │     RecommendedExams,
│  │ Overview  │ │ via GATE  │    │     IndexChip in corner
│  │ Eligible  │ │ Eligible  │    │
│  └───────────┘ └───────────┘    │
├─────────────────────────────────┤
│  RECENTLY VIEWED                 │
│  • GATE CSE Syllabus PDF   2h ago│  ← RecentlyViewed list
│  • CAT Quant Formula Sheet 1d ago│
│  • DSA Roadmap — Step 4    2d ago│
├─────────────────────────────────┤
│  UPCOMING EXAMS                  │
│  GATE 2027        Feb · 142 days │
│  CAT 2026          Nov · 38 days │
└─────────────────────────────────┘
│  🏠    📚    🔍    🎯    👤      │  ← BottomNav: Home, Resources,
└─────────────────────────────────┘    Search, Placements, Profile
```

**md+ expansion:** roadmap + recommended exams move into a 2-column grid; bottom nav disappears, replaced by the persistent top `Navbar` with inline links; recently-viewed and upcoming-exams become a right-hand sidebar (3-column layout: roadmap | recommended | sidebar).

## 4.2 Onboarding (`/onboarding`) — 3-step, mobile

```
┌─────────────────────────────────┐
│  ●○○                       Skip │  ← step indicator
│                                   │
│  What's your branch?             │
│                                   │
│  ◻ Computer Science (CSE)        │
│  ◻ Electronics (ECE)             │
│  ◻ Mechanical (ME)               │
│  ◻ Civil (CE)                    │
│  ◻ Electrical (EE)               │
│  ◻ Information Technology (IT)   │
│  ◻ Chemical                      │
│  ◻ Other                         │
│                                   │
│           [ Continue → ]         │
└─────────────────────────────────┘
```
Step 2 asks year (1st–4th), step 3 asks goal as large tappable cards (GATE / PSU / CAT / Placements, each with a one-line description) — goal selection is multi-select since many students prep for more than one track simultaneously.

## 4.3 Exam Hub (`/exam/[slug]`) — e.g. `/exam/gate-cse`, mobile

```
┌─────────────────────────────────┐
│ ←  GATE·CSE              ⭐ Save │
│  Graduate Aptitude Test —        │
│  Computer Science                │
├─────────────────────────────────┤
│ [Overview][Eligibility][Pattern] │  ← ExamTabs, horizontal scroll,
│ [Syllabus][Resources][PYQs]      │     sticky on scroll
│ [Cutoffs][Videos][FAQs]          │
├─────────────────────────────────┤
│  (tab content area)              │
│                                   │
│  Overview tab:                   │
│  GATE CSE tests core CS/IT       │
│  fundamentals for M.Tech         │
│  admission and PSU recruitment.  │
│                                   │
│  Key facts                       │
│  ┌─────────┐┌─────────┐         │
│  │ 65 Qs   ││ 100     │         │
│  │ Total   ││ Marks   │         │  ← stat chips, mono numerals
│  └─────────┘└─────────┘         │
└─────────────────────────────────┘
│  🏠    📚    🔍    🎯    👤      │
└─────────────────────────────────┘
```

**md+ expansion:** tabs become a left-hand sticky vertical nav (like a documentation sidebar), content area widens to a readable max-width column, key-facts chips arrange in a 4-up grid instead of wrapping.

## 4.4 Resource Hub (`/resources`) — mobile

```
┌─────────────────────────────────┐
│ ←  Resources               🔍   │
├─────────────────────────────────┤
│ [Branch ▾][Exam ▾][Subject ▾]   │  ← ResourceFilters, horizontal
│ [Type ▾]                         │     scroll chip-style selects
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ GATE·CSE          [Notes]   │ │  ← ResourceCard: IndexChip +
│ │ Operating Systems Notes      │ │     type badge, title, meta
│ │ 24 pages · PDF · 1.2k saves  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ CAT                [PYQ]    │ │
│ │ CAT 2023 Quant — Slot 2      │ │
│ │ with solutions                │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
│  🏠    📚    🔍    🎯    👤      │
└─────────────────────────────────┘
```

**md+ expansion:** filters move to a persistent left sidebar (checkboxes instead of dropdown chips), resource grid becomes 3-column.

## 4.5 Admin Panel (`/admin`) — desktop-first (internal tool, not mobile-optimized)

```
┌──────────┬──────────────────────────────────────────┐
│ Admin     │  Exams                        [+ New Exam]│
│ ───────── │  ┌────────────────────────────────────┐  │
│ Overview  │  │ Slug         Category   Active  ⋮   │  │
│ Exams     │  │ gate-cse     GATE       ●        ⋮   │  │
│ Resources │  │ cat          CAT        ●        ⋮   │  │
│ Users     │  │ placements   PLACEMENT  ●        ⋮   │  │
│           │  │ cuet-pg      CUET_PG    ○        ⋮   │  │
│           │  └────────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────┘
```
Admin remains usable on mobile (forms stack, table becomes cards) but is not the primary design target — it's an internal tool used by 1–2 people, so desktop-first here is the correct tradeoff against the mobile-first rule for student-facing pages.

## 4.6 Component states to design for (all screens)

Every list-rendering component (`ExamCard` grid, `ResourceCard` grid, search results) needs three states beyond the happy path: **loading** (skeleton cards matching final layout, not a spinner), **empty** (`EmptyState` component — "No notes yet for Thermodynamics. Be the first to upload." with a CTA, not a bare "No results"), and **error** (inline retry, never a full-page crash for a single failed fetch).
