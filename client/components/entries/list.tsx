import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import EntryItem from './item';
import { PaginatedResult, WordEntry } from '@/types/api';
import { useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { Pagination, PaginationContent, PaginationItem } from '../ui/pagination';
import { Skeleton } from '../ui/skeleton';

function ListSkeleton() {
  return Array.from({ length: 10 }).map((_, idx) => (
    <Skeleton key={idx} className="h-16 mt-4 w-full" />
  ));
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

  // True when this list is a plain word index (browse view), false when it's
  // history/favorites (WordEntry[] with an `added` timestamp).
  const isWordIndex = useMemo(() => {
    if (!entries || entries.length === 0) return false;
    return typeof entries[0] === 'string';
  }, [entries]);

  const groupedByLetter = useMemo(() => {
    if (!entries || !isWordIndex) return undefined;

    return (entries as string[]).reduce(
      (acc, word) => {
        const letterKey = word.charAt(0).toUpperCase();
        if (!acc[letterKey]) {
          acc[letterKey] = [];
        }
        acc[letterKey].push(word);
        return acc;
      },
      {} as Record<string, string[]>,
    );
  }, [entries, isWordIndex]);

  const groupedByDate = useMemo(() => {
    if (!entries || isWordIndex) return undefined;

    return (entries as WordEntry[]).reduce(
      (acc, item) => {
        const dateKey = format(item.added, 'yyyy-MM-dd');
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(item);
        return acc;
      },
      {} as Record<string, WordEntry[]>,
    );
  }, [entries, isWordIndex]);

  const sortedLetters = Object.keys(groupedByLetter ?? {}).sort((a, b) => a.localeCompare(b));

  const sortedDates = Object.keys(groupedByDate ?? {}).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  // Automatically scroll to top whenever the page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [page]);

  if (isLoading) return <ListSkeleton />;

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-10 mt-6">
        {entries && entries.length > 0 ? (
          isWordIndex ? (
            sortedLetters.map(letter => (
              <div key={letter}>
                <h3 className="text-sm font-medium mb-4 ml-2 text-foreground/60 sticky top-0 bg-background/95 backdrop-blur-sm py-1 z-10">
                  {letter}
                </h3>
                <div className="space-y-4">
                  {groupedByLetter?.[letter].map((word, idx) => (
                    <EntryItem
                      key={word}
                      entry={word}
                      idx={idx}
                      includeFavorite={includeFavorite}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : sortedDates.length > 0 ? (
            sortedDates.map(date => (
              <div key={date}>
                <h3 className="text-sm font-medium mb-4 ml-2 text-foreground/60">
                  {format(date, 'PP')}
                </h3>
                <div className="space-y-4">
                  {groupedByDate?.[date].map((entry, idx) => (
                    <EntryItem
                      key={idx}
                      entry={entry}
                      idx={idx}
                      includeFavorite={includeFavorite}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="space-y-4">
              {(entries as WordEntry[]).map((entry, idx) => (
                <EntryItem key={idx} entry={entry} idx={idx} includeFavorite={includeFavorite} />
              ))}
            </div>
          )
        ) : (
          <li className="text-muted-foreground text-center">No entries found.</li>
        )}
      </ul>
      {entries && entries.length > 0 && (
        <Pagination>
          <PaginationContent className="gap-3">
            <PaginationItem
              onClick={() => setPage(page - 1)}
              aria-disabled={!hasPrev ? true : undefined}
              className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
              data-testid="pagination-previous">
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
              className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
              data-testid="pagination-next">
              <ChevronRightIcon aria-hidden="true" size={16} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
