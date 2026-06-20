import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import EntryItem from './entry-item';
import { Pagination, PaginationContent, PaginationItem } from './ui/pagination';
import { Skeleton } from './ui/skeleton';
import { PaginatedResult, WordEntry } from '@/types/api';

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
  data: PaginatedResult<string | WordEntry> | undefined;
  page: number;
  setPage: (page: number) => void;
  isLoading: boolean;
  includeFavorite?: boolean;
}

export default function EntryList({
  data,
  page,
  setPage,
  isLoading,
  includeFavorite = false,
}: EntryListProps) {
  const entries = data?.results;
  const { hasNext, hasPrev, totalPages } = data ?? {};

  if (isLoading) return <ListSkeleton />;

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-4 mt-6">
        {entries && entries.length > 0 ? (
          entries.map((entry, idx) => (
            <EntryItem key={idx} entry={entry} idx={idx} includeFavorite={includeFavorite} />
          ))
        ) : (
          <li className="text-muted-foreground text-center">No entries found.</li>
        )}
      </ul>
      <Pagination>
        <PaginationContent className="gap-3">
          <PaginationItem
            onClick={() => setPage(page - 1)}
            aria-disabled={!hasPrev ? true : undefined}
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50">
            <ChevronLeftIcon aria-hidden="true" size={16} />
          </PaginationItem>
          <PaginationItem>
            <p aria-live="polite" className="text-muted-foreground text-sm">
              Page <span className="text-foreground">{page}</span> of{' '}
              <span className="text-foreground">{totalPages}</span>
            </p>
          </PaginationItem>
          <PaginationItem
            onClick={() => setPage(page + 1)}
            aria-disabled={!hasNext ? true : undefined}
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50">
            <ChevronRightIcon aria-hidden="true" size={16} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
