import { CardSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="container-pad py-20">
      <div className="h-9 w-64 animate-pulse rounded-2xl bg-gray-50" />
      <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded-xl bg-gray-50" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
