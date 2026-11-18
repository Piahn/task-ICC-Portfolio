import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const NewsletterRowSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 sm:gap-6 py-6 border-b border-border/50",
        className,
      )}
    >
      <div className="flex-1 space-y-2.5">
        <Skeleton className="h-5 w-3/4 sm:w-1/2" />
        <div className="space-y-1.5 pt-1">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-4/5" />
        </div>
        <div className="pt-2">
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="w-24 sm:w-36 aspect-16/10 rounded-md shrink-0" />
    </div>
  );
};

export default NewsletterRowSkeleton;
