import { Skeleton } from "@/components/ui/skeleton";

export default function ExamLoading() {
  return (
    <div className="container py-6 md:py-8">
      <Skeleton className="h-5 w-20" />
      <Skeleton className="mt-2 h-8 w-2/3" />
      <div className="mt-6 flex gap-2 border-b border-border pb-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 shrink-0" />
        ))}
      </div>
      <div className="mt-6 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
