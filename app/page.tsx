import Link from "next/link";
import { ArrowRight, FileSearch, ListChecks, Map, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { IndexChip } from "@/components/shared/IndexChip";

const TRACKS = [
  {
    slug: "gate-cse",
    code: "GATE·CSE",
    title: "GATE",
    blurb: "Crack the gateway to M.Tech and PSU recruitment with a structured, syllabus-mapped plan.",
    icon: ListChecks,
  },
  {
    slug: "psu",
    code: "PSU·25",
    title: "PSU Recruitment",
    blurb: "Track which PSUs hire via GATE, their cutoffs, and direct-recruitment drives.",
    icon: Building2,
  },
  {
    slug: "cat",
    code: "CAT·25",
    title: "CAT",
    blurb: "Quant, VARC and DILR prep with sectional cutoffs and previous year papers.",
    icon: FileSearch,
  },
  {
    slug: "placements",
    code: "PLC·ON",
    title: "Placements",
    blurb: "DSA roadmap, resume templates, interview questions and company-wise guides.",
    icon: Map,
  },
];

const STEPS = [
  { n: "01", title: "Tell us your branch & goal", body: "A 30-second onboarding — branch, year, and the tracks you're targeting." },
  { n: "02", title: "Get a filtered roadmap", body: "Your dashboard, search, and resource hub are all filtered through your goal." },
  { n: "03", title: "Prep with one source", body: "Syllabus, PYQs, cutoffs and lectures for every track, in one consistent layout." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero — framed like an admit card / hall ticket header */}
      <section className="border-b border-border bg-card/50">
        <div className="container grid gap-8 py-14 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <IndexChip className="mb-4">B.TECH · CAREER HUB</IndexChip>
            <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              What do I do after my B.Tech?
            </h1>
            <p className="mt-4 max-w-md text-ink-muted">
              One platform for GATE, PSU recruitment, CAT and campus placements — syllabus, PYQs,
              cutoffs and a roadmap built around your branch and year.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/signup">
                  Start your roadmap <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/exam/gate-cse">Explore GATE CSE</Link>
              </Button>
            </div>
          </div>

          {/* Signature motif blown up: a stat strip styled like an OMR scorecard */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-2">
            {[
              { label: "Tracks live", value: "04" },
              { label: "Future tracks", value: "08" },
              { label: "Resource types", value: "05" },
              { label: "Branches covered", value: "07" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-border bg-surface p-4">
                <p className="stat-number text-2xl font-semibold text-primary">{s.value}</p>
                <p className="text-xs text-ink-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section className="container py-12">
        <h2 className="font-display text-xl font-semibold">Choose your track</h2>
        <p className="mt-1 text-sm text-ink-muted">Prep for more than one — most students target two.</p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRACKS.map((t) => (
            <Link key={t.slug} href={`/exam/${t.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <t.icon className="h-5 w-5 text-primary" />
                    <IndexChip>{t.code}</IndexChip>
                  </div>
                  <CardTitle className="mt-2">{t.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{t.blurb}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works — a real 3-step sequence, so numbering is earned */}
      <section className="border-t border-border bg-card/50">
        <div className="container py-12">
          <h2 className="font-display text-xl font-semibold">How it works</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n}>
                <span className="stat-number text-xs text-primary">{s.n}</span>
                <h3 className="mt-1 font-display font-medium">{s.title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-14 text-center">
        <h2 className="font-display text-2xl font-semibold">Ready to plan what&apos;s next?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
          Free to use. Takes 30 seconds to tell us your branch, year and goal.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/signup">
            Create your account <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>
    </>
  );
}
