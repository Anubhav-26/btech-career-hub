"use client";

import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CutoffTable } from "@/components/exam/CutoffTable";
import { FaqAccordion } from "@/components/exam/FaqAccordion";
import { ResourceCard } from "@/components/resource/ResourceCard";
import type { ResourceCardItem } from "@/types";

export interface ExamTabsProps {
  overview: string;
  eligibility: string;
  examPattern: string;
  syllabus: string;
  resources: ResourceCardItem[];
  pyqs: ResourceCardItem[];
  videos: ResourceCardItem[];
  cutoffs: { id: string; year: number; category: string; value: number; unit: string }[];
  faqs: { id: string; question: string; answer: string }[];
}

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "eligibility", label: "Eligibility" },
  { value: "pattern", label: "Pattern" },
  { value: "syllabus", label: "Syllabus" },
  { value: "resources", label: "Resources" },
  { value: "pyqs", label: "PYQs" },
  { value: "cutoffs", label: "Cutoffs" },
  { value: "videos", label: "Videos" },
  { value: "faqs", label: "FAQs" },
] as const;

function ProseBlock({ text }: { text: string }) {
  return <div className="prose prose-sm max-w-none text-ink whitespace-pre-line">{text}</div>;
}

function ResourceGrid({ items, emptyLabel }: { items: ResourceCardItem[]; emptyLabel: string }) {
  if (items.length === 0) return <p className="text-sm text-ink-muted">{emptyLabel}</p>;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <ResourceCard key={item.id} item={item} />
      ))}
    </div>
  );
}

/** Sticky on scroll on mobile (horizontal chip row); becomes a left-hand
 * vertical sidebar at md+ per docs/04-ui-wireframes.md §4.3. */
export function ExamTabs(props: ExamTabsProps) {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const initialTab = TABS.some((t) => t.value === requestedTab) ? requestedTab! : "overview";

  return (
    <Tabs defaultValue={initialTab} className="md:grid md:grid-cols-[180px_1fr] md:gap-8">
      <TabsList className="sticky top-14 z-20 bg-surface md:sticky md:top-20 md:flex-col md:items-start md:border-b-0 md:border-r">
        {TABS.map((t) => (
          <TabsTrigger key={t.value} value={t.value} className="md:w-full md:justify-start md:border-b-0 md:border-l-2 md:pl-3">
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <div>
        <TabsContent value="overview"><ProseBlock text={props.overview} /></TabsContent>
        <TabsContent value="eligibility"><ProseBlock text={props.eligibility} /></TabsContent>
        <TabsContent value="pattern"><ProseBlock text={props.examPattern} /></TabsContent>
        <TabsContent value="syllabus"><ProseBlock text={props.syllabus} /></TabsContent>
        <TabsContent value="resources">
          <ResourceGrid items={props.resources} emptyLabel="No notes uploaded yet for this exam." />
        </TabsContent>
        <TabsContent value="pyqs">
          <ResourceGrid items={props.pyqs} emptyLabel="No previous year papers uploaded yet." />
        </TabsContent>
        <TabsContent value="cutoffs"><CutoffTable cutoffs={props.cutoffs} /></TabsContent>
        <TabsContent value="videos">
          <ResourceGrid items={props.videos} emptyLabel="No lecture videos linked yet." />
        </TabsContent>
        <TabsContent value="faqs"><FaqAccordion faqs={props.faqs} /></TabsContent>
      </div>
    </Tabs>
  );
}
