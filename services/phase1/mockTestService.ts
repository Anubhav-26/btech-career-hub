import { prisma } from "@/lib/prisma";

export async function getMockTests(userId: string, examCategory?: string) {
  return prisma.mockTest.findMany({
    where: { userId, ...(examCategory ? { examCategory: examCategory as never } : {}) },
    orderBy: { takenAt: "asc" },
  });
}

export async function getMockTestAnalytics(userId: string, examCategory?: string) {
  const tests = await getMockTests(userId, examCategory);
  if (tests.length === 0) return null;

  const scores = tests.map((t) => ({
    id: t.id,
    date: t.takenAt.toISOString().split("T")[0],
    label: t.testName ?? `Test ${tests.indexOf(t) + 1}`,
    score: t.score,
    totalMarks: t.totalMarks,
    accuracy: Math.round((t.score / t.totalMarks) * 100),
    examCategory: t.examCategory,
  }));

  const accuracies = scores.map((s) => s.accuracy);
  const avgAccuracy = Math.round(accuracies.reduce((a, b) => a + b, 0) / accuracies.length);
  const bestAccuracy = Math.max(...accuracies);

  // Improvement: compare last 3 vs first 3
  const improvement =
    scores.length >= 6
      ? Math.round(
          accuracies.slice(-3).reduce((a, b) => a + b, 0) / 3 -
            accuracies.slice(0, 3).reduce((a, b) => a + b, 0) / 3
        )
      : null;

  return { scores, avgAccuracy, bestAccuracy, improvement, totalTests: tests.length };
}

export async function createMockTest(userId: string, data: {
  examCategory: string; testName?: string; score: number;
  totalMarks: number; takenAt?: string; durationMin?: number;
}) {
  return prisma.mockTest.create({
    data: {
      userId,
      examCategory: data.examCategory as never,
      testName: data.testName,
      score: data.score,
      totalMarks: data.totalMarks,
      takenAt: data.takenAt ? new Date(data.takenAt) : new Date(),
      durationMin: data.durationMin,
    },
  });
}

export async function deleteMockTest(userId: string, id: string) {
  return prisma.mockTest.deleteMany({ where: { id, userId } });
}
