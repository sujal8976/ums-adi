import { Skeleton } from "@/components/ui/skeleton";

export function UserSkeleton() {
  return (
    <div className="w-full flex items-center flex-col gap-4">
      <div className="w-full flex justify-around md:justify-between items-center gap-2 flex-wrap">
        <div className="flex flex-grow gap-2">
          <Skeleton className="h-10 w-full min-w-24 max-w-72" />
          <Skeleton className="h-10 w-[140px]" />
          <Skeleton className="h-10 px-5" />
        </div>
        <div />
        <Skeleton className="h-10 w-full max-w-[120px]" />
      </div>
      <Skeleton className="h-96 w-[90svw] md:w-full" />
    </div>
  );
}
