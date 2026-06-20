'use client';

import useSWR from 'swr';
import { useState } from 'react';
import type { PaginatedResult, PaginationParams, User, WordEntry } from '../types/api';
import { buildQuery } from '@/lib/pagination';
import { ClientApiError, fetcher } from '@/lib/client';

export function useCurrentUser() {
  const { data, error, isLoading, mutate } = useSWR<User>('/user/me', fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });

  const isUnauthenticated =
    error instanceof ClientApiError && (error.status === 401 || error.status === 403);

  return { user: data, error, isLoading, isUnauthenticated, mutate };
}

export function useMyHistory(initial: PaginationParams = { page: 1, limit: 20 }) {
  const [page, setPage] = useState(initial.page ?? 1);
  const limit = initial.limit ?? 20;

  const { data, error, isLoading, mutate } = useSWR<PaginatedResult<WordEntry>>(
    `/user/me/history${buildQuery({ page, limit })}`,
    fetcher,
    { keepPreviousData: true },
  );

  return { data, error, isLoading, page, setPage, mutate };
}

export function useMyFavorites(initial: PaginationParams = { page: 1, limit: 20 }) {
  const [page, setPage] = useState(initial.page ?? 1);
  const limit = initial.limit ?? 20;

  const { data, error, isLoading, mutate } = useSWR<PaginatedResult<WordEntry>>(
    `/user/me/favorites${buildQuery({ page, limit })}`,
    fetcher,
    { keepPreviousData: true },
  );

  return { data, error, isLoading, page, setPage, mutate };
}
