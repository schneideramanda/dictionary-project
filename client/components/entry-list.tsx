import EntryItem from './entry-item';
import { Skeleton } from './ui/skeleton';
import { useEntries } from '@/hooks/useEntries';

function ListSkeleton() {
  return (
    <div className="px-6 py-8">
      {Array.from({ length: 10 }).map((_, idx) => (
        <Skeleton key={idx} className="h-16 mt-4 w-full" />
      ))}
    </div>
  );
}

interface EntryListProps {
  searchParam: string;
}

export default function EntryList({ searchParam }: EntryListProps) {
  const { data, isLoading } = useEntries({ search: searchParam });
  const entries = data?.results;

  if (isLoading) return <ListSkeleton />;

  return (
    <ul className="flex flex-col gap-4 mt-6">
      {entries && entries.length > 0 ? (
        entries.map((entry, idx) => <EntryItem key={idx} entry={entry} idx={idx} />)
      ) : (
        <li className="text-muted-foreground text-center">No entries found.</li>
      )}
    </ul>
  );
}
