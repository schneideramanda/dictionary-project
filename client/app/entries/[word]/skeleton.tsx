import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function WordDetailSkeleton() {
  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-5 w-5" />
      </div>
      <Separator className="my-4" />
      <div className="flex flex-col gap-10 mt-10">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div key={idx}>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10 mt-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
