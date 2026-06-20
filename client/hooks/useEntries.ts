import { fetcher } from '@/lib/client';
import { buildQuery } from '@/lib/pagination';
import { PaginatedResult, PaginationParams, WordEntryDetail } from '@/types/api';
import { useState } from 'react';
import useSWR from 'swr';

export function useEntries(initial: PaginationParams = { page: 1, limit: 20 }) {
  const [page, setPage] = useState(initial.page ?? 1);
  const limit = initial.limit ?? 20;

  const { data, error, isLoading, mutate } = useSWR<PaginatedResult<string>>(
    `/entries/en${buildQuery({ page, limit, search: initial.search })}`,
    fetcher,
    { keepPreviousData: true },
  );

  return { data, error, isLoading, page, setPage, mutate };
}

export function useEntry(word: string) {
  const { data, error, isLoading, mutate } = useSWR<WordEntryDetail[]>(
    `/entries/en/${word}`,
    fetcher,
  );
  return { data: data?.[0], error, isLoading, mutate };
}
