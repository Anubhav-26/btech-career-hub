import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export const metadata: Metadata = { title: "Higher Studies Hub" };

const PATHS = [
  {
    degree: "M.Tech",
    exams: ["GATE"],
    blurb: "Specialised engineering degrees at IITs, NITs, and IIITs. GATE score is the primary admission criterion.",
    examHref: "/exam/gate-cse",
    colleges: ["IIT Bombay", "IIT Delhi", "IIT Madras", "NIT Trichy", "BITS Pilani"],
    eligibility: "B.Tech/B.E. in relevant discipline",
    strategy: "Target GATE score > 700 for IITs. Focus on core CS/ECE subjects from 3rd year.",
  },
  {
    degree: "MBA",
    exams: ["CAT", "GMAT"],
    blurb: "Business management degree. CAT for IIMs, GMAT for global and private B-schools.",
    examHref: "/exam/cat",
    colleges: ["IIM Ahmedabad", "IIM Bangalore", "IIM Calcutta", "XLRI", "FMS Delhi"],
    eligibility: "Any bachelor's degree with min 50% marks",
    strategy: "Start CAT prep in 3rd year. Aim for 99+ percentile for top IIMs.",
  },
  {
    degree: "MS (Research)",
    exams: ["GATE", "GRE"],
    blurb: "Research-focused degree. GATE for Indian universities, GRE + TOEFL for foreign universities.",
    examHref: "/exam/gate-cse",
    colleges: ["IITs (via GATE)", "IISC Bangalore", "Stanford", "MIT", "CMU"],
    eligibility: "B.Tech with strong academic record",
    strategy: "Build a research profile. Publish papers or do research internships.",
  },
  {
    degree: "PhD",
    exams: ["GATE", "CSIR NET"],
    blurb: "Doctoral degree with full scholarship at IITs/IISc. Leads to research and academic careers.",
    examHref: "/exam/gate-cse",
    colleges: ["IISc Bangalore", "IITs", "TIFR", "IISER"],
    eligibility: "B.Tech or M.Tech in relevant field",
    strategy: "Contact professors early. Get research experience during B.Tech.",
  },
];

export default function HigherStudiesPage() {
  return (
    <div className="container py-6 md:py-8">
      <div className="flex items-center gap-2 mb-1">
        <GraduationCap className="h-6 w-6 text-primary" />
        <h1 className="font-display text-2xl font-semibold">Higher Studies Hub</h1>
      </div>
      <p className="text-sm text-ink-muted mb-6">
        M.Tech, MBA, MS, and PhD — eligibility, exams, colleges, and prep strategy in one place.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {PATHS.map((path) => (
          <Card key={path.degree} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-display">{path.degree}</CardTitle>
              <CardDescription>{path.blurb}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-muted mb-1">Exams</p>
                <div className="flex gap-2">
                  {path.exams.map((e) => (
                    <Link key={e} href={path.examHref} className="rounded-full border border-primary/40 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/10">
                      {e}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-muted mb-1">Top Colleges</p>
                <p className="text-xs text-ink-muted">{path.colleges.join(", ")}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-muted mb-1">Eligibility</p>
                <p className="text-xs text-ink-muted">{path.eligibility}</p>
              </div>
              <div className="mt-auto rounded-md bg-muted/50 p-2.5">
                <p className="text-xs font-medium mb-0.5">Prep tip</p>
                <p className="text-xs text-ink-muted">{path.strategy}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
