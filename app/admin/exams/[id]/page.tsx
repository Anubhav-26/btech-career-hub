import { notFound } from "next/navigation";
import { getAdminExam } from "@/services/examService";
import { ExamTabs } from "@/components/admin/exams/ExamTabs";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExamEditorPage({
  params,
}: Props) {
  const { id } = await params;

  const exam = await getAdminExam(id);

  if (!exam) {
    notFound();
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          {exam.title}
        </h1>

        <p className="text-muted-foreground">
          Edit complete exam information
        </p>
      </div>

      <ExamTabs exam={exam} />

    </div>
  );
}