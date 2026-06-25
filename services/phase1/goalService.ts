import { prisma } from "@/lib/prisma";

export async function getUserGoals(userId: string) {
  return prisma.goal.findMany({
    where: { userId },
    orderBy: [{ isCompleted: "asc" }, { createdAt: "desc" }],
  });
}

export async function createGoal(userId: string, data: {
  title: string; description?: string; targetValue?: number;
  currentValue?: number; unit?: string; deadline?: string; examCategory?: string;
}) {
  return prisma.goal.create({
    data: {
      userId,
      title: data.title,
      description: data.description,
      targetValue: data.targetValue ?? 100,
      currentValue: data.currentValue ?? 0,
      unit: data.unit ?? "percent",
      deadline: data.deadline ? new Date(data.deadline) : undefined,
      examCategory: data.examCategory as never,
    },
  });
}

export async function updateGoal(userId: string, goalId: string, data: {
  title?: string; description?: string; currentValue?: number;
  targetValue?: number; deadline?: string; isCompleted?: boolean;
}) {
  const goal = await prisma.goal.findFirst({ where: { id: goalId, userId } });
  if (!goal) return null;

  const nowCompleted = data.isCompleted ?? (
    data.currentValue !== undefined ? data.currentValue >= goal.targetValue : false
  );

  return prisma.goal.update({
    where: { id: goalId },
    data: {
      ...data,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
      isCompleted: nowCompleted,
      completedAt: nowCompleted && !goal.isCompleted ? new Date() : undefined,
    },
  });
}

export async function deleteGoal(userId: string, goalId: string) {
  return prisma.goal.deleteMany({ where: { id: goalId, userId } });
}
