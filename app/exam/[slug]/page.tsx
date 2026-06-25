import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getExamBySlug } from "@/services/examService";
import { listResources, listPyqs, listVideos, toResourceCardItem, toPyqCardItem, toVideoCardItem } from "@/services/resourceService";
import { ExamTabs } from "@/components/exam/ExamTabs";
import { IndexChip } from "@/components/shared/IndexChip";
import { SaveButton } from "@/components/shared/SaveButton";

export const revalidate = 3600; // ISR — exam content changes rarely, see docs/01 §1.8

export async function generateStaticParams() {
  const { prisma } = await import("@/lib/prisma");
  const exams = await prisma.exam.findMany({ where: { isActive: true }, select: { slug: true } });
  return exams.map((e) => ({ slug: e.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function loadExam(slug: string) {
  const exam = await getExamBySlug(slug);
  if (!exam || !exam.isActive) return null;
  return exam;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const exam = await loadExam(slug);
  if (!exam) return { title: "Exam not found" };

  return {
    title: exam.title,
    description: exam.overview.slice(0, 155),
    openGraph: {
      title: exam.title,
      description: exam.overview.slice(0, 155),
      images: exam.coverImageUrl ? [exam.coverImageUrl] : undefined,
    },
  };
}

export default async function ExamHubPage({ params }: PageProps) {
  const { slug } = await params;
  const exam = await loadExam(slug);
  if (!exam) notFound();

  const [resources, pyqs, videos] = await Promise.all([
    listResources({ examSlug: slug, page: 1, pageSize: 12 }),
    listPyqs({ examSlug: slug }),
    listVideos({ examSlug: slug }),
  ]);

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: exam.title,
    description: exam.overview,
    provider: { "@type": "Organization", name: "B.Tech Career Hub" },
  };

  return (
    <div className="container py-6 md:py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <IndexChip>{exam.shortTitle}</IndexChip>
          <h1 className="mt-2 font-display text-2xl font-semibold">{exam.title}</h1>
        </div>
        <SaveButton target={{ examId: exam.id }} />
      </div>

      <Suspense>
        <ExamTabs
          overview={exam.overview}
          eligibility={exam.eligibility}
          examPattern={exam.examPattern}
          syllabus={exam.syllabus}
          resources={resources.items.map(toResourceCardItem)}
          pyqs={pyqs.map(toPyqCardItem)}
          videos={videos.map(toVideoCardItem)}
          cutoffs={exam.cutoffs}
          faqs={exam.faqs}
        />
      </Suspense>
    </div>
  );
}
