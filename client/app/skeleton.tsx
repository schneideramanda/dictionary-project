import { Skeleton } from '@/components/ui/skeleton';

export default function HomeSkeleton() {
  return (
    <div className="px-6 py-8">
      <Skeleton className="h-10" />
      {Array.from({ length: 10 }).map((_, idx) => (
        <Skeleton key={idx} className="h-16 mt-4 w-full" />
      ))}
    </div>
  );
}
